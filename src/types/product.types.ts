import { Types } from "mongoose";

/** Ảnh sản phẩm */
export interface IImg {
  _id?: Types.ObjectId;
  url: string;
}

/** Đánh giá sản phẩm */
export interface IReview {
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  images?: { url: string }[];
  createdAt?: Date;
}

/** Biến thể sản phẩm (dùng trong DB) */
export interface IVariant {
  attributes: Record<string, string>; // ví dụ: { size: "M", color: "Đen" }
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
  category: Types.ObjectId;
  sku?: string;
  isDeleted?: boolean;
  isVisible?: boolean;
  hot?: number;
  view?: number;
  reviews?: IReview[];
  shortDescription?: string;
  longDescription?: string;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Biến thể được gửi từ FE khi thêm/sửa */
export interface VariantInput {
  _id?: string;
  attributes: {
    size: string;
    color: string;
    [key: string]: string; // hỗ trợ mở rộng như "chất liệu", "kiểu cổ"...
  };
  price: number;
  quantity: number;
  sku?: string;
  img?: string;
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
  variants?: VariantInput[];
  sku?: string;
  isVisible?: boolean;
  hot?: number;
}

/** Sản phẩm update từ FE */
export interface UpdateProductInput extends Partial<InsertProductInput> {
  deletedVariantIds?: string[]; // Xoá biến thể theo _id
}
