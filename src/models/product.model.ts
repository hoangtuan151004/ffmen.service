import mongoose, { Schema, Document, model } from "mongoose";
import { IReview, IProduct, IImg, IVariant } from "../types/product.types";

interface IProductDoc extends IProduct, Document {}

const imgSchema = new Schema<IImg>(
  {
    url: { type: String, required: true },
  },
  { _id: true }
);
const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [
      {
        url: { type: String, required: true },
        _id: false,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
const variantSchema = new Schema<IVariant>({
  attributes: {
    type: Map,
    of: String,
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sku: { type: String },
  img: { type: String },
});

const productSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true },
    imgs: { type: [imgSchema], required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    variants: { type: [variantSchema], default: [] },
    quantity: { type: Number, default: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    sku: { type: String, unique: true, sparse: true },
    isVisible: { type: Boolean, default: true },
    hot: { type: Number },
    view: { type: Number },
    reviews: { type: [reviewSchema], default: [] },

    shortDescription: { type: String },
    longDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.product ||
  model<IProductDoc>("product", productSchema);
