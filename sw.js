/**
 * TEHNUS TOYS - Service Worker (Synthetic v4)
 * Optimized for logic-based audio and rainbow-mode UI.
 */

const CACHE_NAME = 'tehnus-v4-particles';

// Use relative paths to ensure it works on GitHub Pages subfolders
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
            // We use map to catch individual file errors so one missing icon doesn't break the whole SW
            return Promise.all(
                ASSETS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => console.error('SW: Failed to cache', url, err));
                })
            );
        })
    );
    self.skipWaiting();
});

/**
 * ACTIVATE EVENT:
 * Cleans up old versions and takes control of the app.
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
        }).then(() => self.clients.claim()) // Ensure clients.claim is part of the chain
    );
});

/**
 * FETCH EVENT:
 * Strategy: Cache First, falling back to Network.
 */
self.addEventListener('fetch', (event) => {
    // Only handle GET requests (prevents errors with some analytics or external APIs)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // If both fail (offline and not cached), return the cached index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});