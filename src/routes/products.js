var express = require("express");
var router = express.Router();
const checktoken = require("../helper/checktoken");
const productController = require("../controllers/product.controller");
const multer = require("multer");
const mongoose = require("mongoose");
const upload = require("../middlewares/upload"); // middleware upload

// Upload nhiều ảnh
router.post("/upload-images", upload.array("images"), async (req, res) => {
  try {
    const result = await productController.uploadImgs(req.files, req); // ✅ OK

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Thêm sản phẩm
router.post("/add", upload.array("imgs", 10), async (req, res) => {
  try {
    const {
      name,
      price,
      price2,
      quantity,
      shortDescription,
      longDescription,
      categoryId,
      categoryName,
      variants, // 👈 nhận từ req.body
    } = req.body;

    const imgs = await productController.uploadImgs(req.files, req);

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // Parse variants nếu có
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
        if (!Array.isArray(parsedVariants)) {
          throw new Error("Variants phải là mảng JSON");
        }
      } catch (err) {
        throw new Error("Trường variants không hợp lệ. Phải là chuỗi JSON.");
      }
    }

    const newProduct = {
      name,
      price: Number(price),
      price2: Number(price2),
      quantity: Number(quantity),
      shortDescription,
      longDescription,
      imgs,
      category: {
        categoryId: new mongoose.Types.ObjectId(categoryId),
        categoryName,
      },
      variants: parsedVariants, // 👈 gán vào đây
    };

    const product = await productController.insert(newProduct);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lỗi tải file
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: "Lỗi khi tải lên file" });
  } else if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
});

// GET sản phẩm phân trang
router.get("/page", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const productData = await productController.getProPage(page, limit);
    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET phân trang có sắp xếp
router.get("/paginated/products", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || "new";
    const paginatedProducts =
      await productController.getPaginatedAndSortedProducts(
        pageNumber,
        limit,
        sortBy
      );
    res.status(200).json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// Tổng số sản phẩm
router.get("/total-products", async (req, res) => {
  try {
    const products = await productController.getAll();
    res.status(200).json({ totalProducts: products.totalProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET tất cả sản phẩm với phân trang
router.get("/all", async (req, res) => {
  try {
    // Lấy page và limit từ query, mặc định nếu không có
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const pros = await productController.getpros(page, limit);

    console.log("Dữ liệu trả về:", pros);
    res.status(200).json(pros);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET sản phẩm hot, giảm giá, bán chạy, mới
router.get("/hot", async (req, res) => {
  try {
    const data = await productController.getHotProduct();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/sale", async (req, res) => {
  try {
    const data = await productController.getSaleProduct();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/bestseller", async (req, res) => {
  try {
    const data = await productController.getBestSeller();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/new", async (req, res) => {
  try {
    const products = await productController.getNew();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// GET chi tiết sản phẩm
router.get("/detail/:id", async (req, res) => {
  try {
    const sp = await productController.getProductDetail(req.params.id);
    res.status(200).json(sp);
  } catch (error) {
    res.status(500).json({ mess: error });
  }
});

// GET sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// PUT cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await productController.updateById(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT cập nhật ảnh theo ID
router.put("/products/:productId/images/:imgId", async (req, res) => {
  const { productId, imgId } = req.params;
  const { url } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(imgId)
  ) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  if (!url) {
    return res.status(400).json({ message: "Thiếu trường 'url' ảnh mới" });
  }

  try {
    const product = await productModel.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    const image = product.imgs.id(imgId);
    if (!image) return res.status(404).json({ message: "Không tìm thấy ảnh" });
    image.url = url;
    await product.save();
    res.status(200).json({
      message: "Cập nhật ảnh thành công",
      updatedImage: image,
      updatedProduct: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// DELETE sản phẩm theo ID
router.delete("/:id", async (req, res) => {
  try {
    const proDel = await productController.remove(req.params.id);
    res.status(200).json({ ProductDelete: proDel });
  } catch (error) {
    res.status(500).json({ mess: error });
  }
});

// GET sản phẩm theo danh mục
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await productController.getByCategory(
      req.params.categoryId
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET sản phẩm theo key
router.get("/search/:key/:value", async (req, res) => {
  try {
    const product = await productController.getByKey(
      req.params.key,
      req.params.value
    );
    res.status(200).json({ Product: product });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// GET sản phẩm giá tăng dần
router.get("/giatangdan", async (req, res) => {
  try {
    const product = await productController.getGiaTangDan();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// GET sản phẩm liên quan
router.get("/lienquan/:categoryId", async (req, res) => {
  try {
    const sanPhamLienQuan = await productController.getProLienQuan(
      req.params.categoryId
    );
    res.status(200).json(sanPhamLienQuan);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi máy chủ, không thể lấy sản phẩm liên quan" });
  }
});

// DELETE theo tên
router.delete("/timvaxoa/:name", async (req, res) => {
  try {
    const result = await productController.timvaxoa(req.params.name);
    res.status(200).json({ protimvaxoa: result });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// DELETE theo giá
router.delete("/delete-by-price/:price", async (req, res) => {
  try {
    const deletedProducts = await productController.deleteByPrice(
      parseFloat(req.params.price)
    );
    res.status(200).json({ DeletedProducts: deletedProducts });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// GET sản phẩm phân trang
router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const proPage = await productController.getProPage(page, limit);
    res.status(200).json({ proPage });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
