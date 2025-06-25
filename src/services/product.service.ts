import {
  IProduct,
  IVariant,
  InsertProductInput,
  UpdateProductInput,
} from "@/types/product/product.types";
import productModel from "@/types/product/product.model";
import categoryModel from "@/types/category/category.model";
import ProductResponse from "../response/productResponse";
import { Request, Response } from "express";
import { umask } from "process";
import mongoose, { Types } from "mongoose";

// import { UpdateProductInput } from "@/types/product/product.types";
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
export async function uploadVariantImgs(
  files: Express.Multer.File[] | undefined,
  variantIndexesRaw: string | string[] | undefined,
  variants: any[]
) {
  try {
    if (!files || !variantIndexesRaw) return;

    const variantIndexes = Array.isArray(variantIndexesRaw)
      ? variantIndexesRaw.map(Number)
      : JSON.parse(variantIndexesRaw); // frontend gửi JSON.stringify([...])

    files.forEach((file, i) => {
      const index = variantIndexes[i];
      if (variants[index]) {
        variants[index].img = file.path;
      }
    });
  } catch (error: any) {
    console.error("❌ Lỗi upload ảnh biến thể:", error.message);
    throw new Error("Không xử lý được ảnh biến thể");
  }
}

export async function insertProduct(
  body: InsertProductInput
): Promise<IProduct> {
  try {
    // Parse nếu bị string
    let { category, variants } = body;

    if (typeof category === "string") {
      try {
        category = JSON.parse(category);
      } catch {
        throw new Error("category không hợp lệ");
      }
    }

    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch {
        throw new Error("variants không hợp lệ");
      }
    }

    // Ép kiểu số cho price, discountPrice nếu là string
    const price = Number(body.price);
    const discountPrice = Number(body.discountPrice || 0);

    const { name, imgs, shortDescription, longDescription } = body;

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

    const totalQuantity =
      formattedVariants?.reduce((acc, v) => acc + (v.quantity || 0), 0) || 0;

    const newProduct = new productModel({
      name,
      imgs,
      price,
      discountPrice,
      rating: 0,
      variants: formattedVariants,
      category: categoryFind._id,
      shortDescription,
      longDescription,
      isVisible: true,
      quantity: totalQuantity,
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

    const product = await productModel
      .findById(productId)
      .populate("category", "name");
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    return product;
  } catch (error: any) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    throw error;
  }
}

export async function updateProductById(id: string, data: UpdateProductInput) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    if (data.name !== undefined) product.name = data.name;
    if (data.imgs !== undefined) product.imgs = data.imgs;
    if (data.price !== undefined) product.price = Number(data.price);
    if (data.discountPrice !== undefined)
      product.discountPrice = Number(data.discountPrice);
    if (data.shortDescription !== undefined)
      product.shortDescription = data.shortDescription;
    if (data.longDescription !== undefined)
      product.longDescription = data.longDescription;
    if (data.category?.categoryId !== undefined)
      product.category = new Types.ObjectId(data.category.categoryId);
    if (Array.isArray(data.variants)) {
      const updatedVariants = [...product.variants];

      data.variants.forEach((variantInput) => {
        const {
          _id,
          attributes,
          price,
          quantity,
          sku = "",
          img = "",
        } = variantInput;

        if (!attributes?.size || !attributes?.color) {
          throw new Error("Mỗi biến thể phải có size và color");
        }

        if (_id) {
          const index = updatedVariants.findIndex(
            (v) => v._id?.toString() === _id
          );
          if (index !== -1) {
            updatedVariants[index] = {
              ...updatedVariants[index],
              attributes,
              price,
              quantity,
              sku,
              img,
            };
          }
        } else {
          updatedVariants.push({
            attributes,
            price,
            quantity,
            sku,
            img,
          });
        }
      });
      if (Array.isArray(data.deletedVariantIds)) {
        data.deletedVariantIds.forEach((idToDelete) => {
          const index = updatedVariants.findIndex(
            (v) => v._id?.toString() === idToDelete
          );
          if (index !== -1) updatedVariants.splice(index, 1);
        });
      }

      product.variants = updatedVariants;

      product.quantity = updatedVariants.reduce(
        (acc, v) => acc + (v.quantity || 0),
        0
      );
    }

    if (data.sku !== undefined) product.sku = data.sku;
    if (data.isVisible !== undefined) product.isVisible = data.isVisible;
    if (data.hot !== undefined) product.hot = data.hot;
    // console.log("📦 data.variants:", data.variants);
    // console.log("📦 deletedVariantIds:", data.deletedVariantIds);
    // console.log("📦 variants FINAL trước khi save:", product.variants);
    await product.save();
    const updated = await productModel.findById(product._id);
    // console.log("✅ After Save + Reload:", updated?.variants);
    return updated;
  } catch (error: any) {
    console.error("❌ error update product:", error.message);
    throw new Error(error.message || "Cập nhật sản phẩm thất bại");
  }
}

export async function deleteProductById(productId: string) {
  const deleted = await productModel.findByIdAndDelete(productId);
  if (!deleted) {
    throw new Error("Không tìm thấy sản phẩm để xóa");
  }
  return deleted;
}
