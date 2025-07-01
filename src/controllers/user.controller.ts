import User from "../types/user/user.model";
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

// EDIT user (password, roles)
// This endpoint is for admin to edit user roles and password
export const EditUser = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const { password, roles }: { password?: string; roles?: string[] } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật password nếu có
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    // Cập nhật roles nếu có
    if (roles) {
      user.roles = roles.map(role => role as any); 
    }

    await user.save();

    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      user,
    });
  } catch (error) {
    console.error("EditUser Error:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi máy chủ",
    });
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
