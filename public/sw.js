/*
 * Minimal offline-shell service worker for Kehilapp.
 *
 * Design goals:
 *  - Make the app installable + give it an offline fallback shell.
 *  - Never break Vite's dev server / HMR: navigations are network-FIRST (dev
 *    always gets fresh HTML), and dev module requests are passed straight to the
 *    network. Only same-origin built assets (/assets/, /img/) are cached.
 *  - Ignore the API (different origin, http://localhost:5001) entirely.
 */
const CACHE = "kehilapp-shell-v1";
const SHELL = ["/", "/manifest.webmanifest", "/img/company-logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Only handle our own origin; let API/CDN requests go straight to the network.
  if (url.origin !== self.location.origin) return;

  // App shell: network-first so dev/HMR stays fresh, cache as offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put("/", copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("/").then((r) => r || caches.match(req)))
    );
    return;
  }

  // Built static assets only (present in production, absent in dev → passthrough).
  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/img/")) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
            return res;
          })
      )
    );
  }
});
