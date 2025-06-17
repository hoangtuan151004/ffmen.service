// src/middlewares/authorize.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./protect";
import { UserRole } from "@/types/user/user.model"; // enum ["customer", "admin", ...]

export const authorize =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    const userRoles = req.user.roles || [];

    const hasRole = userRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập tài nguyên này" });
    }

    next();
  };
