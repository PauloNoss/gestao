const cacheName = "meu-caixa-cache-v4-design-ai";
const files = ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest", "icon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(files)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
