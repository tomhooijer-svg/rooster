# Rooster Tom

Klein PWA-tooltje met je weekrooster (dinsdag, donderdag, vrijdag). Werkt offline,
is te installeren op het beginscherm van je iPhone, en heeft:

- **Direct de juiste dag** bij openen (of de eerstvolgende werkdag), met automatisch
  scrollen naar het blok waar je nu in zit.
- **Live "nu"-indicator**: het huidige blok krijgt een rode rand + NU-label, er loopt een
  rode lijn met de klok mee, en blokken die voorbij zijn worden grijs. Bovenin staat een
  balkje met "Nu bezig … nog 18 min · daarna …".
- **Notitie per leerling**: tik een blok aan en typ per kind een notitie. Bij een blok
  met kinderen uit twee groepen (Maxima groep 5, Luca groep 6) heeft elk kind een eigen
  veld, zodat een notitie nooit bij de verkeerde leerkracht belandt. Notities horen bij
  een datum: wat je dinsdag 8 september typt, staat volgende week dinsdag niet meer in de
  weergave, maar blijft wel in de overdracht van die week terug te vinden.
- **Blok-notitie** bij blokken zonder leerlingen (verbreding, voorbereiding, pauze). Die
  is alleen voor jezelf en gaat nooit mee in een overdracht.
- **Overdracht** (het 📤-knopje rechtsboven): verzamelt de notities van de week en
  groepeert ze per groep. Per groep krijg je een kant-en-klaar tekstblok met een
  Delen-knop, die de iOS-deelkaart opent — daarmee stuur je het met één tik naar Teams,
  mail of Berichten. Met de pijltjes blader je naar eerdere weken. Het bolletje op het
  knopje toont hoeveel groepen deze week iets te ontvangen hebben.
- **Direct delen** kan ook per kind, via de Delen-knop naast de notitie.
- **Leerkracht per groep** (via ⚙︎): vul je een naam in, dan begint de overdracht met
  "Overdracht voor Marieke (groep 2C)".
- **Rooster bewerken in de app**: tijd, wie/waar, activiteit, en de leerlingen met hun
  groep. Blokken toevoegen of verwijderen, en via ⚙︎ alles terugzetten naar het origineel.
- Wisselen van dag via de tabs Di/Do/Vr of door te swipen; kleurcodes per activiteit.

Notities en wijzigingen staan in `localStorage` op je telefoon — ze blijven bewaard,
maar staan alleen op dat toestel (niet in de cloud, geen back-up). Er is bewust geen
koppeling met Microsoft Teams: dat zou een app-registratie in Azure AD en goedkeuring
van ICT vragen. De deelknop levert hetzelfde resultaat met één tik extra.

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

Bij elk blok staat een `leerlingen`-lijst met `naam` en `groep`. Die bepaalt naar welke
leerkracht een notitie gaat. Een leeg lijstje betekent: geen overdracht, alleen een
blok-notitie voor jezelf. De naam onder de overdracht komt uit `AFZENDER`.
