import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loading } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double-submits

    try {
      await login(email, password);
      // redirect or whatever on success (if you do toast here, use id too)
      toast.success("Logged in", { id: "auth-success" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
      // show a single replacing toast for auth errors
      toast.error(msg, { id: "auth-error" });
    }
  };


  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#FFB300] mb-6">
          Login to your account
        </h2>

        <div className="bg-black/70 border border-white/5 py-6 px-6 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90">
                Email address
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/60" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-black/60 border border-white/10 rounded-md placeholder-white/40 text-white focus:outline-none focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90">
                Password
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 bg-black/60 border border-white/10 rounded-md placeholder-white/40 text-white focus:outline-none focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-sm text-[#ED232A]">{error}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-black bg-[#FFB300] hover:bg-[#e6a400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB300]/50 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Login
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Not a member?{" "}
            <Link to="/signup" className="font-medium text-[#FFB300] hover:text-[#FFD400] inline-flex items-center gap-1">
              Sign up now <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
