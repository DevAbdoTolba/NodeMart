import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import * as factory from "./handlerFactory.js";


export const getAllUsers = factory.getAll(User);
export const getStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } }
  ]);
  res.status(200).json({ status: "success", data: stats[0] || { totalRevenue: 0, totalOrders: 0 } });
});
