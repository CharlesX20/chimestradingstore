// src/registerSW.js - UPDATED VERSION
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("✅ PWA Service Worker registered:", reg.scope);
        
        // Check for updates every hour
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);
        
        // Listen for new service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          console.log("🔄 New service worker found!");
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log("🔄 New content available!");
            }
          });
        });
      })
      .catch((err) => {
        console.log("❌ PWA Service Worker registration failed:", err);
      });

    // Reload when new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log("🔄 Controller changed - page will refresh");
        // You can show a toast here instead of auto-refresh
      }
    });
  });
}