import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ContactUsPage from "./pages/ContactUsPage";
import CheckoutPage from "./pages/CheckoutPage";
import InstallButton from './InstallButton';

import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import LoadingSpinner from "./components/LoadingSpinner";
import UpdateNotifier from "./components/UpdateNotifier";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [user, getCartItems]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(255,179,0,0.96) 0%, rgba(255,163,0,0.7) 30%, rgba(237,35,42,0.18) 60%, rgba(0,0,0,0.06) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen blur-[24px]"
            style={{
              background:
                "conic-gradient(from 200deg at 70% 30%, rgba(237,35,42,0.12), transparent 25%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/6" />
        </div>
      </div>

      <div className="relative z-50 pt-16 sm:pt-20">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route
              path="/secret-dashboard"
              element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />}
            />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login"/>} />
            <Route path="*" element={<div className="py-20 text-center">404 Not Found</div>} />
          </Routes>
        </main>
      </div>
      <InstallButton />
      <UpdateNotifier />
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
