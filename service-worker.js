
self.addEventListener('install', e=>{
  e.waitUntil(caches.open('iic-v1').then(c=>c.addAll([
    '/', '/index.html','/styles.css','/app.js',
    '/offline.html','/manifest.webmanifest','/data/branches.json'
  ])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).catch(()=> caches.match('/offline.html')))
  );
});
