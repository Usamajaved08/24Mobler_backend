import mongoose from "mongoose";
const { Schema } = mongoose;
export const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orderNo: String,
    orderItems: {
      type: Array,
    },
    shippingAddress: {
      type: Object,
    },
    deliverySlots: {
      type: Array,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
