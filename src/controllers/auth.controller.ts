import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model";
import { sendResendOtp } from "../utils/sendResendOtp";
import { sendWelcomeEmail } from "../utils/sendWellcome";
import { sendWhatsapp } from "../utils/sendWhatsapp";
import generateOtp from "../utils/generateOtp";
import { generateToken } from "../utils/generateToken";
import { SessionData } from "express-session";

const otpStore = new Map<string, string>();

// ✅ Gửi OTP
export const CreateNewAccessCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, phoneNumber }: { email?: string; phoneNumber?: string } =
    req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ message: "Thiếu email hoặc số điện thoại" });
  }

  let formattedPhone = phoneNumber?.startsWith("0")
    ? "+84" + phoneNumber.slice(1)
    : phoneNumber;

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
      await sendWhatsapp(formattedPhone!, otp);
      return res.json({ message: "Đã gửi OTP qua WhatsApp" });
    }
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Gửi OTP thất bại", error: err.message });
  }
};

// ✅ Xác minh OTP
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
    return res.status(400).json({ message: "Thiếu thông tin xác minh" });
  }

  const target =
    email?.toLowerCase().trim() ||
    (phoneNumber?.startsWith("0") ? "+84" + phoneNumber.slice(1) : phoneNumber);

  if (!target) {
    return res
      .status(400)
      .json({ message: "Không có thông tin xác thực hợp lệ" });
  }

  const savedOtp = otpStore.get(target);
  if (!savedOtp) return res.status(400).json({ message: "Không tìm thấy OTP" });

  if (savedOtp === otp) {
    otpStore.delete(target);
    return res.json({
      message: "Xác minh thành công",
      isActiveEmail: !!email,
      isActivePhone: !!phoneNumber,
    });
  }

  return res.status(400).json({ message: "OTP không đúng" });
};

export const VerifyOtpToResetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, phoneNumber, otp } = req.body;

    if (!otp || (!email && !phoneNumber)) {
      return res.status(400).json({ message: "Thiếu thông tin yêu cầu" });
    }

    // Chuẩn hóa input
    const rawEmail = email?.normalize("NFC").toLowerCase().trim();
    const rawPhone = phoneNumber?.startsWith("0")
      ? "+84" + phoneNumber.slice(1)
      : phoneNumber;

    // Tìm người dùng
    let user = null;
    let target = "";

    if (rawEmail) {
      user = await User.findOne({ email: rawEmail });
      target = rawEmail;
    } else if (rawPhone) {
      user = await User.findOne({ phoneNumber: rawPhone });
      target = rawPhone;
    } else {
      return res
        .status(400)
        .json({ message: "Thiếu email hoặc số điện thoại" });
    }

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra trạng thái active
    if (rawEmail && !user.isActiveEmail) {
      return res.status(403).json({ message: "Email chưa được xác minh" });
    }
    if (rawPhone && !user.isActivePhone) {
      return res
        .status(403)
        .json({ message: "Số điện thoại chưa được xác minh" });
    }

    // Kiểm tra mã OTP
    const savedOtp = otpStore.get(target);
    if (!savedOtp || savedOtp !== otp) {
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    return res.status(200).json({ message: "Xác minh OTP thành công" });
  } catch (error) {
    console.error("VerifyOtpToResetPassword error:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const Register = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      roles, // 👈 Lấy đúng từ req.body.roles
    }: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber: string;
      roles?: string[]; // 👈 dạng array
    } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email đã được đăng ký" });
    }

    const formattedPhone = phoneNumber.startsWith("0")
      ? "+84" + phoneNumber.slice(1)
      : phoneNumber;

    await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      phoneNumber: formattedPhone,
      password,
      roles: roles || ["customer"],
    });

    await sendWelcomeEmail(email, fullName);

    res.status(201).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra" });
  }
};

// ✅ Đăng nhập
export const Login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu không đúng" });

    const token = generateToken({
      id: user.id.toString(),
      role: user.roles[0],
    });

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
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi đăng nhập" });
  }
};

// ✅ Đăng xuất
export const Logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie("token");

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Lỗi khi xoá session:", err);
          res.status(500).json({ message: "Lỗi khi đăng xuất" });
        } else {
          res.status(200).json({ message: "Đăng xuất thành công" });
        }
      });
    } else {
      res.status(200).json({ message: "Đăng xuất thành công" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Đã có lỗi khi đăng xuất" });
  }
};

// Reset Password
export const resetPasswordController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
    }

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công." });
  } catch (error) {
    console.error("Lỗi reset-password:", error);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
