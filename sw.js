/**
 * TEHNUS TOYS - Service Worker (Synthetic v3)
 * Optimized for logic-based audio and rainbow-mode UI.
 */

const CACHE_NAME = 'tehnus-v3-rainbow';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

/**
 * INSTALL EVENT:
 * Pre-caches all UI and logic files.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Pre-caching App Shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Move to the active state immediately
    self.skipWaiting();
});

/**
 * ACTIVATE EVENT:
 * Deletes old caches to ensure the baby doesn't see an old version of the toy.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Removing outdated cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Take control of all open tabs immediately
    return self.clients.claim();
});

/**
 * FETCH EVENT:
 * Strategy: Cache First, falling back to Network.
 * This ensures the app works perfectly in Airplane Mode.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});