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
- Hänvisa till styrning och begrepp med ID eller namn, till exempel RE011 eller Frågeställning.
- Skriv på svenska, sakligt och kort.
-->

# Versionshistorik

Ändringar i HERAF per version: Vägledningen, HERAM, iterationsmallen, AI-instruktionen och webbplatsen.

## 0.6-Alfa – 2026-11-23

Ramverket finns som en instruktion för AI-assistenter, [heraf-agent.md](https://heraf.se/heraf-agent.md). Med länken kan en AI-assistent fylla i iterationsmallen tillsammans med aktivitetsgruppen eller vägleda gruppen genom stegen. Vägledningen är omskriven, med sex steg, en miniminivå för vad en iteration ska innehålla och en iterationsmall att arbeta i. Begreppet Angelägenhet heter nu Frågeställning. I HERAM beskrivs begreppen i en fast ordning med en inledning, och webbplatsen har ny utformning.

### Ramverkets innehåll

- Ny AI-instruktion, heraf-agent.md, med processen, arbetsregler, styrning, begrepp och iterationsmall i en fil. Användaren väljer om AI-assistenten ska fylla i iterationsmallen eller vägleda, och instruktionen innehåller frågor för varje steg.
- Vägledningen är omskriven och börjar med en snabbguide. Inledningen är hopfälld.
- Processen har sex steg i stället för fyra skapande aktiviteter. Omfång är uppdelat i tre steg: välj primär målgrupp, identifiera frågeställningar och bestäm omfång. Därefter följer identifiering, definiering och konkretisering. Varje steg har syfte, aktiviteter och resultat.
- Det framgår att de valda frågeställningarna bestämmer iterationens omfång.
- De löpande aktiviteterna (tidigare kontinuerliga aktiviteter) är omarbetade. Förankring sker med en referensgrupp i stället för enbart med målgruppen, och aktiviteten Dokumentera underlag är ny.
- En miniminivå för en iteration är tillagd. Varje krav hänvisar till styrningen i HERAM.
- Iterationsmallen är ny och följer processens steg.
- Begreppstabellerna är borttagna ur Vägledningen. Begreppen beskrivs i HERAM.
- HERAM har en inledning som förklarar konceptbeskrivningarna och deras ordning.
- Begreppet Arkitekturprinciper har fått en beskrivning, som saknades tidigare. Riktlinje och Regel visas som separata begrepp i konceptkartan.
- Målgrupp och Målgruppsperspektiv beskriver vilken nytta målgruppen har av referensarkitekturen.
- "Lösning" och "område" används i stället för "system" i begreppen.
- "Högre utbildning" används i stället för "högskolesektorn".
- *Concern* översätts nu med Frågeställning i stället för Angelägenhet, i hela ramverket: begreppen, processens steg 2, iterationsmallen och AI-instruktionen.
- Det framgår att referensarkitekturen och arbetsunderlaget är olika saker. Frågeställningar och vy-specifikationer är verktyg för att ta fram referensarkitekturen och ingår inte i den. Miniminivån är uppdelad i två tabeller, och iterationsmallen, AI-instruktionen och begreppen Frågeställning och Vy-specifikation beskriver samma uppdelning.
- Styrningen om vyer är omarbetad efter samma uppdelning. RE006 säger att varje vy ska baseras på en vy-specifikation, RE009 att vy-specifikationen ska ange detaljnivå, aspekter och målgruppsperspektiv, R002 att referensarkitekturen bör innehålla tydliga vyer och R003 gäller varje vy-specifikation.
- Två regler är borttagna: regeln att referensarkitekturer ska innehålla vyer, som inte tillförde något, och regeln om vy-specifikationer anpassade efter intressenter, som överlappade med R002.
- Reglerna är omnumrerade och heter nu RE001–RE011. Tidigare RE008, RE009, RE011, RE012 och RE013 heter RE007, RE008, RE009, RE010 och RE011.
- Vy och Arkitekturperspektiv: vyer anpassas efter målgruppen, och vy-specifikationer beskrivs som arbetsunderlag.
- Frågeställning: typen "Affärsangelägenheter" heter nu "Verksamhetsfrågeställningar".

### Funktioner

- Versionshistoriken finns som en egen sida. Den nås från versionsnumret i sidhuvudet, från sidfoten och från startsidan.
- Startsidan börjar med en färdig prompt och länken till AI-instruktionen. Båda kan kopieras med en knapp och klistras in direkt i en AI-assistent.
- Ny startsida som visar Vägledningen och HERAM som ramverkets två delar.
- Begrepp, konceptkarta och styrning finns samlade på en sida, HERAM, i stället för i flikar. Den tidigare sidan Begrepp leder dit.
- Vägledningen och HERAM har en innehållsförteckning i sidomarginalen.
- Diagrammen är ritade om. I processdiagrammet går det att välja ett steg för att komma till beskrivningen.
- Vägledningen visar en förloppsindikator när man läser processen.
- Iterationsmallen kan laddas ner som Word-fil och som markdown.
- AI-instruktionen heraf-agent.md och översikten llms.txt genereras från samma källor som webbplatsen.
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
