// Setup cơ bản
import express from "express";
import dotenv from "dotenv";
import mongoConnect from "./config/MongoConnect";
import authRouter from "@/routes/auth.routes";
import productRouter from "./routes/products.routes";

dotenv.config();
const app = express();

app.use(express.json());

// Kết nối DB
mongoConnect();

// Mount router
app.use("/api/auth", authRouter);
app.use("/products", productRouter); // ✅ Route Tuấn cần

// Cuối cùng mới listen!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
