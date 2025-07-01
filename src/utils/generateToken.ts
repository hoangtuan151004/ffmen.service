import jwt from "jsonwebtoken";

interface Payload {
  id: string;
  role: string;
}

export const generateToken = ({ id, role }: Payload) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d", // Token hết hạn sau 7 ngày
  });
};
