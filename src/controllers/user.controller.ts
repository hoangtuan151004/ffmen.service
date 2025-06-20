import User from "../types/user/user.model";
import { Request, Response } from "express";

// GET ALL USERS
export const GetAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, {
      id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      username: 1,
      avatar: 1,
      roles: 1,
      isActive: 1,
      isActivePhone: 1, 
      isActiveEmail: 1,
    }).sort({ createdAt: -1 });

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
export const GetUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId, {
      id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      username: 1,
      avatar: 1,
      roles: 1,
      isActive: 1,
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

// UPDATE USER (email, password, roles)
export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, roles } = req.body as { email?: string; password?: string; roles?: string[] };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        password,
        roles,
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

// EDIT PROFILE
export const EditUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, avatar } =
      req.body as { firstName?: string; lastName?: string; phone?: string; avatar?: string };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        phone,
        avatar,
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
