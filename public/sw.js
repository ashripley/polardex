// Minimal service worker — required for the PWA install prompt on most
// browsers. Deliberately does NOT cache anything: we want live data from
// Firestore and the TCG API. If offline caching is wanted later, switch
// to a real library (Workbox / vite-plugin-pwa).
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // No-op — let the network handle everything.
});
