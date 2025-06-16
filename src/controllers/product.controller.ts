// product.controller.ts
import { IProduct, InsertProductInput } from "@/types/product/product.types";
import categoryModel from "../types/category/category.model";
import productModel from "../types/product/product.model";
import ProductResponse from "../response/productResponse";
import { Request } from "express";
import mongoose, { Types } from "mongoose";

/**
 * Upload ảnh từ file và link
 */
export async function uploadImgs(
  files: Express.Multer.File[] | undefined,
  req: Request
): Promise<IProduct["imgs"]> {
  try {
    const imgs: IProduct["imgs"] = [];

    if (files && files.length > 0) {
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

/**
 * Thêm sản phẩm mới
 */

export async function insert(body: InsertProductInput): Promise<IProduct> {
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

    // Validate đầu vào
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

    // Kiểm tra danh mục
    const categoryFind = await categoryModel.findById(category.categoryId);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }

    // Xử lý biến thể (variants)
    let formattedVariants: IProduct["variants"] = [];
    if (variants && Array.isArray(variants)) {
      formattedVariants = variants.map((variant) => {
        const { attributes, price, quantity } = variant;

        if (
          !attributes ||
          typeof attributes.size !== "string" ||
          typeof attributes.color !== "string"
        ) {
          throw new Error(
            "Mỗi biến thể phải có attributes đầy đủ: size & color"
          );
        }

        if (typeof price !== "number" || typeof quantity !== "number") {
          throw new Error("Mỗi biến thể phải có price và quantity kiểu số");
        }

        return {
          attributes: {
            size: attributes.size,
            color: attributes.color,
          },
          price,
          quantity,
          sku: variant.sku || "",
          img: variant.img || "",
        };
      });
    }

    const proNew = new productModel({
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

    return await proNew.save();
  } catch (error: any) {
    console.error("Lỗi insert product:", error.message);
    throw new Error(error.message || "Lỗi trong quá trình lưu sản phẩm");
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

// export async function getByCategory(categoryId: string) {
//   try {
//     const productsCategory = await productModel
//       .find({ "category.categoryId": categoryId })
//       .lean();
//     return {
//       totalProducts: productsCategory.length,
//       products: productsCategory,
//     };
//   } catch (error: any) {
//     console.error("Lỗi lấy sản phẩm theo danh mục", error.message);
//     throw error;
//   }
// }

// export async function getProductDetail(productId: string) {
//   try {
//     const product = await productModel.findById(productId);
//     if (!product) throw new Error("Không tìm thấy sản phẩm");
//     return product;
//   } catch (error: any) {
//     console.error("Lỗi lấy thông tin chi tiết sản phẩm:", error);
//     throw error;
//   }
// }

export async function getAllProducts(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    // Tổng số sản phẩm
    const totalProducts = await productModel.countDocuments({
      isVisible: true,
    });

    // Lấy danh sách sản phẩm theo phân trang
    const products: IProduct[] = await productModel
      .find({ isVisible: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category");

    const totalPages = Math.ceil(totalProducts / limit);

    return new ProductResponse<IProduct[]>(
      totalProducts,
      totalPages,
      page,
      products
    );
  } catch (error: any) {
    console.error("❌ Lỗi lấy danh sách sản phẩm:", error);
    throw error;
  }
}

// export async function getByKey(key: string, value: any) {
//   try {
//     const pro = await productModel.findOne(
//       { [key]: value },
//       "name price category"
//     );
//     return pro
//       ? {
//           Masp: pro._id,
//           Ten: pro.name,
//           Gia: pro.price,
//           Danhmuc: pro.category,
//         }
//       : null;
//   } catch (error: any) {
//     console.error("Lỗi lấy sản phẩm:", error);
//     throw error;
//   }
// }

// export async function getProPage(page = 1, limit = 10) {
//   try {
//     const skip = (page - 1) * limit;
//     const result = await productModel.find().skip(skip).limit(limit);
//     const totalProducts = await productModel.countDocuments();
//     return new ProductResponse<IProduct[]>(
//       totalProducts,
//       Math.ceil(totalProducts / limit),
//       page,
//       result
//     );
//   } catch (error: any) {
//     console.error("Lỗi lấy sản phẩm theo trang", error.message);
//     throw error;
//   }
// }
// export async function updateById(
//   productId: string,
//   body: InsertProductInput
// ): Promise<IProduct> {
//   try {
//     if (!Types.ObjectId.isValid(productId)) {
//       throw new Error("ID sản phẩm không hợp lệ");
//     }

//     const {
//       name,
//       imgs,
//       price,
//       price2,
//       quantity,
//       shortDescription,
//       longDescription,
//       category,
//       variants,
//     } = body;

//     if (
//       !name ||
//       !imgs ||
//       !quantity ||
//       !shortDescription ||
//       !longDescription ||
//       !price ||
//       !price2 ||
//       !category
//     ) {
//       throw new Error("Thông tin sản phẩm không đầy đủ");
//     }

//     if (!Array.isArray(imgs) || imgs.some((img) => !img.url)) {
//       throw new Error("Ảnh không hợp lệ. Mỗi ảnh phải có trường 'url'.");
//     }

//     let categoryId: string | Types.ObjectId;
//     if (typeof category === "object" && category.categoryId) {
//       categoryId = category.categoryId;
//     } else {
//       categoryId = category as string | Types.ObjectId;
//     }

//     const categoryFind = await categoryModel.findById(categoryId);
//     if (!categoryFind) {
//       throw new Error("Không tìm thấy danh mục");
//     }

//     let formattedVariants: IProduct["variants"] = [];
//     if (variants && Array.isArray(variants)) {
//       formattedVariants = variants.map((variant) => {
//         const { attributes, price, quantity } = variant;

//         if (
//           !attributes ||
//           typeof attributes.size !== "string" ||
//           typeof attributes.color !== "string"
//         ) {
//           throw new Error(
//             "Mỗi biến thể phải có attributes đầy đủ: size & color"
//           );
//         }

//         if (typeof price !== "number" || typeof quantity !== "number") {
//           throw new Error("Mỗi biến thể phải có price và quantity kiểu số");
//         }

//         return {
//           attributes: {
//             size: attributes.size,
//             color: attributes.color,
//           },
//           price,
//           quantity,
//           sku: variant.sku || "",
//           img: variant.img || "",
//         };
//       });
//     }

//     const updated = await productModel.findByIdAndUpdate(
//       productId,
//       {
//         name,
//         imgs,
//         price,
//         price2,
//         quantity,
//         shortDescription,
//         longDescription,
//         variants: formattedVariants,
//         category: {
//           categoryId: categoryFind._id,
//           categoryName: categoryFind.name,
//         },
//       },
//       { new: true } // trả về bản update mới nhất
//     );

//     if (!updated) {
//       throw new Error("Không tìm thấy sản phẩm để cập nhật");
//     }

//     return updated;
//   } catch (error: any) {
//     console.error("Lỗi update product:", error.message);
//     throw new Error(error.message || "Lỗi trong quá trình cập nhật sản phẩm");
//   }
// }
// export async function remove(productId: string) {
//   try {
//     const deleted = await productModel.findByIdAndDelete(productId);
//     if (!deleted) {
//       throw new Error("Không tìm thấy sản phẩm để xóa");
//     }
//     return deleted;
//   } catch (err: any) {
//     console.error("Lỗi khi xóa sản phẩm:", err.message);
//     throw new Error(err.message || "Lỗi xóa sản phẩm");
//   }
// }
