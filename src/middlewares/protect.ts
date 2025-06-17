import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@/types/user/user.model";
import { IUser } from "@/types/user/user.model";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = (await User.findById(decoded.id).select("-password")) as IUser;

    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    req.user = user; // 👈 gán vào đây

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
