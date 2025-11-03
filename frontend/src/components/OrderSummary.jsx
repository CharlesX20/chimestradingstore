import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

const OrderSummary = () => {
  const { total = 0, cart = [] } = useCartStore();

  const formattedTotal = Number(total || 0).toLocaleString('en-US');
  const itemCount = cart?.length ?? 0;
  const isEmpty = itemCount === 0;

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-white/6 bg-black/60 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-[#FFB300]">Order summary</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">Items</span>
          <span className="text-sm font-medium text-white/90">{itemCount}</span>
        </div>

        <dl className="flex items-center justify-between gap-4 border-t border-white/6 pt-3">
          <dt className="text-base font-bold text-white">Total Price</dt>
          <dd className="text-base font-bold text-[#ED232A]">&#8358;{formattedTotal}</dd>
        </dl>

        {/* Proceed to checkout: link when not empty, non-clickable block when empty */}
        {isEmpty ? (
          <div
            className="flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium bg-[#FFB300]/40 text-black cursor-not-allowed"
            aria-disabled="true"
            role="button"
          >
            Proceed to Checkout
          </div>
        ) : (
          <Link
            to="/checkout"
            className="flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium bg-[#FFB300] hover:bg-[#e6a400] text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB300]/40 transition-colors"
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
          </Link>
        )}

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-white/70">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FFB300] hover:text-[#e6a400]"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
