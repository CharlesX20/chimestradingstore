import React from "react";
import { Sparkles, Info, ChevronRight, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";

// GreetingBanner — non-dismissible, no-explore-CTA version
// Place <GreetingBanner /> near the top of your Home page (above the products/Explore section)

const GreetingBanner = () => {
  const { user } = useUserStore();
  if (!user) return null;

  const displayName =
    typeof user.name === "string" && user.name.trim().length
      ? user.name.trim().split(" ")[0]
      : user.email || "Friend";

  const isAdmin = user?.role === "admin";

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-6 px-4 sm:px-6 lg:px-0"
      aria-label="Welcome banner"
    >
      <div className="mx-auto max-w-screen-lg">
        <div className="relative rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: "rgba(255,179,0,0.06)" }}>
          {/* subtle background stripe */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,179,0,0.03) 0%, rgba(237,35,42,0.02) 40%, rgba(16,185,129,0.02) 100%)",
            }}
          />

          <div className="relative p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-shrink-0">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-lg shadow-md"
                  style={{ background: "linear-gradient(135deg,#FFB300,#ED232A)" }}
                >
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-white/70">Hello</p>

                    <h2
                      className="truncate font-extrabold leading-tight"
                      style={{
                        fontSize: "clamp(1.25rem, 3.5vw, 1.9rem)",
                        lineHeight: 1.05,
                        WebkitBackgroundClip: "text",
                        backgroundImage: "linear-gradient(90deg,#FFB300,#FF7A3A)",
                        color: "transparent",
                      }}
                      title={`Hello ${displayName}`}>
                      {displayName}
                      {isAdmin && (
                        <span
                          className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full"
                          style={{
                            background: "rgba(0,0,0,0.65)",
                            color: "#FFB300",
                            border: "1px solid rgba(255,179,0,0.08)",
                          }}
                        >
                          admin
                        </span>
                      )}
                    </h2>

                    <p className="mt-1 text-sm text-white/80">
                      Welcome to <span className="font-semibold text-emerald-300">Chimes Trading Store</span>
                    </p>
                  </div>

                </div>

                {/* informational helper that replaces the CTA */}
                <div className="mt-3 sm:mt-4 grid gap-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Info className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="text-sm text-white/80">
                      To see all products: open <span className="font-semibold text-white">Categories</span>, pick a
                      category and tap any product to view details.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <ChevronRight className="w-5 h-5 text-[#FFB300]" />
                    </div>
                    <div className="text-sm text-white/80">
                      Use the cart icon to review items and proceed to checkout. Need help? Tap <Link to ="/contact"><span className="font-semibold text-emerald-300">Contact</span></Link>.
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-white/70">
                  <span className="inline-block bg-white/5 px-2 py-1 rounded-md text-xs text-white/80 mr-2">Tip</span>
                  New arrivals appear in the Latest section — swipe down to explore quickly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default GreetingBanner;
