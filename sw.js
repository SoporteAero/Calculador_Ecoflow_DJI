const cacheName = 'aero-v5';
const assets = [
  './', 
  './index.html', 
  './style.css', 
  './app.js', 
  './logo-pwa.svg', 
  './logo-aero.png', 
  './logo-dji.png', 
  './logo-ecoflow.png', 
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
