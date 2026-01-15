/**
 * TEHNUS TOYS - Service Worker (Refined)
 * Optimized for Synthetic Audio (No MP3 assets needed)
 */

const CACHE_NAME = 'tehnus-toys-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Install: Create cache and store assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Caching core assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Clearing old cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Claim control of all open clients (tabs)
    return self.clients.claim();
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached asset or fetch from network
            return response || fetch(event.request);
        })
    );
});