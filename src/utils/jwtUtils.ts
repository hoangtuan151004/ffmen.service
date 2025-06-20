// import dotenv from "dotenv";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request } from "express";
// import User, { IUser } from "@/types/user/user.model";

// dotenv.config();

// interface TokenPayload extends JwtPayload {
//   id: string;
// }

// export const getTokenFromHeaders = (req: Request): string | null => {
//   const auth = req.headers.authorization;
//   if (auth && auth.startsWith("Bearer ")) return auth.split(" ")[1];
//   return null;
// };

// export const verifyToken = async (token: string): Promise<IUser | null> => {
//   try {
//     if (!token) return null;

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as TokenPayload;

//     if (!decoded.id) return null;

//     const user = await User.findById(decoded.id);
//     return user;
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return null;
//   }
// };

// export const generateToken = (payload: object): string => {
//   const secret = process.env.JWT_SECRET as string;
//   const expiresIn = process.env.JWT_EXPIRES_IN as string;

//   if (!secret || !expiresIn) {
//     throw new Error(
//       "Missing JWT_SECRET or JWT_EXPIRES_IN in environment variables"
//     );
//   }

//   return jwt.sign(payload, secret, { expiresIn });
// };
