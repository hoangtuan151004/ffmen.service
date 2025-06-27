import { IOrder } from "../types/oder/oder.types";
import OrderModel from "../types/oder/order.model";
import mongoose, { Types } from "mongoose";
import { subMonths } from "date-fns";
/** Tạo đơn hàng */
export const createOrder = async (orderData: IOrder) => {
  const newOrder = new OrderModel({
    ...orderData,
    user: new mongoose.Types.ObjectId(orderData.user),
    orderItems: orderData.orderItems.map((item) => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    })),
  });

  return await newOrder.save();
};

/** Lấy tất cả đơn hàng (admin) */
export const getAllOrders = async () => {
  return await OrderModel.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

/** Lấy đơn hàng theo user */
export const getOrdersByUserId = async (userId: string | Types.ObjectId) => {
  return await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
};

/** Lấy chi tiết đơn theo ID */
export const getOrderById = async (id: string) => {
  return await OrderModel.findById(id).populate("user", "name email");
};

/** Cập nhật trạng thái đơn */
export const updateOrderStatus = async (
  orderId: string,
  update: Partial<IOrder>
) => {
  return await OrderModel.findByIdAndUpdate(orderId, update, { new: true });
};
export const getRevenueByMonth = async (months: number) => {
  const startDate = subMonths(new Date(), months); // lấy từ N tháng trước

  const revenue = await OrderModel.aggregate([
    {
      $match: {
        isPaid: true, // ✅ sửa ở đây
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$total" },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" },
              ],
            },
          ],
        },
        revenue: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  return revenue;
};
