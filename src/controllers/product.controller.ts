// product.controller.ts
import {
  uploadImgs,
  insertProduct,
  getAllProductsService,
  getProductById,
  updateProductById,
  deleteProductById,
  uploadVariantImgs,
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
    const filesObj = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // 🖼️ Ảnh chính
    const imgs = await uploadImgs(filesObj["files"] || [], req);

    // 🔄 Parse variants
    const variants = JSON.parse(req.body.variants || "[]");

    // 🖼️ Gán ảnh vào biến thể (nếu có)
    await uploadVariantImgs(
      filesObj["variantFiles"] || [],
      req.body.variantImgIndexes,
      variants
    );

    const product = await insertProduct({
      ...req.body,
      imgs,
      variants,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    console.error("❌ Lỗi tại createProduct:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    // req.files giờ là object chứa mảng file cho từng field
    const filesObj = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Xử lý ảnh sản phẩm chính
    const imgs = await uploadImgs(filesObj["files"] || [], req);

    // Parse biến thể và danh sách biến thể bị xoá từ body
    const variants = JSON.parse(req.body.variants || "[]");
    const deletedVariantIds = JSON.parse(req.body.deletedVariantIds || "[]");

    // Upload ảnh biến thể (nếu có)
    await uploadVariantImgs(
      filesObj["variantFiles"] || [],
      req.body.variantImgIndexes,
      variants
    );

    // Cập nhật product
    const updated = await updateProductById(productId, {
      name: req.body.name,
      price: Number(req.body.price),
      discountPrice: Number(req.body.discountPrice),
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      category: JSON.parse(req.body.category || "{}"),
      imgs,
      variants,
      deletedVariantIds,
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updated,
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật sản phẩm:", error.message);
    res.status(500).json({ success: false, message: error.message });
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
