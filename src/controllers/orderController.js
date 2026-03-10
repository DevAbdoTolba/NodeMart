import orderModel from '../models/orderModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// 1. الحصول على طلبات المستخدم الحالي (العميل)
export const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await orderModel.find({ user: req.user._id });
    res.status(200).json({ 
        status: "success", 
        results: orders.length, 
        data: orders 
    });
});

// 2. الحصول على تفاصيل طلب محدد مع التحقق من الملكية
export const getOrder = catchAsync(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    
    if (!order) return next(new AppError("Order not found", 404));
    
    // التأكد أن الشخص الذي يطلب البيانات هو صاحب الطلب أو أدمن
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError("You don't have permission to view this order", 403));
    }
    
    res.status(200).json({ status: "success", data: order });
});

// 3. الحصول على كل الطلبات (للأدمن) - يستخدم الـ Factory لإضافة الـ Pagination والـ Populate
export const getAllOrders = factory.getAll(orderModel, "user");

// 4. تحديث حالة الطلب (الأكشن الأساسي في الـ Dashboard)
export const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    
    // البحث عن الطلب
    const order = await orderModel.findById(req.params.id);
    if (!order) return next(new AppError("Order not found", 404));

    // تحديث الحالة
    order.status = status;

    /* ملاحظة هامة لنسمة: 
       استخدام .save() هنا هو اللي بيشغل الـ Validation الخاص بالـ Enum في الـ Model.
       تأكدي أن كلمة 'Cancelled' أضيفت في ملف models/orderModel.js لتجنب خطأ 400.
    */
    await order.save();

    res.status(200).json({ 
        status: "success", 
        message: `Order status has been updated to ${status}`,
        data: { order } 
    });
});

// 5. إضافة طلب جديد (Logic إنشاء الطلب)
export const addOrder = async (details, user, isCOD = false) => {
    let items = [];
    
    // تحويل بيانات العربة (Cart) إلى شكل متوافق مع Schema الطلبات
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