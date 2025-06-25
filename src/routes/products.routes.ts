import express from "express";
import upload from "../middlewares/upload";
import {
  handleUploadImages,
  createProduct,
  getAllProducts,
  getProductDetail,
  updateProduct,
  deleteProduct,
} from "@/controllers/product.controller";
const router = express.Router();

// Upload nhiều ảnh
router.post("/upload-images", upload.array("images", 10), handleUploadImages);
router.post("/", upload.array("files", 10), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductDetail);
router.put("/:id", upload.array("files", 10), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
