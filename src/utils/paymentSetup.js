import paypal from "@paypal/checkout-server-sdk"
import dotenv from 'dotenv';
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import AppError from "./appError.js";

dotenv.config();

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
)

export const client = new paypal.core.PayPalHttpClient(environment)

// POST /api/cart/payments/paypal/confirm
// Client calls this after the buyer approves on PayPal
export const confirmPayment = async (req, res, next) => {
  try {
    const { paypalOrderId } = req.body;
    if(!paypalOrderId) return next(new AppError("paypalOrderId is required", 400));

    // 1. Check the order status on PayPal
    const request = new paypal.orders.OrdersGetRequest(paypalOrderId);
    const response = await client.execute(request);

    if(response.result.status !== "APPROVED" && response.result.status !== "COMPLETED") {
      return next(new AppError("Payment was not approved", 400));
    }

    // 2. Find and update the order in our DB
    const order = await orderModel.findOne({ paypalOrderId: paypalOrderId });
    if(!order) return next(new AppError("Order not found", 404));

    order.paymentStatus = "Completed";
    await order.save();

    // 3. Subtract stock for each item
    for(let item of order.items) {
      await productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // 4. Clear the user's cart
    await userModel.findByIdAndUpdate(order.user, { cart: [] });

    res.status(200).json({ status: "success", message: "Payment confirmed", data: order });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}

// Webhook handler (optional, for PayPal server-side notifications)
export const approvePayment = async (req, res, next) => {
  try {
    const event = req.body;

    if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      const orderId = event.resource.id;

      // 1. Find the order in our DB (Same style as confirmPayment)
      const order = await orderModel.findOne({ paypalOrderId: orderId });
      
      if (!order) {
        return next(new AppError("Couldn't find order in DB", 404));
      }

      // 2. Update the order status
      order.paymentStatus = "Completed";
      await order.save();

      // 3. Subtract stock for each item
      for(let item of order.items) {
        await productModel.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      // 4. Clear the user's cart
      await userModel.findByIdAndUpdate(order.user, { cart: [] });

      res.status(200).send("Webhook received and processed");
    } else {
      // It's good practice to send a 200 OK for events you don't process, 
      // otherwise PayPal might keep trying to resend them!
      res.status(200).send("Webhook received");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}