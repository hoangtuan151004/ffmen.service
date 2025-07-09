import express from "express";
import {
  GetUserById,
  UpdateUser,
  GetAllUser,
  DeleteUser,
  EditUser,
  EditAdmin,
} from "../controllers/user.controller";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Chỉ người dùng đăng nhập mới truy cập
router.get("/user/:id", authenticateToken, GetUserById);
router.put("/user/:id", authenticateToken, UpdateUser);
router.put("/user/:id", authenticateToken, EditUser);

// Chỉ admin mới truy cập
router.get("/", authenticateToken, authorizeAdmin, GetAllUser);
router.put("/admin", authenticateToken, authorizeAdmin, EditAdmin);
router.delete("/user/:id", authenticateToken, authorizeAdmin, DeleteUser);

export default router;
