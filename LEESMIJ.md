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
- Wisselen van dag via de tabs Di/Do/Vr, door te swipen, of met de pijltjestoetsen.
- **Breed scherm**: op een venster vanaf 900 px breed (je Mac) staan dinsdag, donderdag
  en vrijdag als drie kolommen naast elkaar. Smaller wordt het automatisch weer één dag
  met tabs.

Notities en wijzigingen staan in `localStorage` op je telefoon — ze blijven bewaard,
maar staan alleen op dat toestel (niet in de cloud, geen back-up). Wil je ze op meerdere
apparaten, zie "Synchroniseren" hieronder. Er is bewust geen koppeling met Microsoft
Teams: dat zou een app-registratie in Azure AD en goedkeuring van ICT vragen. De
deelknop levert hetzelfde resultaat met één tik extra.

## Synchroniseren tussen iPhone en Mac

Standaard staan notities alleen op het apparaat waar je ze typt. Wil je ze op allebei,
vul dan bovenin `index.html` het blok `SYNC` in met de gegevens van een eigen (gratis)
Supabase-project. Zolang die velden leeg zijn, blijft alles lokaal.

**Project aanmaken (éénmalig, ongeveer 5 minuten)**

1. Ga naar supabase.com en log in — dat kan met je GitHub-account.
2. **New project**. Naam: `rooster`. Kies bij Region **Frankfurt (eu-central-1)**, zodat de
   gegevens binnen de EU blijven. Verzin een databasewachtwoord en bewaar dat ergens; je
   hebt het voor deze app niet nodig, wel als je ooit zelf in de database wilt kijken.
3. Open links de **SQL Editor**, plak onderstaande query en klik Run:

```sql
create table rooster_data (
  user_id      uuid primary key references auth.users on delete cascade,
  rooster      jsonb,
  notities     jsonb,
  leerkrachten jsonb,
  meta         jsonb,
  bijgewerkt   timestamptz default now()
);

alter table rooster_data enable row level security;

create policy "eigen rij lezen"    on rooster_data for select using (auth.uid() = user_id);
create policy "eigen rij maken"    on rooster_data for insert with check (auth.uid() = user_id);
create policy "eigen rij wijzigen" on rooster_data for update using (auth.uid() = user_id)
                                                          with check (auth.uid() = user_id);
```

   Die laatste regels (row level security) zijn wat je notities afschermt: alleen jouw
   eigen ingelogde account kan bij jouw rij.

4. Ga naar **Authentication → URL Configuration**. Zet bij *Site URL* en bij *Redirect URLs*
   het adres van de app: `https://tomhooijer-svg.github.io/rooster/`. Zonder dit werkt de
   inloglink uit je mail niet.
5. Ga naar **Project Settings → API** en kopieer de **Project URL** en de **anon public**
   key. Die twee zet je in het `SYNC`-blok bovenin `index.html`.

De anon key is bedoeld om openbaar te zijn; die mag dus gewoon in de repo staan. De
**service_role** key niet — die geeft toegang tot alles en hoort nergens in de app.

**Gebruiken**: open de app, ga naar ⚙︎ → Synchroniseren, vul je e-mailadres in en klik op
"Stuur mij een inloglink". Je krijgt een mail met een link; die open je op het apparaat
waar je bent. Geen wachtwoord nodig. Herhaal dit één keer op je Mac en één keer op je
iPhone, daarna gaat het vanzelf: bij het openen van de app, en telkens een paar seconden
nadat je iets hebt gewijzigd.

Bij een conflict wint per notitie de laatste wijziging. Een notitie die je op je Mac wist,
verdwijnt dus ook op je iPhone. Het rooster zelf (tijden, leerlingen) en de leerkracht-
namen worden als geheel overgenomen van het apparaat waar ze het laatst zijn aangepast.

Twee dingen om te weten: op het gratis abonnement pauzeert Supabase een project na een
week zonder gebruik — dan moet je het in het dashboard even hervatten. En het versturen
van inlogmails is beperkt tot een paar per uur, wat voor incidenteel inloggen ruim genoeg
is. Verder: hiermee staan notities over leerlingen bij een externe partij. Voor school
hoort daar formeel een verwerkersovereenkomst bij; dat is iets om met je directie of ICT
af te stemmen.

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
