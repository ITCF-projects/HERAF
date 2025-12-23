# HERAF - Higher Education Reference Architecture Framework

Detta repository innehåller websidan för HERAF (Higher Education Reference Architecture Framework), ett ramverk för att skapa och strukturera referensarkitekturer inom högre utbildning.

## Om HERAF

### Projektets Mål

HERAF syftar till att utveckla en tydlig och lärosätesöverskridande standard som definierar hur vi skapar referensarkitekturer. Ramverket levererar en vägledning och modeller som är tillräckligt flexibla för att användas vid skapandet av områdesspecifika referensarkitekturer.

Ramverket innehåller dokument som beskriver, visualiserar och vägleder i hur man skapar en referensarkitektur. 

## Teknisk Dokumentation

### Teknikstack

Detta projekt är byggt med:
- **SvelteKit 5** - Applikationsramverk
- **TypeScript** - Typad JavaScript
- **Vite** - Byggverktyg
- **Tailwind CSS 4** - Styling
- **Marked** - Markdown-parsing
- **Gray Matter** - Frontmatter-parsing

### Komma igång

#### Förutsättningar
- Node.js (version 18 eller senare rekommenderas)
- npm

#### Installation

1. Klona repositoryt:
```bash
git clone <repository-url>
cd HERAF
```

2. Installera beroenden:
```bash
npm install
```

3. Starta utvecklingsservern:
```bash
npm run dev
```

Webbplatsen öppnas på `http://localhost:5173`

#### Tillgängliga kommandon

- `npm run dev` - Startar utvecklingsservern (bygger innehåll och startar Vite)
- `npm run build` - Bygger produktionsversionen
- `npm run build:content` - Genererar innehållsdata från markdown-filer
- `npm run preview` - Förhandsgranskar produktionsbygget
- `npm run check` - Kör type-checking med svelte-check
- `npm run check:watch` - Kör type-checking i watch-läge

### Projektstruktur

```
HERAF/
├── src/
│   ├── content/           # Markdown-innehåll
│   │   ├── concepts/      # Grundläggande koncept och termer
│   │   └── governance/    # Vägledning (principer, riktlinjer, regler)
│   ├── lib/               # Återanvändbara komponenter och utilities
│   │   ├── content.ts     # Innehållshantering
│   │   ├── Sidebar.svelte # Sidofältkomponent
│   │   └── types.d.ts     # TypeScript-typdefinitioner
│   └── routes/            # SvelteKit-routes
│       ├── begrepp/       # Begreppsvy
│       ├── heram/         # HERAM-vy
│       └── vagledning/    # Vägledningsvy
├── scripts/
│   └── generate-content.js # Script för att generera innehållsdata
└── static/                # Statiska filer
```

### Innehållshantering

#### Lägga till nytt innehåll

Allt innehåll lagras som Markdown-filer i `src/content/`. Innehållet organiseras i följande kategorier:

**Koncept** (`src/content/concepts/`)
- Grundläggande termer och definitioner
- Varje fil representerar ett koncept

**Vägledning** (`src/content/governance/`)
- `principles/` - Styrande principer (EAP001-004, P001-003)
- `guidelines/` - Riktlinjer (R001-005)
- `rules/` - Regler (RE001-013)

#### Markdown-format

Varje Markdown-fil kan innehålla frontmatter med metadata:

```markdown
---
title: "Konceptets titel"
description: "En kort beskrivning"
---

# Innehåll

Markdown-innehåll här...
```

#### Regenerera innehåll

När du lägger till eller ändrar innehåll, kör:

```bash
npm run build:content
```

Detta genererar `src/lib/content-data.generated.ts` som används av applikationen.

## Bidra till projektet

### Lägga till nya koncept

1. Skapa en ny `.md`-fil i `src/content/concepts/`
2. Lägg till titel och innehåll
3. Kör `npm run build:content`
4. Konceptet visas automatiskt under "Begrepp"

### Lägga till nya vägledningar

1. Skapa en ny `.md`-fil i rätt underkatalog:
   - `src/content/governance/principles/` för principer
   - `src/content/governance/guidelines/` för riktlinjer
   - `src/content/governance/rules/` för regler
2. Följ namngivningskonventionen (t.ex. `P004.md`, `R006.md`, `RE014.md`)
3. Kör `npm run build:content`
4. Vägledningen visas automatiskt under "Vägledning"


## Deployment

När man pushar till main-branchen, triggas en GitHub Actions-workflow som bygger och deployerar webbplatsen till GitHub Pages.

## Licens



## Kontakt




