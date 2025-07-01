import { Request, Response } from "express";
import {
  createOrder as createOrderService,
  getAllOrders as getAllOrdersService,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus as updateOrderStatusService,
  getRevenueByMonth,
} from "../services/order.service";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Chưa đăng nhập" });
      return; // 👈 phải return ở đây để dừng lại
    }

    const newOrder = await createOrderService({
      ...req.body,
      user: userId,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: "Tạo đơn hàng thất bại", error: err });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService();
    res.json(orders);
  } catch (err: any) {
    console.error("❌ Lỗi khi lấy danh sách đơn:", err); // 🔥 LOG QUAN TRỌNG
    res.status(500).json({
      message: "Không lấy được danh sách đơn",
      error: err.message || err,
    });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await getOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Không tìm thấy đơn hàng người dùng" });
  }
};

export const getOrderDetail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await updateOrderStatusService(req.params.id, req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Cập nhật trạng thái thất bại" });
  }
};
export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 6;
    const data = await getRevenueByMonth(months);
    res.json(data);
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu:", error);
    res.status(500).json({ message: "Lỗi server khi lấy doanh thu" });
  }
};
