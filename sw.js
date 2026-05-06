const CACHE_NAME = 'decihelp-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './logo.png'
];

// Install Service Worker dan Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Gunakan Cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache jika ada, jika tidak fetch dari internet
        return response || fetch(event.request);
      })
  );
});
