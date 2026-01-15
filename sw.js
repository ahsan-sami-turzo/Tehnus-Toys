const CACHE_NAME = 'tehnus-toys-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/assets/rattle.mp3',
    '/assets/bell.mp3',
    '/assets/maraca.mp3',
    '/assets/wood.mp3',
    '/assets/silent_loop.mp3'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});