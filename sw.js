const CACHE_NAME = 'poopy-cache-v1.3';
const urlsToCache = [
  './',
  './index.html', // GANTI dengan nama file HTML-mu sebenarnya (misal: index.html)
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'
];

// Install Service Worker dan simpan file ke Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ambil file dari Cache saat Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, gunakan itu (offline mode)
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari network
        return fetch(event.request);
      })
  );
});

// Bersihkan cache lama jika ada pembaruan
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// --- NOTIFICATION CLICK EVENT ---
self.addEventListener('notificationclick', event => {
  // Tutup notifikasi setelah diketuk
  event.notification.close();

  // Membuka atau memfokuskan kembali aplikasi
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Jika aplikasi sudah terbuka di salah satu tab/jendela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && 'focus' in client) {
          // Fokuskan jendela aplikasi
          client.focus();
          // Kirim pesan ke aplikasi untuk pindah ke layar timer
          client.postMessage({ action: 'openTimerScreen' });
          return;
        }
      }
      
      // Jika aplikasi sedang tertutup total, buka jendela baru
      if (clients.openWindow) {
        return clients.openWindow('./').then(windowClient => {
          // Beri sedikit jeda agar DOM termuat, lalu kirim pesan
          setTimeout(() => {
            if(windowClient) windowClient.postMessage({ action: 'openTimerScreen' });
          }, 1000);
        });
      }
    })
  );
});
