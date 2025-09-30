import { useState, useEffect } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { PhoneCall } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // close mobile menu on navigation
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full bg-black/95 text-white z-50 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: "#FFB300" }} // curry yellow
            >
              Chime'sTradingStore
            </span>
            <span className="sr-only">Home</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-3">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-[#FFB300] transition"
            >
              Home
            </Link>

        <Link
          to={"/contact"}
          className="text-emerald-600 hover:text-emerald-700 transition duration-300 ease-in-out px-3 py-2 rounded font-medium flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4" />
          Contact
        </Link>

            {user && (
              <Link
                to="/cart"
                className="relative px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:text-[#ED232A] transition"
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-[#ED232A] text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#ED232A] hover:bg-[#d21d27] text-white text-sm font-medium transition"
              >
                <Lock size={16} />
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md bg-white text-black text-sm font-medium hover:opacity-95 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Log Out
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md bg-[#FFB300] hover:bg-[#e6a400] text-black text-sm font-medium flex items-center gap-2 transition"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>

                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md bg-white text-black hover:opacity-95 text-sm font-medium flex items-center gap-2 transition"
                >
                  <LogIn size={16} />
                  Login
                </Link>
              </>
            )}
          </nav>

          <div className="sm:hidden flex items-center gap-2">
            {user && (
              <Link to="/cart" className="relative inline-flex items-center p-2 rounded-md hover:bg-white/5">
                <ShoppingCart size={20} />
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ED232A] text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#FFB300] transition"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden bg-black/98 border-t border-white/5 transition-max-h duration-300 overflow-hidden ${
          open ? "max-h-[480px] py-4" : "max-h-0"
        }`}
      >
        <div className="px-4 space-y-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:text-[#FFB300] transition"
          >
            Home
          </Link>

          <Link
          to="/contact"
          onClick={() => setOpen(false)}
          className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-2">
            <PhoneCall size={18} />
            <span>Contact</span>
          </div>
        </Link>


          {user && (
            <Link
              to="/cart"
              className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:text-[#ED232A] transition"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>Cart</span>
              </div>
              {cart?.length > 0 && (
                <span className="bg-[#ED232A] text-white rounded-full px-2 py-0.5 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="block px-3 py-2 rounded-md bg-[#ED232A] hover:bg-[#d21d27] text-white text-base font-medium transition"
            >
              <div className="flex items-center gap-2">
                <Lock size={16} />
                <span>Dashboard</span>
              </div>
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-md bg-white text-black text-base font-medium flex items-center gap-2"
            >
              <LogOut size={16} />
              Log Out
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md bg-[#FFB300] hover:bg-[#e6a400] text-black text-base font-medium flex items-center gap-2"
              >
                <UserPlus size={16} />
                Sign Up
              </Link>

              <Link
                to="/login"
                className="block px-3 py-2 rounded-md bg-white text-black hover:opacity-95 text-base font-medium flex items-center gap-2"
              >
                <LogIn size={16} />
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
