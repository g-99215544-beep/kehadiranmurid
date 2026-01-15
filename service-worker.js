// service-worker.js

// 🔥 CHANGE VERSION EVERY TIME YOU UPDATE SYSTEM
const CACHE_NAME = 'kehadiran-sksa-v14';

const urlsToCache = [
  './',
  './index.html',
  './database.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ===============================
// INSTALL
// ===============================
self.addEventListener('install', event => {
  console.log('[SW] Install');
  self.skipWaiting(); // 🔥 force activate new SW immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// ===============================
// ACTIVATE
// ===============================
self.addEventListener('activate', event => {
  console.log('[SW] Activate');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // 🔥 take control immediately
    })
  );
});

// ===============================
// FETCH
// ===============================
self.addEventListener('fetch', event => {
  // Always fetch latest index.html (important for updates)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        // Save new files into cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
