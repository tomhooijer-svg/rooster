# Rooster Tom

Klein PWA-tooltje met je weekrooster (dinsdag, donderdag, vrijdag). Werkt offline,
is te installeren op het beginscherm van je iPhone, en heeft:

- **Direct de juiste dag** bij openen (of de eerstvolgende werkdag), met automatisch
  scrollen naar het blok waar je nu in zit.
- **Live "nu"-indicator**: het huidige blok krijgt een rode rand + NU-label, er loopt een
  rode lijn met de klok mee, en blokken die voorbij zijn worden grijs. Bovenin staat een
  balkje met "Nu bezig … nog 18 min · daarna …".
- **Notitie per blok**: tik een blok aan en typ bijv. "Jaap-Jan ziek, i.p.v. hem Mees".
- **Rooster bewerken in de app**: tijd, wie/waar en activiteit aanpassen, blokken
  toevoegen of verwijderen. Via ⚙︎ rechtsboven zet je alles terug naar het origineel.
- Wisselen van dag via de tabs Di/Do/Vr of door te swipen.

Notities en wijzigingen staan in `localStorage` op je telefoon — ze blijven bewaard,
maar staan alleen op dat toestel (niet in de cloud, geen back-up).

## Bestanden

    index.html    de hele app (HTML + CSS + JS in één bestand)
    manifest.json PWA-manifest (naam, icoon, standalone)
    sw.js         service worker (offline)
    *.png         app-iconen (180/192/512 px)

## Online zetten met GitHub Pages

1. Maak op github.com een nieuwe repository, bijv. `rooster`.
2. Upload alle bestanden uit deze map (`index.html`, `manifest.json`, `sw.js` en de
   drie `.png`-bestanden) naar de repo — via "Add file → Upload files" kan het gewoon in de browser.
3. Ga in de repo naar **Settings → Pages**, kies bij *Source* "Deploy from a branch",
   branch `main`, map `/ (root)`, en klik Save.
4. Na een minuutje staat hij op `https://<jouwgebruikersnaam>.github.io/rooster/`.

Vanaf de terminal kan het ook:

    cd rooster-tom
    git init && git add . && git commit -m "Rooster Tom"
    git branch -M main
    git remote add origin https://github.com/<jouwnaam>/rooster.git
    git push -u origin main

## Op je beginscherm zetten (iPhone)

1. Open de link in **Safari** (moet Safari zijn, niet Chrome).
2. Tik op het deel-icoon → **Zet op beginscherm** → naam wordt "Rooster".
3. Open hem voortaan via het icoon: hij start fullscreen, zonder Safari-balk, en werkt
   ook zonder internet.

## Rooster aanpassen in de code

Het basisrooster staat bovenin `index.html`, in het blok `BASIS_ROOSTER` (zoek op
"1. ROOSTERDATA"). Pas daar de tijden/namen aan en zet het bestand opnieuw online.

Twee dingen om te weten:

- Heb je in de app zelf iets bewerkt, dan wint die opgeslagen versie van de code.
  Gebruik ⚙︎ → "Rooster terugzetten naar origineel" om de nieuwe code-versie te zien.
- Verhoog na elke wijziging de regel `const VERSIE = "rooster-tom-v1";` bovenin `sw.js`
  (v2, v3, …). Anders blijft je iPhone de oude versie uit de offline-cache tonen.

Kleuren per activiteit staan in `SOORTEN`; nieuwe activiteiten zonder kleur krijgen
gewoon geen kleurtje, dat werkt verder prima.
