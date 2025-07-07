import { IOrder } from "../types/oder.types";
import OrderModel from "../models/order.model";
import mongoose, { Types } from "mongoose";
import { subMonths } from "date-fns";
import OrderResponse from "../response/OrderResponse";

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

export const getAllOrdersService = async (
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;
  const totalOrders = await OrderModel.countDocuments();
  const orders = await OrderModel.find()
    .populate("user", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalOrders / limit);
  return new OrderResponse(totalOrders, totalPages, page, orders);
};

export const getOrdersByUserId = async (userId: string | Types.ObjectId) => {
  return await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (id: string) => {
  return await OrderModel.findById(id).populate("user", "name email");
};

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
        isPaid: true,
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
