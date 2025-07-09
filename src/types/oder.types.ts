import { Types } from "mongoose";

/** Thông tin từng sản phẩm trong đơn hàng */
  export interface IOrderItem {
    productId: Types.ObjectId | string;
    name: string;
    variant?: {
      size?: string;
      color?: string;
    };
    quantity: number;
    price: number;
    img: string;
  }

  /** Địa chỉ giao hàng */
  export interface IShippingAddress {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string; // chi tiết (số nhà, đường...)
  }

  /** Enum status đơn hàng */
  export type OrderStatus =
    | "pending"
    | "confirmed"
    | "shipping"
    | "delivered"
    | "cancelled";

  /** Order lưu trong DB */
  export interface IOrder {
    user: Types.ObjectId | string;
    orderItems: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: "COD" | "VNPay" | "Momo";
    shippingPrice: number;
    total: number;
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    status: OrderStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }
