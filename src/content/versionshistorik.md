<!--
Instruktion för den som uppdaterar filen (även AI-agenter):

- Lägg till nya ändringar under den senaste versionen, överst i filen.
  Skapa en ny versionsrubrik först när versionsnumret i static/vagledning.md ändras.
- Börja varje version med en kort sammanfattning (två till fyra meningar) av de viktigaste
  ändringarna. Uppdatera sammanfattningen när nya ändringar läggs till.
- Sortera varje ändring under en av två rubriker:
  - "Ramverkets innehåll": ändringar i Vägledningen, HERAM (begrepp, konceptkarta,
    styrning), iterationsmallen och AI-instruktionens innehåll.
  - "Funktioner": ändringar i webbplatsen, nedladdningar och verktyg som inte
    ändrar vad ramverket säger.
- En punkt per ändring. Beskriv vad som har ändrats för läsaren, inte hur det är gjort i koden.
- Jämför med föregående version: skriv inte att något är tillagt om det fanns tidigare.
- Hänvisa till styrning och begrepp med ID eller namn, till exempel RE011 eller Angelägenhet.
- Skriv på svenska, sakligt och kort.
-->

# Versionshistorik

## 0.6-Alfa – 2026-11-23

Vägledningen är omskriven. Processen har sex steg, en miniminivå för vad en iteration ska innehålla och en iterationsmall att arbeta i. HERAM har ett nytt begrepp, Arkitekturprinciper, och begreppen beskrivs i en fast ordning med en inledning. Webbplatsen har ny utformning, och ramverket finns också som en instruktion för AI-agenter.

### Ramverkets innehåll

- Vägledningen är omskriven och börjar med en snabbguide. Inledningen är hopfälld.
- Processen har sex steg i stället för fyra skapande aktiviteter. Omfång är uppdelat i tre steg: välj primär målgrupp, identifiera angelägenheter och bestäm omfång. Därefter följer identifiering, definiering och konkretisering. Varje steg har syfte, aktiviteter och resultat.
- Det framgår att de valda angelägenheterna bestämmer iterationens omfång.
- De löpande aktiviteterna (tidigare kontinuerliga aktiviteter) är omarbetade. Förankring sker med en referensgrupp i stället för enbart med målgruppen, och aktiviteten Dokumentera underlag är ny.
- En miniminivå för en iteration är tillagd. Varje krav hänvisar till styrningen i HERAM.
- Iterationsmallen är ny och följer processens steg.
- Begreppstabellerna är borttagna ur Vägledningen. Begreppen beskrivs i HERAM.
- HERAM har en inledning som förklarar konceptbeskrivningarna och deras ordning.
- Begreppet Arkitekturprinciper är tillagt. Riktlinje och Regel visas som separata begrepp i konceptkartan.
- Målgrupp och Målgruppsperspektiv beskriver vilken nytta målgruppen har av referensarkitekturen.
- "Lösning" och "område" används i stället för "system" i begreppen.
- "Högre utbildning" används i stället för "högskolesektorn".
- Angelägenhet: "Affärsangelägenheter" heter nu "Verksamhetsangelägenheter".
- Ny AI-instruktion. Användaren väljer om agenten ska fylla i iterationsmallen eller vägleda, och instruktionen innehåller frågor för varje steg.

### Funktioner

- Ny startsida som visar Vägledningen och HERAM som ramverkets två delar.
- Begrepp, konceptkarta och styrning finns samlade på en sida, HERAM, i stället för i flikar. Den tidigare sidan Begrepp leder dit.
- Vägledningen och HERAM har en innehållsförteckning i sidomarginalen.
- Diagrammen är ritade om. I processdiagrammet går det att välja ett steg för att komma till beskrivningen.
- Vägledningen visar en förloppsindikator när man läser processen.
- Iterationsmallen kan laddas ner som Word-fil och som markdown.
- AI-instruktionen heraf-agent.md och översikten llms.txt genereras från samma källor som webbplatsen.
- Startsidan har en knapp som kopierar länken till AI-instruktionen.
- Nya märken, färger och typsnitt. Sidorna har egna titlar och en felsida på svenska.
- Markdown- och textfiler visas med rätt teckenkodning (UTF-8).

## 0.5-Alfa – 2025-12-23

Begreppen i HERAM har uppdaterade definitioner och en konceptmodell. Webbplatsen visar versionsnummer.

### Ramverkets innehåll

- Uppdaterade definitioner av begreppen i HERAM.
- Uppdaterad vägledning.
- Konceptmodell för HERAM.

### Funktioner

- Versionsnummer visas på webbplatsen.
- Rättad innehållsförteckning i Vägledningen.
