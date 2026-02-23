import orderModel from '../models/orderModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await orderModel.find({ user: req.user._id });
    res.status(200).json({ status: "success", results: orders.length, data: orders });
});

export const getOrder = catchAsync(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) return next(new AppError("Order not found", 404));
    if (order.user.toString() !== req.user._id.toString()) {
        return next(new AppError("You don't have permission to view this order", 403));
    }
    res.status(200).json({ status: "success", data: order });
});

export const getAllOrders = factory.getAll(orderModel, "user");

export const updateOrderStatus = catchAsync(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) return next(new AppError("Order not found", 404));
    order.status = req.body.status;
    await order.save();
    res.status(200).json({ status: "success", data: { order } });
});

export const addOrder = async (details, user, isCOD = false) => {
    let items = [];
    for (let item of details.cart) {
        items.push({
            product: item._id,
            quantity: item.quantity,
            price: item.price
        });
    }
    let order = await orderModel.create({
        user: user,
        items: items,
        totalPrice: details.totalPrice,
        status: "Pending",
        paymentStatus: isCOD ? "Completed" : "Pending",
        COD: isCOD
    });
    return order;
};