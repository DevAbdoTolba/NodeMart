import paypal from "@paypal/checkout-server-sdk"
import dotenv from 'dotenv';
import orderModel from "../models/orderModel.js";
import AppError from "./appError.js";

dotenv.config();
// console.log("ID:", process.env.PAYPAL_CLIENT_ID)
// console.log("SECRET:", process.env.PAYPAL_CLIENT_SECRET)

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
)

export const approvePayment = async (req, res, next) => {
  try {
    const event = req.body

    if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      const orderId = event.resource.id

      const order = await orderModel.findOneAndUpdate({ paypalOrderId: orderId },{ paymentStatus: "Completed" });
      if(order)
        res.status(200).send("Webhook received")
      else
        next(new AppError("couldn't update order in db"));
    }
    // console.log("payment done");
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const client = new paypal.core.PayPalHttpClient(environment)