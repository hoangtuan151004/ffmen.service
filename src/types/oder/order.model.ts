import mongoose, { Schema, Document, model } from "mongoose";
import { IOrder } from "./oder.types";

interface IOrderDoc extends IOrder, Document {}

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
    name: { type: String, required: true },
    variant: {
      size: { type: String },
      color: { type: String },
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrderDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPay", "Momo"],
      default: "COD",
    },
    shippingPrice: { type: Number, default: 30000 },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const OrderModel =
  mongoose.models.Order || model<IOrderDoc>("Order", orderSchema);
export default OrderModel;
