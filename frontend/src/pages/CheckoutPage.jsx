// src/pages/CheckoutPage.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { Camera, Calendar, ArrowRight, Loader } from "lucide-react";
import toast from "react-hot-toast";

const MANAGER_PHONE = "12492880828"; // manager phone (international format WITHOUT +)
const MAX_RECEIPT_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED_IMAGE_MIMES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/heic", "image/heif"];

const ACCOUNT_DETAILS = [
  {
    label: "Bank Transfer (Primary)",
    details: "Bank: First Bank\nAcct: 3083789747\nName: Chime Ogechi Antonia",
  },
  {
    label: "Bank Transfer (Secondary)",
    details: "Bank: Moniepoint\nAcct: 5012248447\nName: Nwokedi Onyinye/chimes trading",
  },
];

const phoneLooseRegex = /^\+?[0-9\s\-()]{7,25}$/;

function formatLocalDatetimeForInput(date) {
  const tzOffset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - tzOffset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function CheckoutPage() {
  const { cart = [], total = 0, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDatetime, setPickupDatetime] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const datetimeRef = useRef(null);
  const fileInputRef = useRef(null);

  const minDatetimeLocal = useMemo(() => formatLocalDatetimeForInput(new Date()), []);

  const { itemsText, orderItems } = useMemo(() => {
    const list = (cart || []).map((it, idx) => {
      const qty = it.quantity || 1;
      return {
        index: idx + 1,
        productId: it._id,
        name: it.name,
        description: it.description || "",
        price: Number(it.price || 0),
        quantity: qty,
        lineTotal: Number(it.price || 0) * qty,
      };
    });

    const text =
      list.length > 0
        ? list.map((i) => `${i.index}. ${i.name} — ₦${i.lineTotal.toFixed(2)} (qty: ${i.quantity})`).join("\n")
        : "No items";

    return { itemsText: text, orderItems: list };
  }, [cart]);

  useEffect(() => {
    if (!receiptFile) {
      setReceiptPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setReceiptPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);

  const validate = () => {
    if (!name.trim()) {
      toast.error("Please enter your name", { id: "checkout-name" });
      return false;
    }
    if (!phoneLooseRegex.test(phone.trim())) {
      toast.error("Please enter a valid phone number", { id: "checkout-phone" });
      return false;
    }
    if (!pickupDatetime) {
      toast.error("Please select a pickup date and time", { id: "checkout-pickup" });
      return false;
    }
    const picked = new Date(pickupDatetime);
    if (isNaN(picked.getTime())) {
      toast.error("Invalid pickup date/time", { id: "checkout-pickup2" });
      return false;
    }
    const now = new Date();
    if (picked < new Date(now.getTime() - 5 * 60 * 1000)) {
      toast.error("Pickup time must be in the future", { id: "checkout-pickup3" });
      return false;
    }
    if (!receiptFile) {
      toast.error("Please upload a receipt image (required)", { id: "checkout-receipt" });
      return false;
    }
    if (receiptFile.size > MAX_RECEIPT_BYTES) {
      toast.error("Receipt too large (max 8MB)", { id: "checkout-receipt-size" });
      return false;
    }
    if (!receiptFile.type.startsWith("image/") && !ACCEPTED_IMAGE_MIMES.includes(receiptFile.type)) {
      toast.error("Unsupported file type. Use a photo (PNG/JPG/WebP/HEIC).", { id: "checkout-receipt-type" });
      return false;
    }
    if (!orderItems || orderItems.length === 0) {
      toast.error("Your cart is empty", { id: "checkout-empty" });
      return false;
    }
    return true;
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setReceiptFile(null);
      return;
    }
    if (f.size > MAX_RECEIPT_BYTES) {
      toast.error("File too large (max 8MB)", { id: "receipt-large" });
      return;
    }
    setReceiptFile(f);
  };

  const quickPick = () => {
    const next = new Date(Date.now() + 30 * 60 * 1000);
    setPickupDatetime(formatLocalDatetimeForInput(next));
    setTimeout(() => datetimeRef.current?.focus?.(), 60);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    toast.loading("Submitting order...", { id: "checkout-submitting" });

    try {
      const receiptBase64 = await readFileAsBase64(receiptFile);

      const payload = {
        buyerName: name.trim(),
        buyerPhone: phone.trim(),
        pickupDatetime: new Date(pickupDatetime).toISOString(),
        items: orderItems.map((it) => ({
          productId: it.productId,
          name: it.name,
          description: it.description,
          price: it.price,
          quantity: it.quantity,
        })),
        total: Number(total || orderItems.reduce((s, it) => s + it.lineTotal, 0)),
        receipt: receiptBase64,
      };

      const res = await axios.post("/orders", payload);

      toast.dismiss("checkout-submitting");
      toast.success("Order submitted", { id: "checkout-success" });

      const { orderId, receiptUrl } = res.data || {};

      const message = [
        `New Order${orderId ? `: #${orderId}` : ""}`,
        `Buyer: ${payload.buyerName}`,
        `Phone: ${payload.buyerPhone}`,
        `Pickup: ${new Date(payload.pickupDatetime).toLocaleString()}`,
        "",
        "Items:",
        itemsText,
        "",
        `Total: ₦${payload.total.toFixed(2)}`,
      ];
      if (receiptUrl) message.push("", `Receipt: ${receiptUrl}`);

      window.open(`https://wa.me/${MANAGER_PHONE}?text=${encodeURIComponent(message.join("\n"))}`, "_blank");

      if (clearCart) clearCart();
      navigate("/");
    } catch (err) {
      console.error("Checkout error:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to submit order";
      toast.dismiss("checkout-submitting");
      toast.error(msg, { id: "checkout-failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black/70 border border-white/6 rounded-2xl p-5 sm:p-8">
          <header className="mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#FFB300]">Checkout</h1>
            <p className="mt-1 text-sm sm:text-base text-white/80">Fill required details and upload your payment receipt.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
            <div>
              <label className="block text-sm sm:text-base font-medium text-white/90">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full px-3 py-2 sm:py-3 bg-black/50 border border-white/10 rounded-md text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FFB300]/30"
                placeholder="Your full name"
                required
                minLength={2}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-white/90">Phone number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 block w-full px-3 py-2 sm:py-3 bg-black/50 border border-white/10 rounded-md text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FFB300]/30"
                placeholder="+2348012345678"
                required
              />
            </div>

            {/* Responsive datetime area: stack on mobile, row on sm+ */}
            <div>
              <label className="block text-sm sm:text-base font-medium text-white/90">Pickup date & time</label>

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  ref={datetimeRef}
                  type="datetime-local"
                  value={pickupDatetime}
                  onChange={(e) => setPickupDatetime(e.target.value)}
                  min={minDatetimeLocal}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-md text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FFB300]/30"
                  required
                  aria-label="Pickup date and time"
                />

                <div className="w-full sm:w-auto flex gap-2 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      if (datetimeRef.current?.showPicker) datetimeRef.current.showPicker();
                      else datetimeRef.current?.focus();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#FFB300] text-black font-semibold text-sm sm:text-base hover:bg-[#e6a400] transition w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4" />
                    Pick
                  </button>

                  <button
                    type="button"
                    onClick={quickPick}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-white/5 text-white text-sm sm:text-base hover:bg-white/8 transition w-full sm:w-auto"
                  >
                    Now +30m
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs text-white/60">Use the Pick button to open a friendly picker. Select a future time.</p>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-white/90">Upload receipt <span className="text-xs text-white/60"> — required</span></label>

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <label
                  className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md bg-white/5 hover:bg-white/8 transition text-sm sm:text-base"
                  title="Upload receipt or take photo"
                >
                  <Camera className="w-4 h-4 text-[#FFB300]" />
                  <span className="text-white">Choose file / Take photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    capture="environment"
                    onChange={onFileChange}
                    className="sr-only"
                    required
                  />
                </label>

                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base text-white/80">{receiptFile ? receiptFile.name : "No file chosen"}</span>
                  {receiptPreviewUrl && (
                    <img src={receiptPreviewUrl} alt="receipt preview" className="h-14 w-14 object-cover rounded-md border border-white/8" />
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs text-white/60">Accepted: phone photos (PNG/JPG/WebP/HEIC). Max 8MB.</p>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-white/90">Items bought (locked)</label>
              <textarea
                readOnly
                value={itemsText}
                className="mt-2 block w-full px-3 py-2 bg-black/50 border border-white/10 rounded-md text-white text-sm sm:text-base h-36 resize-none"
              />
              <p className="mt-1 text-xs text-white/60">Items and prices are locked here to prevent tampering.</p>
            </div>

            <div className="rounded-md border border-white/8 p-4">
              <p className="text-sm sm:text-base text-white/80 mb-2 font-semibold">Account details (pay into one of these)</p>

              <div className="grid gap-3">
                {ACCOUNT_DETAILS.map((acc, i) => (
                  <div key={i} className="bg-black/40 p-3 rounded">
                    <p className="text-base sm:text-lg font-bold text-[#FFB300]">{acc.label}</p>
                    <pre className="whitespace-pre-wrap text-base sm:text-lg font-semibold text-white/90 mt-1">{acc.details}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm sm:text-base text-white/80">Total</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#FFB300]">₦{Number(total || 0).toFixed(2)}</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm sm:text-base transition w-full sm:w-auto ${
                  submitting ? "bg-[#FFB300]/60 text-black cursor-not-allowed" : "bg-[#FFB300] hover:bg-[#e6a400] text-black"
                }`}
                aria-disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit order & WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm sm:text-base text-white/70 hover:text-[#FFB300]">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
