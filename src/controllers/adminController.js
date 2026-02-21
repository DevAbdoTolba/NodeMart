import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("user");
  res.status(200).json({ status: "success", results: orders.length, data: orders });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.status = req.body.status || order.status;
  await order.save();

  res.status(200).json({ status: "success", data: { order } });
});

export const getStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } }
  ]);
  res.status(200).json({ status: "success", data: stats[0] || { totalRevenue: 0, totalOrders: 0 } });
});
