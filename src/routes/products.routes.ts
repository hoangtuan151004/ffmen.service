import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import mongoose from "mongoose";
import upload from "../middlewares/upload";
import * as productController from "@/controllers/product.controller";
import { uploadImgs } from "@/controllers/product.controller";
const router = express.Router();

// Upload nhiều ảnh
router.post(
  "/upload-images",
  upload.array("images"),
  async (req: Request, res: Response) => {
    try {
      const result = await productController.uploadImgs(
        req.files as Express.Multer.File[],
        req
      );
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);
router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const imgs = await uploadImgs(req.files as Express.Multer.File[], req);
    const bodyWithImgs = { ...req.body, imgs };
    const product = await productController.insert(bodyWithImgs);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Lỗi thêm sản phẩm" });
  }
});

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: "Lỗi khi tải lên file" });
  } else if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
});
router.get("/all", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await productController.getAllProducts(page, limit);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
});

export default router;
