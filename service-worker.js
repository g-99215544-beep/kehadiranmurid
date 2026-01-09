// service-worker.js
const CACHE_NAME = 'kehadiran-sksa-v1';
const urlsToCache = [
  './',
  './index.html',
  './database.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update cache when new version available
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Memadam cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
