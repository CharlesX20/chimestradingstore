// src/InstallButton.jsx - USER-FRIENDLY VERSION
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const InstallButton = () => {
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const shouldShowInstallPrompt = () => {
      // Don't show if already in app mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return false;
      }
      
      // Check if user recently dismissed (show again after 7 days)
      const lastDismissed = localStorage.getItem('chimes-app-install-last-dismissed');
      if (lastDismissed) {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (parseInt(lastDismissed) > sevenDaysAgo) {
          return false; // Still within 7-day cooldown
        }
      }
      
      return true;
    };

    const handler = (e) => {
      if (!shouldShowInstallPrompt()) {
        return;
      }
      
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    // Hide if app gets installed
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      toast.success("🎉 App installed! Thanks for installing Chime's Trading Store.");
    } else {
      toast("You can install anytime from your browser menu 📱");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismissTemporarily = () => {
    // Store current time - will show again after 7 days
    localStorage.setItem('chimes-app-install-last-dismissed', Date.now().toString());
    setShowInstall(false);
    toast("Got it! We'll remind you again in a week ✨");
  };

  // Don't show if already in app mode
  if (!showInstall || window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-6 flex items-center justify-center z-60 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-4 w-full bg-gradient-to-r from-[#FFB300] to-[#ED232A] rounded-xl shadow-xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex-shrink-0 text-black text-2xl">📱</div>

        <div className="flex-1 text-black">
          <div className="text-sm font-bold">Get the Chime's Store App</div>
          <div className="text-xs opacity-90">Faster access, works offline, real-time updates</div>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={handleInstallClick}
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition-all shadow-sm"
          >
            Install
          </button>
          <button
            onClick={handleDismissTemporarily}
            className="bg-black/5 text-black/80 px-3 py-2 rounded-lg text-sm hover:bg-black/10 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallButton;