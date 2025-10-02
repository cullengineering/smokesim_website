/**
 * Service Worker for PWA functionality
 * Implements modern caching strategies and offline support
 */

const STATIC_CACHE = 'smokesim-static-v1'
const DYNAMIC_CACHE = 'smokesim-dynamic-v1'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/smokesim_logo.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - implement network-first strategy for dynamic content
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request)
            .then((response) => {
              return response || caches.match('/')
            })
        })
    )
    return
  }

  // Handle other requests with cache-first strategy for static assets
  if (request.url.includes('/assets/') || request.url.includes('.png') || request.url.includes('.jpg')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return response
            })
        })
    )
    return
  }

  // Default: network-first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone)
            })
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})