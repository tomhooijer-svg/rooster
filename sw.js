/* Service worker voor Rooster Tom.
   LET OP: verhoog VERSIE na elke wijziging in index.html,
   anders blijft de oude versie uit de cache komen. */
const VERSIE = "rooster-tom-v1";
const BESTANDEN = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(VERSIE).then(cache => cache.addAll(BESTANDEN)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== VERSIE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/* Cache eerst (snel + offline), op de achtergrond verversen. */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(gecached => {
      const vanNet = fetch(event.request).then(antwoord => {
        if (antwoord && antwoord.status === 200 && antwoord.type === "basic") {
          const kopie = antwoord.clone();
          caches.open(VERSIE).then(cache => cache.put(event.request, kopie));
        }
        return antwoord;
      }).catch(() => gecached);
      return gecached || vanNet;
    })
  );
});
