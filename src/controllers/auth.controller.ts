import { Request, Response } from "express";
import User from "@/types/user/user.model";
import { IUser } from "@/types/user/user.model";
import { generateToken } from "@/utils/generateToken";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const newUser = await User.create({ email, fullName, password });

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        roles: newUser.roles,
      },
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne<IUser>({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email hoặc mật khẩu sai" });
    }

    const token = generateToken(user.id.toString());

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
