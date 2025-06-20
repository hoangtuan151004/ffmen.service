import User from "../types/user/user.model";
import { Request, Response } from "express";

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
export const EditUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, roles } = req.body as {
      password?: string;
      roles?: string[];
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password,
        roles,
      },
      { new: true }
    );

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Something went wrong",
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
