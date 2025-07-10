import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  parentCategory?: Types.ObjectId;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);

const CategoryModel: Model<ICategory> =
  mongoose.models.category ||
  mongoose.model<ICategory>("category", categorySchema);

export default CategoryModel;
