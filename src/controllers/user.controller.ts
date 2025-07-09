import User, { UserRole } from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// GET ALL USERS
export const GetAllUser = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await User.find({})
      .select(
        "email phoneNumber fullName avatar roles isActive isActiveEmail isActivePhone"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET USER BY ID
export const GetUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId, {
      email: 1,
      phoneNumber: 1,
      fullName: 1,
      avatar: 1,
      roles: 1,
      isActive: 1,
      isActiveEmail: 1,
      isActivePhone: 1,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// UPDATE USER (profile information)
// This endpoint is for users to update their own profile information
export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, avatar } = req.body as {
      fullName?: string;
      phoneNumber?: string;
      avatar?: string;
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        phoneNumber,
        avatar,
      },
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// EDIT user (password)
// This endpoint is for user to edit password
export const EditUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { password }: { password?: string } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Validate password
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
      }

      // Gán trực tiếp, middleware sẽ hash
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (error) {
    console.error("EditUser Error:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi máy chủ",
    });
  }
};

//EDIT Admin(isActive, roles)
// This endpoint is for admin to edit user roles and banned user
export const EditAdmin = async (req: Request, res: Response): Promise<any> => {
  const {
    id,
    roles,
    isActive,
  }: { id: string; roles?: string[]; isActive?: boolean } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Nếu roles được truyền thì cập nhật roles
    if (roles) {
      const validRoles = Object.values(UserRole);

      // Kiểm tra từng role trong input, chỉ giữ lại những role hợp lệ
      const filteredRoles = roles.filter((role) =>
        validRoles.includes(role as UserRole)
      );

      // Nếu không có role hợp lệ thì trả lỗi
      if (filteredRoles.length === 0) {
        return res.status(400).json({ message: "Danh sách role không hợp lệ" });
      }

      user.roles = filteredRoles as UserRole[];
    }

    // Nếu isActive được truyền thì cập nhật isActive
    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    await user.save();

    return res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: {
        id: user._id,
        roles: user.roles,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// DELETE USER
export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
