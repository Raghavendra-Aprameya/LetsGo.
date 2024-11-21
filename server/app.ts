import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Express = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
import userRoutes from "./routes/userRoute";

app.use("/api/v1/users", userRoutes);
import tripRoutes from "./routes/tripRoute";
app.use("/api/v1/trips", tripRoutes);
import bookingRoutes from "./routes/bookingRoute";
app.use("/api/v1/bookings", bookingRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace for debugging

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
});
export default app;
