/*
 * Minimal offline-shell service worker for Kehilapp.
 *
 * Design goals:
 *  - Make the app installable + give it an offline fallback shell.
 *  - Never break Vite's dev server / HMR: navigations are network-FIRST (dev
 *    always gets fresh HTML), and dev module requests are passed straight to the
 *    network. Only same-origin built assets (/assets/, /img/, /icons/) are cached.
 *  - Ignore the API (different origin, http://localhost:5001) entirely.
 */
// Bumped with the icon move so installed clients drop the shell that still
// pre-cached the old logo; activate() deletes every other cache name.
//
// v3 (1.11.2026): purges caches poisoned with a 404. Between 29.10 16:39 and
// 1.11 10:20 the server's internal proxy served the admin panel at "/" and
// this app at "/admin/" (stale upstream addresses after a redeploy). A browser
// that opened /admin/ got this app's index.html, requested /assets/index-<hash>.js
// through this worker, received the admin container's 404, and the worker
// STORED that 404 (cache-first, no status check). After the proxy was fixed
// the page stayed white: the bundle came from the cache as a 404 and never
// reached the server again. Reproduced in a fresh headless browser by putting
// a 404 Response for the bundle into the cache: #root rendered empty.
const CACHE = "kehilapp-shell-v3";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png"];

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
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put("/", copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match("/").then((r) => r || caches.match(req)))
    );
    return;
  }

  // Built static assets only (present in production, absent in dev → passthrough).
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/img/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            // Only a successful response is worth keeping. A 404/5xx stored
            // here is served FIRST on every later visit (cache-first) and the
            // server never gets another chance — see the v3 note above.
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
            }
            return res;
          })
      )
    );
  }
});
