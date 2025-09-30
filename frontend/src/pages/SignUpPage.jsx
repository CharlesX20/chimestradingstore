import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // basic client-side email check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    signup(formData);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center text-3xl font-extrabold text-[#FFB300] mb-6">Create your account</h2>

        <div className="bg-black/70 border border-white/5 py-8 px-6 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90">
                Full name
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/60" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-black/60 border border-white/10 rounded-md placeholder-white/40 text-white focus:outline-none focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
                  placeholder="Please enter your full name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-black/60 border border-white/10 rounded-md placeholder-white/40 text-white focus:outline-none focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90">
                Enter your password
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-black/60 border border-white/10 rounded-md placeholder-white/40 text-white focus:outline-none focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                Confirm password (Please don't forget your password!)
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  Signing up...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#FFB300] hover:text-[#FFD400] inline-flex items-center gap-1">
              Login here <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
