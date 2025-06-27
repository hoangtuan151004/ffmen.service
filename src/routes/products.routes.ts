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

import { authenticateToken } from "@/middlewares/auth.middleware";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

const router = express.Router();

// 🔐(chỉ admin)
router.post(
  "/upload-images",
  authenticateToken,
  authorizeAdmin,
  upload.array("images", 10),
  handleUploadImages
);
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "variantFiles", maxCount: 20 },
  ]),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "variantFiles", maxCount: 20 },
  ]),
  updateProduct
);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteProduct);

// ✅ (public)
router.get("/", getAllProducts);
router.get("/:id", getProductDetail);

export default router;
