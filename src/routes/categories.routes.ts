import express from "express";
import {
  createCategory,
  getAllCategories,
  getRootCategories,
  getSubCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/controllers/category.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin"; // 👈 thêm dòng này

const router = express.Router();

// 🔐 Chỉ Admin mới được quản lý danh mục
router.post("/", authenticateToken, authorizeAdmin, createCategory);
router.put("/:id", authenticateToken, authorizeAdmin, updateCategory);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteCategory);

// ✅ Public (người dùng được xem)
router.get("/", getAllCategories);
router.get("/roots", getRootCategories);
router.get("/parent/:id", getSubCategories);
router.get("/:id", getCategoryById);

export default router;
