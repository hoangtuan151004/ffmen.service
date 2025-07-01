export default class CategoryResponse<Category = any> {
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  data: Category;

  constructor(
    totalCategories: number,
    totalPages: number = 10,
    currentPage: number = 1,
    data: Category
  ) {
    this.totalCategories = totalCategories;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.data = data;
  }
}
