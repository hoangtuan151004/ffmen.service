import express from "express";
import {
  GetUserById,
  UpdateUser,
  GetAllUser,
  DeleteUser,
  EditUser,
} from "../controllers/user.controller";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Chỉ người dùng đăng nhập mới truy cập
router.get("/user/:id", authenticateToken, GetUserById);
router.patch("/user/:id", authenticateToken, UpdateUser);

router.put("/user/:id",  EditUser);

// Chỉ admin mới truy cập
router.get("/", authenticateToken, authorizeAdmin, GetAllUser);
router.delete("/user/:id", authenticateToken, authorizeAdmin, DeleteUser);

export default router;
