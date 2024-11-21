import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AppError from "../utils/AppError";
const prisma = new PrismaClient();
const router = express.Router();
import { optional, z, ZodObject } from "zod";
import { describe } from "node:test";

const tripSchema = z.object({
  name: z.string(),

  description: z
    .object({
      description: z.string().optional(),
      inclusion: z.string().optional(),
      exclusion: z.string().optional(),
      dos: z.string().optional(),
      donts: z.string().optional(),
    })
    .optional(),
  price: z.number(),
  date: z.array(z.string()),
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await prisma.trip.findMany({});
    res.status(200).json({
      success: true,
      message: "Trips data sent successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch the data",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const tripid = Number(req.params.id);
    const data = await prisma.trip.findFirst({
      where: {
        id: tripid,
      },
    });
    if (!data) {
      res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trips data sent successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch the data",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const result = tripSchema.safeParse(req.body);

    if (result.success) {
      const inclusion = result.data.description?.inclusion
        ? result.data.description.inclusion.split(".")
        : [];
      const exclusion = result.data.description?.exclusion
        ? result.data.description.exclusion.split(".")
        : [];
      const dos = result.data.description?.dos
        ? result.data.description.dos.split(".")
        : [];
      const donts = result.data.description?.donts
        ? result.data.description.donts.split(".")
        : [];

      // Parse dates
      const dates = result.data.date.map(
        (dateStr: string) => new Date(dateStr)
      );

      const data = await prisma.trip.create({
        data: {
          name: result.data.name,
          description: {
            description: result.data.description?.description,
            inclusion: inclusion,
            exclusion: exclusion,
            dos: dos,
            donts: donts,
          },
          price: result.data.price,
          date: dates,
        },
      });

      res.status(201).json({
        success: true,
        message: "Trip created successfully",
        data: data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.format(),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unexpected Error" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const data = await prisma.trip.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        date: req.body.date,
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Updated Succesfully", data: data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected Error" });
  }
});
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = await prisma.trip.delete({
      where: {
        id: id,
      },
    });
    if (!data) {
      res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected Error" });
  }
});
export default router;
