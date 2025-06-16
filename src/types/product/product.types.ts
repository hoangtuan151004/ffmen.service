import { Types } from "mongoose";
import { ICategory } from "@/types/category/category.model";
import mongoose from "mongoose";

/** Ảnh sản phẩm */
export interface IImg {
  _id?: Types.ObjectId;
  url: string;
}
/** Review sản phẩm */
export interface IReview {
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  images?: { url: string }[];
  createdAt?: Date;
}
/** Biến thể sản phẩm */
export interface IVariant {
  attributes: Record<string, string>;
  price: number;
  quantity: number;
  sku?: string;
  img?: string;
}
/** Sản phẩm lưu trong DB */
export interface IProduct {
  name: string;
  imgs: IImg[];
  price: number;
  discountPrice?: number;
  rating?: number;
  variants: IVariant[];
  category: mongoose.Types.ObjectId;
  sku?: string;
  isDeleted?: boolean;
  isVisible?: boolean;
  hot?: number;
  view?: number;
  reviews?: IReview[];
  shortDescription?: string;
  longDescription?: string;
}
/** Sản phẩm tạo từ FE */
export interface InsertProductInput {
  name: string;
  imgs: { url: string }[];
  price: number;
  discountPrice?: number;
  quantity: number;
  shortDescription: string;
  longDescription: string;
  category: {
    categoryId: string | Types.ObjectId;
  };
  variants?: {
    attributes: {
      size: string;
      color: string;
    };
    price: number;
    quantity: number;
    sku?: string;
    img?: string;
  }[];
}
