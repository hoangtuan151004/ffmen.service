import express from "express";
import { Register, Login, Logout, CreateNewAccessCode, ValidateAccessCode } from "@/controllers/auth.controller";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/resend-otp", CreateNewAccessCode);
router.post("/verify-otp", ValidateAccessCode);

export default router; 