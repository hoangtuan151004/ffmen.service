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
router.post(
  "/",
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "variantFiles", maxCount: 20 },
  ]),
  createProduct
);

router.get("/", getAllProducts);
router.get("/:id", getProductDetail);
router.put(
  "/:id",
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "variantFiles", maxCount: 20 },
  ]),
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;
