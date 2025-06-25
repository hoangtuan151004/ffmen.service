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
  quantity?: number;
}
/** Sản phẩm tạo từ FE */
export interface InsertProductInput {
  name: string;
  imgs: { url: string }[];
  price: number;
  discountPrice?: number;
  shortDescription: string;
  longDescription: string;
  quantity?: number;
  category: {
    categoryId: string;
    categoryName?: string;
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
  sku?: string;
  isVisible?: boolean;
  hot?: number;
}

/** Dùng khi update sản phẩm từ FE */
export interface UpdateProductInput extends Partial<InsertProductInput> {
  deletedVariantIds?: string[]; // Danh sách variant cần xoá theo _id
}
// export interface VariantInput {
//   _id?: string;
//   attributes: {
//     size: string;
//     color: string;
//     [key: string]: any;
//   };
//   price: number;
//   quantity: number;
//   sku?: string;
//   img?: string;
// }

// export interface UpdatedVariant {
//   _id?: any;
//   attributes: {
//     size: string;
//     color: string;
//     [key: string]: any;
//   };
//   price: number;
//   quantity: number;
//   sku: string;
//   img: string;
// }

export interface VariantInput {
  _id?: string;
  attributes: {
    size: string;
    color: string;
  };
  price: number;
  quantity: number;
  sku?: string;
  img?: string;
}

export interface UpdateProductInput {
  name?: string;
  imgs?: { url: string }[];
  price?: number;
  discountPrice?: number;
  shortDescription?: string;
  longDescription?: string;
  category?: {
    categoryId: string;
  };
  variants?: VariantInput[];
  deletedVariantIds?: string[];
  sku?: string;
  isVisible?: boolean;
  hot?: number;
}
