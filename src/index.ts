import express, { Application } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoConnect from "./config/MongoConnect";
import authRouter from "@/routes/auth.routes";
// import authMiddleware from "./middlewares/authMiddleware";
// import errorHandler from "./middlewares/errorHandler";
// import authRoutes from "./routes/authRoutes";
// import usersRouter from "./routes/users";
// import categoriesRouter from "./routes/categories";
// import cartRouter from "./routes/cart";
import productRouter from "./routes/products.routes";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ đúng cách

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});

// Kết nối DB
mongoConnect();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
// Routing không cần auth
app.use("/api/auth", authRouter);

// Apply auth middleware cho tất cả route sau
// app.use(authMiddleware);
// app.use("/users", usersRouter);
app.use("/products", productRouter);
// app.use("/categories", categoriesRouter);
// app.use("/cart", cartRouter);
// app.use(errorHandler);

export default app;
