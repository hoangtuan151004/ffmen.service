import express, { Request, Response } from "express";
import { login, register } from "../controllers/auth.controller";
// import { authorize } from "@/middlewares/authorize";
// import { UserRole } from "@/types/user/user.model";
// import { protect } from "@/middlewares/protect";
const router = express.Router();
console.log("✅ auth.routes.ts loaded");

router.post("/register", (req, res) => {
  console.log("POST /register hit!");
  res.send("test");
});

router.post("/login", (req, res) => {
  console.log("POST /login hit!");
  res.send("test");
});
// router.get("/admin-only", (req, res, next) => {
//   protect(req, res, (err) => {
//     if (err) return next(err);
//     authorize(UserRole.ADMIN)(req, res, (err2) => {
//       if (err2) return next(err2);
//       res.json({ message: "Hello Admin!" });
//     });
//   });
// });

// router.get("/me", (req, res, next) => {
//   protect(req, res, (err) => {
//     if (err) return next(err);
//     res.json({ message: "Đây là thông tin user", user: req.user });
//   });
// });

export default router;
