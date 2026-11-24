---
id: fragestallning
title: Frågeställning (Concern)
icon: AlertCircle
category: Intressenter
relationships: [intressenter, malgrupp, arkitekturperspektiv]
examples: [Säkerhet, Prestanda, Användbarhet, Kostnadseffektivitet]
date: 2025-11-13
---

# Frågeställning (Concern)

En frågeställning beskriver vad en intressent eller målgrupp anser vara viktigt i en lösning eller en arkitektur. Det kan vara mål, behov, krav eller frågor som påverkar hur något ska utformas eller fungera.

## Definition enligt ISO 42010

Enligt standarden ISO 42010:2022 är en "concern" ett intresse som är av betydelse för en eller flera intressenter i relation till ett system och dess arkitektur. I HERAF motsvarar det lösningen eller området som referensarkitekturen gäller.

I HERAF översätts *concern* med **frågeställning**.

## Ett arbetsverktyg

Frågeställningarna används för att säkerställa att referensarkitekturen innehåller de vyer, principer och regler som målgruppen behöver. De ingår inte i den färdiga referensarkitekturen, men sparas som underlag så att det går att spåra varför referensarkitekturen ser ut som den gör.

## Typer av frågeställningar

### Funktionella frågeställningar
- **Användbarhet**: Hur lätt är lösningen att använda?
- **Prestanda**: Uppfyller lösningen prestandakrav?
- **Funktionalitet**: Ger lösningen rätt funktioner?

### Kvalitetsaspekter
- **Säkerhet**: Är lösningen säker mot hot?
- **Tillförlitlighet**: Fungerar lösningen konsekvent?
- **Skalbarhet**: Kan lösningen hantera ökad belastning?

### Verksamhetsfrågeställningar
- **Kostnadseffektivitet**: Ger lösningen värde för pengarna?
- **Time-to-market**: Hur snabbt kan lösningen levereras?
- **Compliance**: Följer lösningen regelverk?

## Relation till arkitekturvyer

Frågeställningar driver utformningen av arkitekturvyer:
- Varje vy adresserar specifika frågeställningar
- Vyernas innehåll och struktur anpassas för att besvara frågeställningarna
- Olika intressenter har olika frågeställningar som kräver olika vyer

## Identifiering av frågeställningar

### Workshop-metoder
- Intressentanalys
- Kartläggning av frågeställningar
- Riskanalyser

### Strukturerade intervjuer
- Målgruppspecifika frågor
- Prioritering av frågeställningar
- Konfliktidentifiering

## Hantering av konflikter
Olika intressenters frågeställningar kan vara motstridiga och kräver:
- **Prioritering** baserad på värde för verksamheten
- **Kompromisser** mellan konkurrerande frågeställningar
- **Tydlig kommunikation** om designbeslut