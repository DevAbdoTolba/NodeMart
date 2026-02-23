import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // لو عندك product model
          required: true
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    type: {type: String},
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending"
    },
    paypalOrderId: { type: String },
    paymentStatus: {
      type: String, 
      enum: ["Pending", "Completed"], 
      default: "Pending"
    },
    COD: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;