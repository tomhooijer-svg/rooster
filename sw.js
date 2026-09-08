/* Service worker voor Rooster Tom.

   Strategie:
   - index.html en sw.js: eerst het netwerk (met korte time-out), anders de cache.
     Zo zie je een nieuwe versie meteen, en werkt de app nog steeds zonder internet.
   - iconen en manifest: eerst de cache, op de achtergrond verversen.

   Verhoog VERSIE na elke wijziging in index.html. */
const VERSIE = "rooster-tom-v4";
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

function bewaar(verzoek, antwoord) {
  if (antwoord && antwoord.status === 200 && antwoord.type === "basic") {
    const kopie = antwoord.clone();
    caches.open(VERSIE).then(cache => cache.put(verzoek, kopie));
  }
  return antwoord;
}

self.addEventListener("fetch", event => {
  const verzoek = event.request;
  if (verzoek.method !== "GET") return;

  const url = new URL(verzoek.url);
  const isPagina = verzoek.mode === "navigate" ||
                   url.pathname.endsWith("/") ||
                   url.pathname.endsWith(".html");

  if (isPagina) {
    /* netwerk eerst, met een time-out zodat een trage verbinding je niet ophoudt */
    event.respondWith(
      Promise.race([
        fetch(verzoek).then(a => bewaar(verzoek, a)),
        new Promise(resolve => setTimeout(() => resolve(null), 3000))
      ])
        .then(a => a || caches.match(verzoek).then(c => c || fetch(verzoek)))
        .catch(() => caches.match(verzoek).then(c => c || caches.match("./index.html")))
    );
    return;
  }

  /* de rest: cache eerst, op de achtergrond bijwerken */
  event.respondWith(
    caches.match(verzoek).then(gecached => {
      const vanNet = fetch(verzoek).then(a => bewaar(verzoek, a)).catch(() => gecached);
      return gecached || vanNet;
    })
  );
});
