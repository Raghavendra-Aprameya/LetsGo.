// import express, { Express } from "express";
import dotenv from "dotenv";
import "./utils/cronJob";

dotenv.config({ path: "server/.env" });
import app from "./app";

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// app.get("/", async (req, res) => {
//   try {
//     const data = await prisma.user.create({
//       data: {
//         Firstname: "A",
//         email: "A",
//         password: "A",
//         phone: "1",
//       },
//     });
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
