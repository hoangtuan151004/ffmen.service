import CategoryModel, { ICategory } from "@/types/category/category.model";
import { CreateCategoryInput } from "../types/category/category.types";
import ProductModel from "@/types/product/product.model";
import { Types } from "mongoose";

export const createCategoryService = async (
  input: CreateCategoryInput
): Promise<ICategory> => {
  const { name, description, icon, parentCategory } = input;

  if (!name || !description) {
    throw new Error("Tên và mô tả là bắt buộc");
  }

  if (parentCategory) {
    const parent = await CategoryModel.findById(parentCategory);
    if (!parent) throw new Error("Parent category không tồn tại");
  }

  const category = await CategoryModel.create({
    name,
    description,
    icon,
    parentCategory: parentCategory || null,
  });

  return category;
};

export const getAllCategoriesService = async (): Promise<ICategory[]> => {
  try {
    const categories = await CategoryModel.find().populate(
      "parentCategory",
      "name _id"
    );
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    throw new Error("Không thể lấy danh mục");
  }
};

export const getCategoryByIdService = async (
  id: string
): Promise<ICategory | null> => {
  return await CategoryModel.findById(id).populate("parentCategory", "name");
};

export const updateCategoryService = async (
  id: string,
  updateData: Partial<ICategory>
): Promise<ICategory | null> => {
  return await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCategoryService = async (
  id: string
): Promise<ICategory | null> => {
  const objectId = new Types.ObjectId(id);

  console.log("Check if category has products:", id);

  const existingProduct = await ProductModel.exists({
    category: new Types.ObjectId(id),
  });

  console.log("Found product:", existingProduct);

  if (existingProduct) {
    throw new Error("Không thể xoá vì vẫn còn sản phẩm thuộc danh mục này.");
  }

  return await CategoryModel.findByIdAndDelete(objectId);
};

export const getRootCategoriesService = async (): Promise<ICategory[]> => {
  return await CategoryModel.find({ parentCategory: null });
};

export const getSubCategoriesService = async (
  parentId: string
): Promise<ICategory[]> => {
  return await CategoryModel.find({ parentCategory: parentId });
};
