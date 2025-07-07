import "@/models/user.model";
import express from "express";
import dotenv from "dotenv";
import mongoConnect from "./config/MongoConnect";
import authRouter from "@/routes/auth.routes";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/products.routes";
import categoriesRouter from "@/routes/categories.routes";
import orderRoutes from "./routes/order.routes";

import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Kết nối DB
mongoConnect();

// Mount router
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", orderRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
