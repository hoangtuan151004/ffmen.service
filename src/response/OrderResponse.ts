export default class OrderResponse<Order = any> {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  data: Order;

  constructor(
    totalOrders: number,
    totalPages: number = 1,
    currentPage: number = 1,
    data: Order
  ) {
    this.totalOrders = totalOrders;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.data = data;
  }
}
