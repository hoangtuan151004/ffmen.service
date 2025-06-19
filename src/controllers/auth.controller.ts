import bcrypt from "bcryptjs";
import { sendResendOtp } from "../utils/sendResendOtp";
import { Request, Response } from "express";
import generateOtp from "../utils/generateOtp";
import { generateToken } from "../utils/generateToken";
import User from "../types/user/user.model";
import { IUser } from "@/types/user/user.model";
import { sendWelcomeEmail } from "../utils/sendWellcome";

const otpStore = new Map<string, string>();

// Gửi OTP qua email hoặc WhatsApp
export const CreateNewAccessCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, phoneNumber }: { email?: string; phoneNumber?: string } =
    req.body || {};

  if (!email && !phoneNumber) {
    return res.status(400).json({ message: "Thiếu email hoặc số điện thoại" });
  }

  let formattedPhone = phoneNumber;
  if (formattedPhone?.startsWith("0")) {
    formattedPhone = "+84" + formattedPhone.slice(1);
  }

  const user = await User.findOne(
    email
      ? { email: email.toLowerCase().trim() }
      : { phoneNumber: formattedPhone }
  );

  if (!user) {
    return res
      .status(404)
      .json({ message: "Email hoặc số điện thoại chưa được đăng ký" });
  }

  const target = email || formattedPhone!;
  const otp = generateOtp();
  otpStore.set(target, otp);

  try {
    if (email) {
      await sendResendOtp(email, otp);
      return res.json({ message: "Đã gửi OTP qua Email" });
    } else {
      // await sendWhatsapp(formattedPhone!, otp);
      return res.json({ message: "Đã gửi OTP qua WhatsApp" });
    }
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Gửi OTP thất bại", error: err.message });
  }
};
export const ValidateAccessCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    email,
    phoneNumber,
    otp,
  }: { email?: string; phoneNumber?: string; otp: string } = req.body;

  if (!otp || (!email && !phoneNumber)) {
    res.status(400).json({ message: "Thiếu thông tin xác minh" });
    return;
  }

  // Chuẩn hóa key: email hoặc số điện thoại
  const target =
    email?.toLowerCase().trim() ||
    (phoneNumber?.startsWith("0") ? "+84" + phoneNumber.slice(1) : phoneNumber);

  if (!target) {
    res.status(400).json({ message: "Không có thông tin xác thực hợp lệ" });
    return;
  }

  const savedOtp = otpStore.get(target);

  if (!savedOtp) {
    res.status(400).json({ message: "Không tìm thấy OTP" });
    return;
  }

  if (savedOtp === otp) {
    otpStore.delete(target);
    res.json({ message: "Xác minh thành công" });
    return;
  } else {
    res.status(400).json({ message: "OTP không đúng" });
    return;
  }
};

// Đăng ký
export const Register = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email đã được đăng ký" });
    }

    await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password,
    });

    // ✅ Gửi email chào mừng
    await sendWelcomeEmail(email, fullName);

    res.status(201).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

// Đăng nhập
export const Login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password"); // Thêm để lấy password từ DB

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    const token = await generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi đăng nhập" });
  }
};

// Đăng xuất
export const Logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Đã có lỗi khi đăng xuất" });
  }
};
