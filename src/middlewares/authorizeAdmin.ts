import { Request, Response, NextFunction } from "express";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      role?: string;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction):any => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới được phép truy cập" });
  }
  next();
};
