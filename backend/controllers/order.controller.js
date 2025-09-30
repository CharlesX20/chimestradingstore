// controllers/order.controller.js
import Order from "../models/order.model.js";
import cloudinary from "../lib/cloudinary.js";

/**
 * createOrder
 * - Validates payload on server
 * - Uploads receipt (expects a data URL like "data:image/png;base64,...")
 * - Creates order in DB
 * - If a duplicate-key error occurs specifically for a legacy stripeSessionId index,
 *   we retry once with a fallback unique stripeSessionId value.
 */
export const createOrder = async (req, res) => {
  try {
    const { buyerName, buyerPhone, pickupDatetime, items, total, receipt } = req.body;

    // Strict server-side validation
    if (
      !buyerName ||
      !buyerPhone ||
      !pickupDatetime ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !receipt
    ) {
      return res.status(400).json({
        message: "Missing required fields: name, phone, pickupDatetime, items, receipt",
      });
    }

    // receipt should be a data URL (client sends base64)
    if (typeof receipt !== "string" || !receipt.startsWith("data:")) {
      return res.status(400).json({ message: "Receipt must be a data URL (base64 image)" });
    }

    // Upload receipt to Cloudinary (resource_type: 'auto' accepts data URLs too)
    let receiptUrl = "";
    try {
      const uploadRes = await cloudinary.uploader.upload(receipt, {
        folder: "orders/receipts",
        resource_type: "auto",
      });
      receiptUrl = uploadRes.secure_url || uploadRes.url || "";
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      return res.status(502).json({ message: "Failed to upload receipt", error: uploadErr.message });
    }

    // Build payload (do not include stripeSessionId at first)
    const orderPayload = {
      buyerName,
      buyerPhone,
      pickupDatetime: new Date(pickupDatetime),
      items,
      total: Number(total || 0),
      receiptUrl,
      status: "pending",
    };

    // Attempt to create order. If it fails with duplicate key for stripeSessionId,
    // retry once with a unique fallback stripeSessionId value.
    try {
      const order = await Order.create(orderPayload);
      return res.status(201).json({ orderId: order._id, receiptUrl });
    } catch (createErr) {
      // If duplicate key error for stripeSessionId (E11000), try a single retry.
      if (createErr && createErr.code === 11000 && /stripeSessionId/i.test(createErr.message || "")) {
        console.warn("Duplicate stripeSessionId detected. Retrying with fallback id.");
        // Generate fallback unique id and attach to payload to bypass old unique null index
        orderPayload.stripeSessionId = `fallback_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        try {
          const order2 = await Order.create(orderPayload);
          return res.status(201).json({ orderId: order2._id, receiptUrl });
        } catch (retryErr) {
          console.error("createOrder retry failed:", retryErr);
          return res.status(500).json({ message: "Server error creating order (retry failed)", error: retryErr.message });
        }
      }

      // Other errors (not duplicate-key situation)
      console.error("createOrder initial create error:", createErr);
      return res.status(500).json({ message: "Server error creating order", error: createErr.message });
    }
  } catch (error) {
    console.error("createOrder ERROR:", error.stack || error);
    return res.status(500).json({ message: "Server error creating order", error: error.message });
  }
};
