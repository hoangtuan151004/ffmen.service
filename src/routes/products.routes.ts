import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import mongoose from "mongoose";
import upload from "../middlewares/upload";
import * as productController from "@/controllers/product";
import productModel from "../types/product/product.model";
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

router.post("/", async (req, res) => {
  console.log("POST /products/ route hit", req.body);
  try {
    const product = await productController.insert(req.body);
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

// router.get("/page", async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const productData = await productController.getProPage(page, limit);
//     res.status(200).json(productData);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/total-products", async (req: Request, res: Response) => {
//   try {
//     const products = await productController.getAll();
//     res.status(200).json({ totalProducts: products.totalProducts });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/all", async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const pros = await productController.getpros(page, limit);
//     console.log("Dữ liệu trả về:", pros);
//     res.status(200).json(pros);
//   } catch (error: any) {
//     console.error("Lỗi khi lấy tất cả sản phẩm:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/detail/:id", async (req: Request, res: Response) => {
//   try {
//     const sp = await productController.getProductDetail(req.params.id);
//     res.status(200).json(sp);
//   } catch (error: any) {
//     res.status(500).json({ mess: error });
//   }
// });

// router.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const product = await productController.getProductById(req.params.id);
//     res.status(200).json(product);
//   } catch (error: any) {
//     res.status(500).json({ message: error });
//   }
// });

// router.put("/:id", async (req: Request, res: Response) => {
//   try {
//     const updatedProduct = await productController.updateById(
//       req.params.id,
//       req.body
//     );
//     res.status(200).json(updatedProduct);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.delete("/:id", async (req: Request, res: Response) => {
//   try {
//     const proDel = await productController.remove(req.params.id);
//     res.status(200).json({ ProductDelete: proDel });
//   } catch (error: any) {
//     res.status(500).json({ mess: error });
//   }
// });

// router.get("/category/:categoryId", async (req: Request, res: Response) => {
//   try {
//     const products = await productController.getByCategory(
//       req.params.categoryId
//     );
//     res.status(200).json(products);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get("/search/:key/:value", async (req: Request, res: Response) => {
//   try {
//     const product = await productController.getByKey(
//       req.params.key,
//       req.params.value
//     );
//     res.status(200).json({ Product: product });
//   } catch (error: any) {
//     res.status(500).json({ message: error });
//   }
// });

// router.get("/all", async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const proPage = await productController.getProPage(page, limit);
//     res.status(200).json({ proPage });
//   } catch (error: any) {
//     res.status(500).json({ message: error });
//   }
// });
router.get("/test", (req, res) => {
  console.log("Route /products/test được gọi nè!");
  res.json({ message: "Test route ok" });
});
export default router;
