import {
  Register,
  Login,
  Logout,
  CreateNewAccessCode,
  ValidateAccessCode,
  VerifyOtpToResetPassword,
  resetPasswordController,
} from "@/controllers/auth.controller";

import express from "express";
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/resend-otp", CreateNewAccessCode);
router.post("/verify-account", ValidateAccessCode);
router.post("/verify-password", VerifyOtpToResetPassword);
router.put("/reset-password", resetPasswordController);

export default router;
