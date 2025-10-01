const CACHE = 'edupath-cache-v3.0-no-cache-' + Date.now();

const CORE_ASSETS = [
  './index.html',
  './quiz.html',
  './courses.html',
  './career.html',
  './colleges.html',
  './scholarships.html',
  './timeline.html',
  './profile.html',
  './assets/main.js',
  './assets/styles.css',
  './assets/career-data.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients && self.clients.claim && self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Force fresh fetch for all HTML files to prevent navigation caching issues
  if (req.url.includes('.html')) {
    event.respondWith(
      fetch(req, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }).then((res) => {
        // Don't cache HTML files to prevent UI inconsistency
        return res;
      }).catch(() => caches.match('index.html'))
    );
    return;
  }
  
  // Standard caching for other files
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(req, copy));
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
