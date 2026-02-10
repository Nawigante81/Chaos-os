/* Simple SW: cache static assets, network-first for navigations. */

const CACHE = 'chaos-os-v1';
const ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/grid.svg',
  '/noise.svg',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  // Navigations: prefer network
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/') || caches.match(req))
    );
    return;
  }

  // Same-origin assets: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
  }
});
