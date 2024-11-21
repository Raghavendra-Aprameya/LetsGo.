import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();
const prisma = new PrismaClient();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_PUBLIC_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

router.post("/create/:tripid", async (req: any, res: any) => {
  try {
    // Validate if the user is logged in
    const user = req.cookies.token;
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Please log in before proceeding." });
    }

    const userid = user.userid;

    // Validate the user
    const data = await prisma.user.findFirst({
      where: { userid },
    });

    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }

    // Fetch trip details
    const tripDetails = await prisma.trip.findUnique({
      where: { id: Number(req.params.tripid) },
    });

    if (!tripDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    // Calculate the total price
    const price = req.body.noTicket * tripDetails!.price * 100; // Amount in paise
    if (!price || price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid price calculation." });
    }

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: price,
      currency: "INR",
      receipt: `receipt_${req.params.tripid}_${userid}`,
    });

    // Send order details to the client
    return res.status(200).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order.",
    });
  }
});

router.get("/verifyPayment", async (req: Request, res: Response) => {
  try {
    const { orderId, paymentId, signature, buyerDetails } = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature === signature) {
      const data = await prisma.booking.create({
        data: {
          userId: buyerDetails.userId,
          tripId: buyerDetails.tripId,
          noTicket: buyerDetails.noTickets,
          paymentId: paymentId,
          bookingDate: buyerDetails.bookingDate, //Issue possible to check if input given is in form of date or string
          orderId: orderId,
          totalAmount: buyerDetails.amount,
        },
      });
      res
        .status(200)
        .json({ success: true, message: "Payment verified", data: data });
    } else {
      res.status(400).json({ success: false, message: "Payment not verified" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected Error" });
  }
});
//cancel booking
//add admin only check
//oauth
export default router;
