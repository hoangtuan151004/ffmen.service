import { IProduct, InsertProductInput } from "@/types/product/product.types";
import productModel from "@/types/product/product.model";
import categoryModel from "@/types/category/category.model";
import ProductResponse from "../response/productResponse";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { umask } from "process";

export async function uploadImgs(
  files: Express.Multer.File[] | undefined,
  req: Request
): Promise<IProduct["imgs"]> {
  try {
    const imgs: IProduct["imgs"] = [];

    if (files?.length) {
      const fileUrls = files.map((file) => ({ url: file.path }));
      imgs.push(...fileUrls);
    }

    let imgUrls = req.body.imgUrls;
    if (typeof imgUrls === "string") {
      try {
        imgUrls = JSON.parse(imgUrls);
      } catch {
        throw new Error("Danh sách link ảnh không hợp lệ");
      }
    }

    if (Array.isArray(imgUrls)) {
      const linkImgs = imgUrls.map((url: string) => ({ url }));
      imgs.push(...linkImgs);
    }

    if (imgs.length === 0) {
      throw new Error("Không có ảnh nào được cung cấp");
    }

    return imgs;
  } catch (error: any) {
    console.error("Lỗi upload ảnh:", error.message);
    throw new Error(error.message);
  }
}

export async function insertProduct(
  body: InsertProductInput
): Promise<IProduct> {
  try {
    const {
      name,
      imgs,
      price,
      discountPrice,
      shortDescription,
      longDescription,
      category,
      variants,
    } = body;

    if (
      !name ||
      !imgs ||
      !shortDescription ||
      !longDescription ||
      !price ||
      !category?.categoryId
    ) {
      throw new Error("Thông tin sản phẩm không đầy đủ");
    }

    if (!Array.isArray(imgs) || imgs.some((img) => !img.url)) {
      throw new Error("Ảnh không hợp lệ. Mỗi ảnh phải có trường 'url'.");
    }

    const categoryFind = await categoryModel.findById(category.categoryId);
    if (!categoryFind) throw new Error("Không tìm thấy danh mục");

    const formattedVariants: IProduct["variants"] =
      variants?.map((variant) => {
        const { attributes, price, quantity } = variant;

        if (!attributes?.size || !attributes?.color)
          throw new Error(
            "Mỗi biến thể phải có attributes đầy đủ: size & color"
          );

        return {
          attributes,
          price,
          quantity,
          sku: variant.sku || "",
          img: variant.img || "",
        };
      }) || [];

    const newProduct = new productModel({
      name,
      imgs,
      price,
      discountPrice: discountPrice || 0,
      rating: 0,
      variants: formattedVariants,
      category: categoryFind._id,
      shortDescription,
      longDescription,
      isVisible: true,
    });

    return await newProduct.save();
  } catch (error: any) {
    console.error("Lỗi insert product:", error.message);
    throw new Error(error.message);
  }
}

export async function getpros(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const totalItems = await productModel.countDocuments();
    const result = await productModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return new ProductResponse<IProduct[]>(
      totalItems,
      Math.ceil(totalItems / limit),
      page,
      result
    );
  } catch (error: any) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    throw error;
  }
}

// export async function getProductById(productId: string) {
//   try {
//     return await productModel.findById(productId);
//   } catch (error: any) {
//     console.error("Lỗi lấy thông tin sản phẩm", error);
//     throw error;
//   }
// }
export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
};

export async function getAllProductsService(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const totalProducts = await productModel.countDocuments({ isVisible: true });

  const products = await productModel
    .find({ isVisible: true })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("category");

  const totalPages = Math.ceil(totalProducts / limit);

  return new ProductResponse(totalProducts, totalPages, page, products);
}

export async function getProductById(productId: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    const product = await productModel.findById(productId);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    return product;
  } catch (error: any) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    throw error;
  }
}

export async function updateProductById(
  id: string,
  data: Partial<InsertProductInput>
) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Not find product");
    if (data.name !== undefined) product.name = data.name;
    if (data.imgs !== undefined) product.imgs = data.imgs;
    if (data.price !== undefined) product.price = data.price;
    if (data.discountPrice !== undefined)
      product.discountPrice = data.discountPrice;
    if (data.shortDescription !== undefined)
      product.shortDescription = data.shortDescription;
    if (data.longDescription !== undefined)
      product.longDescription = data.longDescription;
    if (data.category?.categoryId !== undefined)
      product.category = data.category.categoryId;
    if (data.variants !== undefined) product.variants = data.variants;
    if (data.sku !== undefined) product.sku = data.sku;
    if (data.isVisible !== undefined) product.isVisible = data.isVisible;
    if (data.hot !== undefined) product.hot = data.hot;
    return await product.save();
  } catch (error: any) {
    console.error("❌ error update product:", error.message);
    throw new Error(error.message || "Update product fail");
  }
}
export async function deleteProductById(productId: string) {
  const deleted = await productModel.findByIdAndDelete(productId);
  if (!deleted) {
    throw new Error("Không tìm thấy sản phẩm để xóa");
  }
  return deleted;
}
