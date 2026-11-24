# Vägledning

Hur man tar fram en referensarkitektur enligt HERAF, Higher Education Reference Architecture Framework.

**Version 0.6-Alfa**, 2026-11-23. Vägledningen är ett utkast och innehållet kan ändras.

## Snabbguide

Du behöver inte läsa hela vägledningen innan du börjar. Läs den här översikten, ladda ner iterationsmallen och läs varje steg när du kommer till det.

En iteration behöver inte vara omfattande. Börja med en målgrupp och en angelägenhet. Fler angelägenheter kan läggas till i efterhand, det är vad det iterativa arbetet innebär. Ni bestämmer själva hur stor eller liten varje iteration ska vara.

{{snabbguide}}

Det viktigaste begreppet att känna till är [angelägenhet](concept:angelagenhet) (engelska *concern*): något som är viktigt för målgruppen och som referensarkitekturen behöver ge svar på. Övriga begrepp beskrivs i [HERAM].

---

## Inledning

### Bakgrund

Svenska lärosäten har i stor utsträckning samma behov när det gäller att utveckla och förvalta IT-lösningar. Utan en gemensam syn på vad en referensarkitektur är, hur den struktureras och vad den ska användas till blir det svårt att samarbeta och att återanvända lösningar mellan lärosäten.

HERAF finns för att ge sektorn ett gemensamt sätt att ta fram referensarkitekturer. Ramverket är inte knutet till ett enskilt projekt eller lärosäte, utan är tänkt att användas och förvaltas över tid av alla som tar fram referensarkitekturer inom högre utbildning. Ramverket initierades av ATI.

### Syfte

Vägledningen beskriver kort vad HERAF består av och hur ramverket används när man tar fram en referensarkitektur. Ramverket ger en gemensam struktur men undviker detaljstyrning, så att varje område kan anpassa arbetet efter sina förutsättningar.

### Vad är en referensarkitektur?

En referensarkitektur är en mall eller ett ramverk som beskriver en rekommenderad struktur och organisering inom ett specifikt område. Den fungerar som en överenskommen vägledning och standardiseringsgrund för hur lösningar inom området bör utformas.

En referensarkitektur tillhandahåller **principer, strukturer, begrepp, mönster och arkitekturvyer**. Implementationsguider, teknisk design, API-specifikationer och kod ingår normalt *inte* – de tas fram senare, i lösningsarkitektur och implementation, med referensarkitekturen som grund.

*Källor för definitionen: DoD Reference Architecture White Paper; Reference architecture – Wikipedia; Referensarkitektur för Identitet och åtkomst.*

```note Viktigt att veta
En referensarkitektur ska alltid utgå från en tydligt vald målgrupp och dess angelägenheter. Annars blir den varken relevant eller användbar.
```

### Varför behövs en referensarkitektur?

- **Gemensamt språk.** Principer, komponenter och deras relationer beskrivs på samma sätt, vilket minskar missförstånd och gör det lättare att samordna initiativ.
- **Återanvändning i stället för att börja om.** Arbetet utgår från beprövade lösningar och kan fokusera på att anpassa och vidareutveckla, vilket sparar tid och minskar risk.
- **Underlag för beslut.** Den nuvarande IT-miljön kan jämföras mot ett definierat mål, vilket ger välgrundade motiveringar till tekniska vägval.

### Läsanvisning

Vägledningen kan läsas från början till slut eller användas som uppslagsverk. Ska du ta fram en referensarkitektur räcker det att börja med [[Snabbguide]] och läsa varje steg i [[Process: Skapa referensarkitektur]] när du kommer till det.

Begreppen i vägledningen förklaras i [HERAM], som bygger på standarden ISO/IEC/IEEE 42010:2022 med viss anpassning och förenkling.

---

## HERAF

HERAF består av två delar:

- **Vägledningen** – det här dokumentet. Beskriver hur ramverket används och hur man tar fram en referensarkitektur, steg för steg.
- **[HERAM]** (Higher Education Reference Architecture Model) – den teoretiska grunden. Innehåller en konceptkarta och konceptbeskrivningar som förklarar begreppen och hur de hänger ihop, samt styrande principer, riktlinjer och regler som gör att referensarkitekturer blir enhetliga.

Båda delarna används när man skapar en referensarkitektur. Konceptkartan visualiserar konceptbeskrivningen, och processmodellen visualiserar processbeskrivningen.

{{diagram:overview|HERAF:s delar och hur de används för att skapa en referensarkitektur.}}

---

## Process: Skapa referensarkitektur

Processen hjälper till att kvalitetssäkra arbetet och ger lärosätena ett gemensamt arbetssätt. Den är vägledande snarare än tvingande.

Arbetet sker i **iterationer**. Varje iteration riktar sig till **en** målgrupp och ett avgränsat omfång. Det är bättre att göra flera små iterationer än att försöka täcka alla målgrupper på en gång.

{{diagram:process|Processmodellen. Välj ett steg för att gå till beskrivningen.}}

En iteration består av:

- **Starta iterationen** (steg 1–3): Avgör vad iterationen ska handla om.
- **Ta fram innehållet** (steg 4–6): Genomförs i ordning, men man kan gå tillbaka till ett tidigare steg när något nytt dyker upp.
- **Löpande aktiviteter**: pågår under hela iterationen.

Allt arbete dokumenteras i en iterationsmall, se [[Exempel och mallar]].

### Starta iterationen

#### Steg 1: Välj primär målgrupp

**Syfte:** Bestämma vem iterationen är till för. Referensarkitekturen ska vara användbar för just den målgruppen.

**Aktiviteter**
- Lista tänkbara målgrupper, till exempel IT-arkitekter, utvecklare, förvaltare eller beslutsfattare.
- Välj **en** primär målgrupp. Fråga: vilken målgrupp är viktigast att stödja *just nu*?
- Notera övriga målgrupper som kandidater till kommande iterationer.

**Resultat:** Fältet *Primär målgrupp* i iterationsmallen.

#### Steg 2: Identifiera målgruppens angelägenheter

**Syfte:** Förstå vad som är viktigt för målgruppen, vilka frågor de behöver få svar på.

**Aktiviteter**
- Samla in målgruppens [angelägenheter](concept:angelagenhet), till exempel genom intervjuer eller workshops.
- Formulera varje angelägenhet så att den går att besvara, till exempel ”Hur ska tjänster autentisera sig mot varandra?”.
- Ge varje angelägenhet ett ID (C01, C02 …).

**Resultat:** En lista med angelägenheter i sektionen *Angelägenheter*.

#### Steg 3: Bestäm omfång

**Syfte:** Avgränsa iterationen. Omfånget styrs av de angelägenheter som väljs – inte tvärtom.

**Aktiviteter**
- Bestäm vilket område referensarkitekturen gäller, till exempel IAM, integration, AI, IoT eller nätverk. Undvik ett alltför brett område.
- Välj vilka angelägenheter som ska adresseras i den här iterationen. **De valda angelägenheterna är omfånget.**
- Motivera varför övriga angelägenheter inte adresseras nu.
- Skriv ner vad som uttryckligen *inte* ingår, till exempel ”endast tekniskt perspektiv i denna iteration”.

**Resultat:** Sektionen *Omfång* i iterationsmallen, samt kolumnen *Adresseras* för varje angelägenhet.

```note Relaterade principer
* [P:EAP004]
* [P:P002]
```

### Ta fram innehållet

#### Steg 4: Identifiering

**Syfte:** Kartlägga vad som påverkar referensarkitekturen. Här fattas inga beslut.

**Aktiviteter**
- Lista relevanta standarder, mönster och best practices.
- Lista lagar och regulatoriska krav.
- Lista överordnad styrning, till exempel strategier och principer som redan gäller.
- Titta på hur andra lärosäten och organisationer har löst samma sak.

**Resultat:** Sektionen *Identifiering* – ett underlag som visar vilka krav, mönster och behov som ska beaktas.

#### Steg 5: Definiering

**Syfte:** Bestämma ramarna för referensarkitekturen, utan att gå ner på detaljnivå.

**Aktiviteter**
- Beskriv vilken nytta målgruppen ska få av referensarkitekturen.
- Bestäm vilka vyer som behövs. Varje vy ska adressera minst en vald angelägenhet.
- Skriv en vy-specifikation för varje vy som anger detaljnivå, aspekter och målgruppsperspektiv.
- Bestäm vilka principer, riktlinjer och regler som ska gälla för området.

**Resultat:** Sektionen *Definiering* – en lista över vyer och styrande principer som ska konkretiseras.

#### Steg 6: Konkretisering

**Syfte:** Ta fram innehållet som definierades i föregående steg.

**Aktiviteter**
- Ta fram de vyer som definierades.
- Formulera färdigt principer, riktlinjer och regler.
- Ta fram en begreppsmodell för området.

**Resultat:** Sektionen *Konkretisering* – en referensarkitektur för området, för den valda målgruppen.

### Löpande aktiviteter

#### Förankra med referensgrupp

Sätt upp en referensgrupp med representanter för målgruppen och relevanta intressenter. Dela referensarkitekturen med gruppen löpande – inte bara i slutet – för att få återkoppling och säkerställa att den är relevant och användbar.

**Resultat:** Sektionen *Förankring* – datum, forum och återkoppling.

#### Kommunicera med intressenter

Håll löpande kontakt med intressenter så att viktiga perspektiv och krav kommer med, till exempel säkerhetskrav, styrande principer eller strategiska inriktningar.

#### Dokumentera arkitekturbeslut

Dokumentera de viktigaste besluten tillsammans med motiveringen. Det ger spårbarhet och gör det lättare för målgrupp och intressenter att förstå varför referensarkitekturen ser ut som den gör.

**Resultat:** Sektionen *Arkitekturbeslut*.

#### Dokumentera underlag

Målgrupper, intressenter, angelägenheter och kartläggningar är underlag för arbetet, men ingår inte i den färdiga referensarkitekturen. Sätt därför upp en gemensam dokumentyta för underlaget redan från start, så att det går att spåra varför referensarkitekturen ser ut som den gör och så att nästa iteration kan bygga vidare.

---

## Vad ska en referensarkitektur innehålla?

Det här är miniminivån för en iteration enligt HERAF. Övriga delar läggs till när de behövs för målgruppen. Kolumnen *Grund* visar vilken styrning i HERAM som kravet kommer från.

| Del | Krav | Kommentar | Grund |
|-----|------|-----------|-------|
| Område och primär målgrupp | Måste | En målgrupp per iteration. | RE008, R004 |
| Angelägenheter | Måste | Med beslut om vilka som adresseras och motivering för övriga. | P002 |
| Omfång och avgränsningar | Måste | Vad som ingår och vad som inte ingår. | EAP004, P002 |
| Vyer med vy-specifikationer | Måste | Minst en vy per adresserad angelägenhet. Varje vy-specifikation anger detaljnivå, aspekter och målgruppsperspektiv. | RE006, RE010, RE011 |
| Principer, riktlinjer och regler | Måste | Endast det som är relevant för målgruppen. Varje riktlinje och regel har motivering och referens till överliggande styrning. | RE012, RE001, RE002, R005 |
| Begreppsmodell | Måste | För det valda området. | RE013 |
| Arkitekturbeslut | Bör | De mest centrala besluten med motivering. | EAP001 |
| Mönster | Kan | När det finns beprövade lösningar att peka på, till exempel för lagefterlevnad. | R001 |

---

## Exempel och mallar

**Iterationsmall** – en mall för att dokumentera en iteration. Sektionerna följer processens steg: Omfång, Angelägenheter, Identifiering, Definiering, Konkretisering, Arkitekturbeslut, Förankring och Avslut. Ladda ner iterationsmallen som [Word](mallar/iterationsmall.docx) eller [markdown](mallar/iterationsmall.md).

Fler exempel kommer att läggas till.
