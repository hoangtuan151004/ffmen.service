import { IUser } from "@/types/user/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
