import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("user");
  res.status(200).json({ status: "success", results: orders.length, data: orders });
});

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: "fail", message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();
    res.status(200).json({ status: "success", data: { order } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } }
    ]);
    res.status(200).json({ status: "success", data: stats[0] || { totalRevenue: 0, totalOrders: 0 } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
