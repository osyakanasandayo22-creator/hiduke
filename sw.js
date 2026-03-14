'use strict';

const CACHE_NAME = 'date-interval-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './images/logo.png',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache).catch(function () {
        // 一部失敗してもインストールは続行
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.mode !== 'navigate' && !event.request.url.match(/\.(html|css|js|png|ico|json)$/)) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (fetchResponse) {
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      });
    })
  );
});
