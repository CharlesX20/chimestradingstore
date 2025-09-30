// models/order.model.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    pickupDatetime: { type: Date, required: true },
    items: { type: Array, required: true },
    total: { type: Number, default: 0 },
    receiptUrl: { type: String },
    status: { type: String, default: "pending" },

    // optional field: present in some historical flows (Stripe/session fields).
    // we do NOT enforce uniqueness here in the schema so it won't re-create an index.
    // This lets createOrder add a unique fallback value if DB has a unique index on it.
    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
