export function forceClientUpdates() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    try {
      if (registration.active) {
        registration.active.postMessage({ type: 'CLEAR_API_CACHE' });
      } else if (registration.waiting) {
        registration.waiting.postMessage({ type: 'CLEAR_API_CACHE' });
      } else if (registration.installing) {
        registration.installing.postMessage({ type: 'CLEAR_API_CACHE' });
      }
    } catch (e) {
      console.warn('SW postMessage failed', e);
    }

    try {
      registration.update().catch(() => {});
    } catch (e) {}
  });
}
