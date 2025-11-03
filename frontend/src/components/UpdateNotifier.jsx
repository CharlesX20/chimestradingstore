// src/components/UpdateNotifier.jsx - NEW FILE
import { useState, useEffect } from "react";

const UpdateNotifier = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
  if ('serviceWorker' in navigator) {
    // Listen for cache cleared messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_CLEARED') {
        setUpdateAvailable(true);
      }
    });
  }
}, []);

  const refreshApp = () => {
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-20 right-4 bg-gradient-to-r from-[#FFB300] to-[#ED232A] text-black p-4 rounded-xl shadow-lg max-w-sm z-50 border-2 border-white/20">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold">🔄</div>
        <div>
          <h3 className="font-bold text-sm">New Updates Available</h3>
        </div>
      </div>
      <button 
        onClick={refreshApp}
        className="mt-2 bg-black text-white px-4 py-2 rounded font-semibold w-full hover:bg-gray-800 transition-colors text-sm"
      >
        Refresh Now
      </button>
    </div>
  );
};

export default UpdateNotifier;