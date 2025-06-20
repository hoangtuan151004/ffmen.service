import express from "express";
import dotenv from "dotenv";
import mongoConnect from "./config/MongoConnect";
import authRouter from "@/routes/auth.routes";
// import userRouter from "./routes/user.routes";
import productRouter from "./routes/products.routes";
import categoryRouter from "@/routes/category.routes";
dotenv.config();
const app = express();
console.log(typeof categoryRouter);
app.use(express.json());

// Kết nối DB
mongoConnect();

// Mount router
app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/category", categoryRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
