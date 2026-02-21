import orderModel from '../models/orderModel.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

export const getOrders = async (req, res, next) => {
    const token = req.headers.token;
    if(!token) return next(new AppError("Invalid token"));
    const {data} = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    if(!data) return next(new AppError("Invalid token data"));
    let orders = await orderModel.find({user: data._id});
    if(orders) {
        return res.status(200).json({status: "success", data: orders});
    } else {
        return next(new AppError("User has no orders"));
    }
}

export const getOrder = async (req, res, next) => {
    const token = req.headers.token;
    if(!token) return next(new AppError("Invalid token"));
    const {data} = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    if(!data) return next(new AppError("Invalid token data"));
    let order = await orderModel.findById(req.params.id);
    if(order) {
        if(order.user != data._id) return next(new AppError("Invalid order Id"));
        return res.status(200).json({status: "success", data: order});
    } else {
        return next(new AppError("Order not found"));
    }
}

export const addOrder = async (details, user) => {
    let items = [];
    for(let item of details.cart) {
        items.push({
            product: item._id, 
            quantity: item.quantity, 
            price: item.price
        });
    }
    let InsertOrder = await orderModel.insertOne({
        user: user,
        items: items,
        totalPrice: details.totalPrice,
        status: "Pending",
        paymentStatus: "Completed"
    })
    if(InsertOrder) {
        return InsertOrder;
    } else 
        return false;
}