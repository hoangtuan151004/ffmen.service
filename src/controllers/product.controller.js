// product.controller.js
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const ProductResponse = require("../response/productResponse");

/**
 * Upload ảnh từ file và link
 */
async function uploadImgs(files, req) {
  try {
    const imgs = [];
    if (files && files.length > 0) {
      const fileUrls = files.map((file) => ({ url: file.path }));
      imgs.push(...fileUrls);
    }

    let imgUrls = req.body.imgUrls;
    if (typeof imgUrls === "string") {
      try {
        imgUrls = JSON.parse(imgUrls);
      } catch (error) {
        throw new Error("Danh sách link ảnh không hợp lệ");
      }
    }

    if (Array.isArray(imgUrls)) {
      const linkImgs = imgUrls.map((url) => ({ url }));
      imgs.push(...linkImgs);
    }

    if (imgs.length === 0) throw new Error("Không có ảnh nào được cung cấp");

    return imgs;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Thêm sản phẩm mới
 */
async function insert(body) {
  try {
    const {
      name,
      imgs,
      price,
      price2,
      quantity,
      shortDescription,
      longDescription,
      category,
    } = body;

    if (
      !name ||
      !imgs ||
      !quantity ||
      !shortDescription ||
      !longDescription ||
      !price ||
      !price2 ||
      !category
    )
      throw new Error("Thông tin sản phẩm không đầy đủ");

    if (!Array.isArray(imgs) || imgs.some((img) => !img.url))
      throw new Error("Ảnh không hợp lệ. Mỗi ảnh phải có trường 'url'.");

    // Xử lý category nhận vào là object hoặc id
    let categoryId = category;
    if (typeof category === "object" && category.categoryId) {
      categoryId = category.categoryId;
    }
    const categoryFind = await categoryModel.findById(categoryId);
    if (!categoryFind) throw new Error("Không tìm thấy danh mục");

    const proNew = new productModel({
      name,
      imgs,
      shortDescription,
      longDescription,
      price,
      price2,
      quantity,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });

    return await proNew.save();
  } catch (error) {
    console.error("Lỗi insert product:", error.message);
    throw new Error(error.message || "Lỗi trong quá trình lưu sản phẩm");
  }
}

/**
 * Lấy tất cả sản phẩm (kèm tổng số lượng và phân trang cơ bản)
 */
async function getpros() {
  try {
    const result = await productModel.find();
    console.log("Số sản phẩm tìm thấy:", result.length);
    return new ProductResponse(
      result.length,
      Math.ceil(result.length / 10),
      1,
      result
    );
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết sản phẩm theo ID
 */
async function getProductById(productId) {
  try {
    return await productModel.findById(productId);
  } catch (error) {
    console.log("Lỗi lấy thông tin sản phẩm", error);
    throw error;
  }
}

/**
 * Lấy sản phẩm theo danh mục
 */
async function getByCategory(categoryId) {
  try {
    const productsCategory = await productModel
      .find({ "category.categoryId": categoryId })
      .lean();
    return {
      totalProducts: productsCategory.length,
      products: productsCategory,
    };
  } catch (error) {
    console.error("Lỗi lấy sản phẩm theo danh mục", error.message);
    throw error;
  }
}

/**
 * Lấy chi tiết sản phẩm (full field)
 */
async function getProductDetail(productId) {
  try {
    const product = await productModel.findById(productId);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    return product;
  } catch (error) {
    console.error("Lỗi lấy thông tin chi tiết sản phẩm:", error);
    throw error;
  }
}

/**
 * Lấy sản phẩm nổi bật (view >= 100)
 */
async function getHotProduct() {
  try {
    const result = await productModel
      .find({ view: { $gte: 100 } })
      .sort({ view: -1 })
      .limit(8);
    return new ProductResponse(
      result.length,
      Math.ceil(result.length / 10),
      1,
      result
    );
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm hot", error);
    throw error;
  }
}

/**
 * Lấy sản phẩm giảm giá
 */
async function getSaleProduct() {
  try {
    const prosale = await productModel.find().sort({ price: -1 }).limit(8);
    return new ProductResponse(
      prosale.length,
      Math.ceil(prosale.length / 10),
      1,
      prosale
    );
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm giảm giá", error);
    throw error;
  }
}

/**
 * Lấy sản phẩm mới
 */
async function getNewProduct() {
  try {
    const newProducts = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(8);
    return new ProductResponse(
      newProducts.length,
      Math.ceil(newProducts.length / 10),
      1,
      newProducts
    );
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm mới:", error.message);
    throw error;
  }
}

/**
 * Lấy sản phẩm bán chạy (sắp xếp theo sold giảm dần)
 */
async function getBestSeller() {
  try {
    const bestSeller = await productModel.find().sort({ sold: -1 }).limit(8);
    return new ProductResponse(
      bestSeller.length,
      Math.ceil(bestSeller.length / 10),
      1,
      bestSeller
    );
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm bán chạy:", error.message);
    throw error;
  }
}

/**
 * Lấy tất cả sản phẩm đơn giản
 */
async function getAll() {
  try {
    const result = await productModel.find();
    return { totalProducts: result.length, products: result };
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm", error);
    throw error;
  }
}

/**
 * Tìm sản phẩm theo key và value cụ thể
 */
async function getByKey(key, value) {
  try {
    let pro = await productModel.findOne(
      { [key]: value },
      "name price category"
    );
    return {
      Masp: pro._id,
      Ten: pro.name,
      Gia: pro.price,
      Danhmuc: pro.category,
    };
  } catch (error) {
    console.log("Lỗi lấy sản phẩm: ", error);
    throw error;
  }
}

/**
 * Lấy sản phẩm phân trang
 */
async function getProPage(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const result = await productModel.find().skip(skip).limit(limit);
    const totalProducts = await productModel.countDocuments();
    return new ProductResponse(
      totalProducts,
      Math.ceil(totalProducts / limit),
      page,
      result
    );
  } catch (error) {
    console.log("Lỗi lấy sản phẩm theo trang", error.message);
    throw error;
  }
}

/**
 * Cập nhật sản phẩm theo ID
 */
async function updateById(id, body) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    const {
      name,
      price,
      description,
      category,
      price2,
      shortDescription,
      longDescription,
    } = body;
    let categoryFind = null;

    if (category) {
      categoryFind = await categoryModel.findById(category);
      if (!categoryFind) throw new Error("Không tìm thấy danh mục");
    }

    const categoryUpdate = categoryFind
      ? {
          categoryId: categoryFind._id,
          categoryName: categoryFind.name,
        }
      : product.category;

    return await productModel.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        price: price || product.price,
        price2: price2 || product.price2,
        description: description || product.description,
        shortDescription: shortDescription || product.shortDescription,
        longDescription: longDescription || product.longDescription,
        category: categoryUpdate,
      },
      { new: true }
    );
  } catch (error) {
    console.log("Lỗi cập nhật sản phẩm:", error);
    throw error;
  }
}

/**
 * Cập nhật ảnh theo imgId
 */
async function updateImageById(productId, imgId, newUrl) {
  try {
    const product = await productModel.findById(productId);
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    const image = product.imgs.id(imgId);
    if (!image) throw new Error("Không tìm thấy ảnh cần cập nhật");

    image.url = newUrl;
    return await product.save();
  } catch (error) {
    console.log("Lỗi cập nhật ảnh sản phẩm:", error);
    throw error;
  }
}

/**
 * Xóa sản phẩm theo ID
 */
async function remove(id) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm để xóa");
    await productModel.deleteOne({ _id: id });
    return { message: "Xóa sản phẩm thành công" };
  } catch (error) {
    console.log("Lỗi xóa sản phẩm:", error);
    throw error;
  }
}

/**
 * Tìm sản phẩm theo tên (gần đúng)
 */
async function findByName(name) {
  try {
    const products = await productModel.find({
      name: { $regex: name, $options: "i" },
    });
    return new ProductResponse(
      products.length,
      Math.ceil(products.length / 10),
      1,
      products
    );
  } catch (error) {
    console.log("Lỗi tìm sản phẩm:", error);
    throw error;
  }
}

/**
 * Lấy sản phẩm liên quan theo danh mục
 */
async function getProLienQuan(categoryId) {
  try {
    const products = await productModel
      .find({ "category.categoryId": categoryId })
      .limit(5);
    return new ProductResponse(
      products.length,
      Math.ceil(products.length / 10),
      1,
      products
    );
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan:", error);
    throw error;
  }
}

/**
 * Tìm và xóa sản phẩm theo tên
 */
async function timvaxoa(name) {
  try {
    const product = await productModel.findOne({ name });
    if (!product) throw new Error("Không tìm thấy sản phẩm để xóa");
    await productModel.deleteOne({ name });
    return { message: "Xóa sản phẩm thành công" };
  } catch (error) {
    console.log("Lỗi xóa sản phẩm:", error);
    throw error;
  }
}

/**
 * Phân trang + sắp xếp sản phẩm
 */
async function getPaginatedAndSortedProducts(pageNumber, limit, sortBy) {
  try {
    const totalProducts = await productModel.countDocuments();
    let sortOption = {};

    if (sortBy === "new") sortOption = { _id: -1 };
    else if (sortBy === "priceAsc") sortOption = { price: 1 };
    else if (sortBy === "priceDesc") sortOption = { price: -1 };

    const products = await productModel
      .find()
      .sort(sortOption)
      .skip(pageNumber * limit)
      .limit(limit);
    return { totalProducts, products };
  } catch (error) {
    console.error("Controller Error:", error.message);
    throw new Error("Failed to get products.");
  }
}

module.exports = {
  uploadImgs,
  insert,
  getpros,
  getProductById,
  getByCategory,
  getProductDetail,
  getHotProduct,
  getSaleProduct,
  getNewProduct,
  getBestSeller,
  getAll,
  getByKey,
  getProPage,
  updateById,
  updateImageById,
  remove,
  findByName,
  getProLienQuan,
  timvaxoa,
  getPaginatedAndSortedProducts,
};
