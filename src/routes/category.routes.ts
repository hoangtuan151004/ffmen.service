import express from "express";
// Đường dẫn CHÍNH XÁC từ baseUrl: "src"
import {
  createCategory,
  getAllCategories,
  getRootCategories,
  getSubCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/controllers/category.controller";

console.log("typeof getCategoryById:", typeof getCategoryById); // cần là "function"
console.log("getCategoryById:", getCategoryById); // xem log chi tiết nó là gì
const router = express.Router();

router.post("/", createCategory);
router.get("/all", getAllCategories);
router.get("/roots", getRootCategories);
router.get("/parent/:id", getSubCategories);
// router.get("/:id", getCategoryById);
// router.put("/:id", updateCategory);
// router.delete("/:id", deleteCategory);
export default router;
