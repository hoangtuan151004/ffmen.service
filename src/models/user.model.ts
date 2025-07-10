import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// 1. Enum role để tránh hard-code string
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  STAFF = "staff",
}

// 2. Interface cho document user

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  isActiveEmail: boolean;
  isActivePhone: boolean;
  avatar?: string;
  roles: UserRole[];
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 3. Schema định nghĩa
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // không trả về khi query
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.CUSTOMER],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isActiveEmail: {
      type: Boolean,
      default: false,
    },
    isActivePhone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 4. Middleware hash password trước khi lưu
userSchema.pre<IUser>("save", async function (next) {
  // if (!this.isModified("password")) return next(); // bug can't change password 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

// 5. Method so sánh mật khẩu
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 6. Model export
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
