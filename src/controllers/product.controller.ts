// product.controller.ts
import {
  uploadImgs,
  insertProduct,
  getAllProductsService,
  getProductById,
  updateProductById,
  deleteProductById,
} from "@/services/product.service";
import { Request, Response } from "express";

export const handleUploadImages = async (req: Request, res: Response) => {
  try {
    const imgs = await uploadImgs(req.files as Express.Multer.File[], req);
    res.status(200).json({ success: true, data: imgs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log(">>> req.body:", req.body); // Log kiểm tra
    const imgs = await uploadImgs(req.files as Express.Multer.File[], req);
    const product = await insertProduct({ ...req.body, imgs });
    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    console.error("❌ Lỗi tại createProduct:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export async function getAllProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getAllProductsService(page, limit);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "server error" });
  }
}
export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    res.status(200).json(product);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Lỗi không xác định" });
  }
};
export async function updateProduct(req: Request, res: Response) {
  try {
    const productId = req.params.id;
    const data = req.body;

    const updated = await updateProductById(productId, data);
    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId = req.params.id;
    const result = await deleteProductById(productId);
    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Xóa sản phẩm thất bại",
    });
  }
}
