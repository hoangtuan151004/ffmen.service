export default class ProductResponse<Product = any> {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  data: Product;

  constructor(
    totalProducts: number,
    totalPages: number = 10,
    currentPage: number = 1,
    data: Product
  ) {
    this.totalProducts = totalProducts;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.data = data;
  }
}
