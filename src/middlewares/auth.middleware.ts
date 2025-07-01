import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface User {
      id?: string;
      role?: string;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.sendStatus(500); // Internal Server Error if secret is missing

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      req.user = {
        id: (decoded as any).id,
        role: (decoded as any).role,
      };
    }

    next();
  });
};
