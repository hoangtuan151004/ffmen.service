import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d", // thời hạn token
  });
};
