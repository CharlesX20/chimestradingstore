// src/pages/ContactUsPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, Phone, MessageSquare, MapPin, ArrowLeft, Send } from "lucide-react";

// Put your WhatsApp number here (E.164 but without the leading +). Example: 15551234567
const OWNER_WHATSAPP_NUMBER = "2348038895923";
const SECOND_PHONE_NUMBER = "2347022855570";

const ContactUsPage = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSendViaWhatsappClient = (e) => {
    e?.preventDefault?.();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please enter your name and a message");
      return;
    }

    // build message body — encode for URL
    const text = `New contact message from *${encodeURIComponent(form.name)}*%0APhone: ${encodeURIComponent(
      form.phone || "not provided"
    )}%0A%0A${encodeURIComponent(form.message)}`;

    const url = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${text}`;

    // open new tab (works with WhatsApp app on mobile and WhatsApp Web on desktop)
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp — please press Send to deliver the message");
  };

  return (
    <div className="min-h-screen bg-black/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36 }}
          className="bg-gradient-to-br from-[#FFFBEB] via-[#FFF7E6] to-[#FFF1E0] p-1 rounded-2xl shadow-lg"
        >
          <div className="bg-black/85 rounded-2xl p-6 sm:p-8 text-white">
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFB300]">Contact Us</h1>
              <p className="text-sm text-white/70 mt-1">Send us a message and we'll reply on WhatsApp.</p>
            </header>

            <form onSubmit={handleSendViaWhatsappClient} className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-sm text-white/80 mb-1 block">Name</span>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-white/80 mb-1 block">Phone (optional)</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-white/80 mb-1 block">Message</span>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={5}
                    required
                    className="w-full pl-10 pr-3 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                    placeholder="Tell us how we can help — product, order or pickup questions..."
                  />
                </div>
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#FFB300] px-4 py-2 rounded-md font-semibold text-black hover:bg-[#e6a400] transition"
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </button>

                <div className="text-sm text-white/70">
                  Or call us at{" "}
                  <a className="text-emerald-400 hover:underline" href={`tel:+${OWNER_WHATSAPP_NUMBER}`}>
                    +{OWNER_WHATSAPP_NUMBER}
                  </a>{" "}
                  or{" "}
                  <a className="text-emerald-400 hover:underline" href={`tel:+${SECOND_PHONE_NUMBER}`}>
                    +{SECOND_PHONE_NUMBER}
                  </a>
                </div>
              </div>
            </form>

            <hr className="border-white/6 my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white/80 mb-1">You can find us at</h4>
                <p className="text-sm text-white/70">B30/ks/1Destiny line. Ogbaru relief market, Anambra State</p>
                <a
                  className="inline-flex items-center gap-2 mt-2 text-emerald-400 hover:underline text-sm"
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="h-4 w-4" />
                  View on map
                </a>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/80 mb-1">Business hours</h4>
                <p className="text-sm text-white/70">Tues–Sat: 8:00 AM — 5:00 PM</p>
                <p className="text-sm text-white/70">Sun-Mon: Closed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUsPage;
