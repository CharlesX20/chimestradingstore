// public/sw.js - UPDATED VERSION
const CACHE_NAME = "chimes-trading-store-v2.0";
const API_CACHE = "api-data-v1";

// Core app shell - cache these for offline use
const CORE_ASSETS = [
  "/",
  "/index.html", 
  "/weblogo.png",
  "/manifest.json",
  "/src/main.jsx"
];

self.addEventListener("install", (event) => {
  console.log("🔄 Service Worker: Installing new version");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(err => {
        console.log("Cache addAll failed:", err);
      });
    })
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME && k !== API_CACHE) {
            console.log("🧹 Deleting old cache:", k);
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim(); // Take control of all clients
});

// Listen for messages from the app (for cache clearing)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "CLEAR_API_CACHE") {
    caches.delete(API_CACHE).then(() => {
      console.log("🧹 API cache cleared via admin action");
      // Notify all clients that cache was cleared
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ 
            type: 'CACHE_CLEARED'
          });
        });
      });
    });
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 🚨 NEVER cache admin routes or mutation requests
  if (request.method !== "GET" || url.pathname.includes("/admin")) {
    event.respondWith(fetch(request));
    return;
  }

  // 📱 API calls - Network First with cache fallback
  if (url.pathname.includes("/api/") || url.pathname.includes("/products")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, update cache
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed - try cache
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log("📦 Serving cached API data");
              return cached;
            }
            // No cache available
            return new Response(
              JSON.stringify({ error: "You're offline and no cached data available" }),
              { 
                status: 503, 
                headers: { "Content-Type": "application/json" } 
              }
            );
          });
        })
    );
    return;
  }

  // 🖼️ Static assets - Cache First
  if (request.destination === "image" || 
      url.pathname.includes(".js") || 
      url.pathname.includes(".css")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // 🌐 Navigation - Network First
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match("/")))
    );
    return;
  }

  // Default: try cache, then network
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});