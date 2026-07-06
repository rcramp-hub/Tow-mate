// The version comes from index.html via the ?v= query on the register() call,
// so the app version is the single source of truth for the cache name too.
const VERSION = new URLSearchParams(self.location.search).get('v') || '0';
const CACHE = 'towmate-v' + VERSION;
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Network-first with HTTP cache bypass.
// Always fetches from the actual server, never from the browser HTTP cache.
// Falls back to the service worker cache only when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
