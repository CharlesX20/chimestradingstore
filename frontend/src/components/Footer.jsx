import React from "react";
import { PhoneCall, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12">
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(35,20,5,1) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Contact info */}
          <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-12 gap-4 text-white/80">
            {/* Phone number */}
            <a
              href="tel:+2348038895923"
              className="flex items-center gap-2 hover:text-[#FFB300] transition relative z-50"
              style={{ pointerEvents: "auto" }}
            >
              <PhoneCall className="w-5 h-5 text-[#FFB300]" />
              <span>+234 (803) 889-5923</span>
            </a>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ED232A]" />
              <span>Relieve Market</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/60">
            © {new Date().getFullYear()} SpiceMarket — All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
