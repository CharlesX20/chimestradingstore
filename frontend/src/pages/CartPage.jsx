import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";

const CartPage = () => {
  const { cart = [] } = useCartStore();

  return (
    <div className="py-8 md:py-16 min-h-[70vh]">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* make this a flex container on all sizes: column on mobile, row on lg */}
        <div className="mt-6 sm:mt-8 md:gap-6 flex flex-col lg:flex-row lg:items-start xl:gap-8">
          {/* Cart Items (+ PeopleAlsoBought). On mobile this will appear after OrderSummary */}
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl order-last lg:order-first"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem
                    key={
                      item._id ??
                      item.id ??
                      `${item.productId ?? "item"}-${Math.random()}`
                    }
                    item={item}
                  />
                ))}
              </div>
            )}

            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {/* Order Summary — appears first on mobile, second on desktop */}
          {cart.length > 0 && (
            <motion.div
              className="mx-auto mt-6 mb-4 max-w-4xl flex-1 space-y-6 order-first lg:order-last lg:mt-0 lg:w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartPage;

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16 px-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="rounded-full bg-black/60 p-6">
      <ShoppingCart className="h-14 w-14 text-[#ED232A]" />
    </div>
    <h3 className="text-2xl font-semibold text-white">Your cart is empty</h3>
    <p className="text-white/70 text-center max-w-md">
      Looks like you haven't added anything to your cart yet.
    </p>
    <Link
      className="mt-4 rounded-md bg-[#FFB300] px-6 py-2 text-black font-medium transition-colors hover:bg-[#e6a400]"
      to="/"
    >
      Start Shopping
    </Link>
  </motion.div>
);
