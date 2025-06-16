import express, { Application } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoConnect from "./config/MongoConnect";
// import authMiddleware from "./middlewares/authMiddleware";
// import errorHandler from "./middlewares/errorHandler";
// import authRoutes from "./routes/authRoutes";
// import usersRouter from "./routes/users";
// import categoriesRouter from "./routes/categories";
// import cartRouter from "./routes/cart";
import productRouter from "./routes/products.routes";

dotenv.config();

const app: Application = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static("public"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// CORS config
const corsOptions = {
  origin: ["http://localhost:3001", "http://your-other-allowed-domain.com"],
  credentials: true,
};
app.use(cors(corsOptions));

// Kết nối DB
mongoConnect();

// Routing không cần auth
// app.use("/api/auth", authRoutes);

// Apply auth middleware cho tất cả route sau
// app.use(authMiddleware);
// app.use("/users", usersRouter);
app.use("/products", productRouter);
// app.use("/categories", categoriesRouter);
// app.use("/cart", cartRouter);
// app.use(errorHandler);

export default app;
