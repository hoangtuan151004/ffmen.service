import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  parentCategory?: Types.ObjectId; // optional
}

const categorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "category", // reference đến chính Category
    default: null,
  },
});

const CategoryModel: Model<ICategory> =
  mongoose.models.category ||
  mongoose.model<ICategory>("category", categorySchema);

export default CategoryModel;
