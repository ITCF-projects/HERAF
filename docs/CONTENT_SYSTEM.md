# HERAF content system

All content is Markdown. `scripts/generate-content.js` turns it into data and files that the site and AI agents use. It runs automatically with `npm run dev` and `npm run build`, or on its own with `npm run build:content`.

## Where content lives

| What | File(s) | Shown on |
|------|---------|----------|
| The guidance (Vägledningen) | `static/vagledning.md` | `/vagledning` |
| HERAM intro and concept order | `src/content/heram.md` | `/heram` |
| Concepts | `src/content/concepts/*.md` | `/heram`, side panel |
| Principles, guidelines, rules | `src/content/governance/{principles,guidelines,rules}/*.md` | `/heram`, side panel |
| Iteration template | `src/content/templates/iteration_template.md` | Download, agent guide |
| Agent guide layout and rules | `src/content/agent/heraf-agent.template.md` | `heraf-agent.md` |
| Diagrams | `src/lib/diagrams/*.svg` | Inlined in the guidance |
| Concept map | `src/lib/components/ConceptModelData.ts` | `/heram` |

## Generated output

Never edit these by hand. All are gitignored and rebuilt on every build.

| File | Built from |
|------|------------|
| `src/lib/content-data.generated.ts` | Everything above; the site imports this |
| `static/heraf-agent.md` | Agent template + process and minimum-content sections of the guidance + governance + concepts + template |
| `static/llms.txt` | Index pointing AI tools to `heraf-agent.md` |
| `static/mallar/iterationsmall.md` | Copy of the iteration template |
| `static/mallar/iterationsmall.docx` | The iteration template as Word, converted by `scripts/template-docx.js` |

## Writing the guidance (`static/vagledning.md`)

Plain Markdown, plus a few extras:

| Syntax | Result |
|--------|--------|
| `[[Exempel och mallar]]` | Link to that heading in the guidance |
| `[P:EAP004]` | Link to a principle, opens in the side panel |
| `[HERAM]` | Link to the HERAM concept |
| `[text](concept:fragestallning)` | Explicit concept link |
| ` ```note Title ` … ` ``` ` | Callout box (also `tip`, `warning`, `info`, `important`) |
| `{{diagram:process\|Caption}}` | Inline `src/lib/diagrams/process.svg` with a caption, on its own line |

Concept names in running text are linked automatically, but only the first mention in each `##` section, and never inside headings, links or hyphenated words.

The `**Version X**` line at the top sets the version shown in the site header and the agent guide.

The agent guide reuses two sections by their exact heading: `## Process: Skapa referensarkitektur` and `## Vad ska en referensarkitektur innehålla?`. If you rename them, update `buildAgentGuide()` in the build script.

## Concepts

```yaml
---
id: fragestallning            # same as the file name
title: Frågeställning (Concern)
icon: AlertCircle
category: Intressenter
relationships: [malgrupp, intressenter]   # other concept ids, shown as links
examples: [Säkerhet, Prestanda]
date: 2025-11-13
---

# Frågeställning (Concern)

First paragraph = the definition (used in the agent guide).

## Sections become sub-headings on the HERAM page
```

A new concept must also be added to a group in `src/content/heram.md`. The order there is the order on the HERAM page and in the agent guide. The build warns about concepts that aren't in a group, and puts them under "Övriga begrepp".

To add a concept to the concept map, add a node in `ConceptModelData.ts` whose `id` is the concept id. Clicking the node then goes to its description.

## Governance

```yaml
---
id: RE001
rule: Riktlinjer och regler ska alltid ha en referens till överliggande styrning   # 'principle:' / 'guideline:' for the other types
references: ['EAP001']
status: active              # draft | active | deprecated
---

## Beskrivning
## Motivering
## Referens
```

On the HERAM page, *Beskrivning* is hidden when it only repeats the statement, and *Referens* is replaced by links built from `references`.

## Links and base path

The site can be hosted under a sub-path (`BASE_PATH`). Never write root-relative links like `/heram`:

- In Svelte, use `resolve('/heram')` for pages and `asset('/img/x.svg')` for files in `static/`.
- In Markdown and SVG, use relative links (`heram#styrning`, `mallar/iterationsmall.md`).

## Brand marks

| Mark | Meaning | Colour |
|------|---------|--------|
| HERAF | An "H" of two pillars, Vägledningen and HERAM, joined by the framework | Aubergine + petrol, light grey-violet crossbar |
| Vägledningen | Steps leading to a goal: the process, step by step | Aubergine |
| HERAM | Three linked nodes: the concept map | Petrol |

- In Svelte, use `<BrandMark name="heraf|vagledning|heram" size={24} />` (`src/lib/components/BrandMark.svelte`). The Vägledningen and HERAM marks take `currentColor`, so set the colour with a text class.
- Standalone files for documents and slides are in `static/img/brand/*.svg`.
- The favicon (`src/lib/assets/favicon.svg`) is the HERAF mark on a white tile, so it stays visible on dark browser tabs.

All marks are drawn on a 24×24 grid. If you change one, update the component, the SVG file and the favicon together.
