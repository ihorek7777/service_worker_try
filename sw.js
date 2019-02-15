const CACHE_NAME = 'v2';
const urlsToCache = [
  '/',
  './index.html',
  './style.css',
  './app.js',
  './image-list.js',
  './star-wars-logo.jpg',
  './gallery/myLittleVader.jpg',
  'https://www.sciencedaily.com/images/2018/08/180824103018_1_540x360.jpg',
  'https://www.sciencedaily.com/images/2019/01/190123191637_1_540x360.jpg',
  'https://www.sciencedaily.com/images/2019/01/190123131706_1_540x360.jpg',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  console.log('kek 2');
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
  
      console.log('!!!!');
      return fetch(event.request).then(function (response) {
        const responseCloned = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseCloned);
        });
        return response;
      }).catch(function () {
        console.log('sssd');
        return caches.match('./gallery/myLittleVader.jpg');
      });
    })
  )
});

self.addEventListener('activate', function(event) {
  console.log('activate');
  var cacheWhitelist = ['v2'];
  
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('sync', function(event) {
  console.log('sync');
  self.registration.showNotification("Sync event fired!");
});
