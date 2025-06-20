import { Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  getRootCategoriesService,
  getSubCategoriesService,
  updateCategoryService,
} from "../services/category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await createCategoryService(req.body);
    res
      .status(201)
      .json({ message: "Tạo danh mục thành công", data: category });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const getAllCategories = async (_req: Request, res: Response) => {
  const data = await getAllCategoriesService();
  res.json(data);
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    return res
      .status(200)
      .json({ message: "Lấy danh mục thành công", data: category });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Đã xảy ra lỗi khi lấy danh mục" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedCategory = await updateCategoryService(
      req.params.id,
      req.body
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để cập nhật" });
    }
    return res
      .status(200)
      .json({ message: "Cập nhật danh mục thành công", data: updatedCategory });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Đã xảy ra lỗi khi cập nhật danh mục",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const deletedCategory = await deleteCategoryService(req.params.id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để xóa" });
    }
    return res
      .status(200)
      .json({ message: "Xóa danh mục thành công", data: deletedCategory });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Đã xảy ra lỗi khi xóa danh mục" });
  }
};

export const getRootCategories = async (_req: Request, res: Response) => {
  const roots = await getRootCategoriesService();
  res.json(roots);
};

export const getSubCategories = async (req: Request, res: Response) => {
  const children = await getSubCategoriesService(req.params.id);
  res.json(children);
};
