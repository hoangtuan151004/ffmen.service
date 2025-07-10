import express from "express";
import {
  createOrder,
  getAllOrders,
  getMonthlyRevenue,
  getOrderDetail,
  getOrdersByUser,
  updateOrderStatus,
} from "../controllers/order.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";

const router = express.Router();

// 👤 Người dùng (cần đăng nhập)
router.get("/revenue", authenticateToken, authorizeAdmin, getMonthlyRevenue);
router.post("/", authenticateToken, createOrder);
router.get("/user/:userId", authenticateToken, getOrdersByUser);

// 🔐 Admin (cần đăng nhập + role admin)
router.get("/", authenticateToken, authorizeAdmin, getAllOrders);
router.get("/:id", authenticateToken, authorizeAdmin, getOrderDetail);
router.put("/:id", authenticateToken, authorizeAdmin, updateOrderStatus);

export default router;
