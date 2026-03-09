import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";
import User from '../models/userModel.js';


export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users 
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
export const getStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } }
  ]);
  res.status(200).json({ status: "success", data: stats[0] || { totalRevenue: 0, totalOrders: 0 } });
});
