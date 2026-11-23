---
id: arkitekturprinciper
title: Arkitekturprinciper
icon: Compass
category: Governance
relationships: [styrande-principer, riktlinje, regel, monster, referensarkitektur]
examples: [EAP004 – Garantera det nödvändigaste, P001 – Återanvändbar design utan tekniska detaljer]
date: 2026-11-23
---

# Arkitekturprinciper

Arkitekturprinciper är principer som styr hur arkitektur, och därmed referensarkitekturer, ska utformas. De bygger på lärosätets styrande principer och översätter den övergripande riktningen till vad som gäller för arkitekturarbetet.

## Skillnad mot styrande principer

- **Styrande principer** anger den övergripande riktningen för ett lärosäte eller ett område, till exempel strategiska vägval.
- **Arkitekturprinciper** anger hur arkitekturen ska utformas för att följa den riktningen. De refererar alltid till den styrning de bygger på.

## Roll i referensarkitekturen

- Referensarkitekturen följer arkitekturprinciperna, och principerna styr hur den utformas.
- Arkitekturprinciper ger syfte till riktlinjer och regler. Riktlinjer och regler motiveras i sin tur av en arkitekturprincip.
- Arkitekturprinciper påverkar vilka mönster som väljs. Mönstren gör det enklare att följa principerna.

## Arkitekturprinciper i HERAM

HERAM innehåller två typer av arkitekturprinciper:

- **EAP-principer** (Enterprise Architecture Principles) gäller all arkitekturstyrning, till exempel EAP004 "garantera det nödvändigaste".
- **P-principer** gäller referensarkitekturer, till exempel P001 "återanvändbar design utan att fastna i tekniska detaljer".

En referensarkitektur kan dessutom innehålla egna arkitekturprinciper för sitt område.

## Krav på en arkitekturprincip

- Den har ett spårbart ID (RE003).
- Den har en motivering och en referens till den styrning den bygger på (RE004).
