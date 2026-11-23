
## Processen

- Avstämningar med målgrupp
  - NEJ, bör vara för REFERENSGRUPP, man ska dvs. sätta upp/beskriva referensgrupp
- Dokumentation för underlag
  - Målgrupp, referensgrupp, intressenter, deras concerns osv. är inget som står med i slutgiltiga referensarkitekturen. Därmed bör man beskriva att man bör sätta upp dokumentyta för dessa underlag.
- Förtydliga att MÅLGRUPPEN bör identifieras FÖRST, och deras CONCERNS är det viktiga för att kunna avgöra OMFÅNGET.
  - Eftersom den ska vara användbar för målgruppen behöver man identifiera och välja ut vilka concerns man ska adressera, dessa blir i sin tur själva omfånget för iterationen.


## Förtydliga
"Identifiera och förankra med målgrupp" - Det är inte tydligt att man ska börja med denna aktivitet. Förtydliga även att man ska välja EN målgrupp och inte alla olika i detta skede. Vilken är en viktig målgrupp JUST NU?
Omfång - Otydligt att man ska styra omfånget utifrån målgruppen. Omfånget riskerar annars att täcka in saker som ej är relevant för målgruppen för den nuvarande iterationen man gör.
Fixa

- Länka till begreppet "concern" eller "angelägenhet"
- Är begreppet korrekt? "Frågeställning"?


---- Reference Group ----
Här kommer lite feedback från mig

Jag vill börja med att säga – BRA JOBBAT - det är väldigt snyggt och genomtänkt paketerat.

Särskilt positivt upplever jag den tydliga uppdelningen mellan HERAF (ramverk & vägledning) och HERAM (modell & begrepp), kombinationen av ISO 42010-tänk med ett mer pedagogiskt och interaktivt upplägg och att att ramverket håller en konsekvent linje kring vad referensarkitektur är!


Nedan följer några reflektioner och förbättringsförslag inför en kommande 1.0-version.


1. Bakgrund i vägledningen –-> skriv för framtida läsare

I nuläget beskriver bakgrunden främst varför projektet HERAF startade.
Jag tror vägledningen skulle vinna på att skriva bakgrunden mer som om den läses om 2–3 år, dvs:

varför HERAF finns och behövs över tid
vilken roll ramverket har oberoende av det ursprungliga initiativet

2. Avsnittet ”Skapa referensarkitektur” –-> gör processen explicit

Avsnittet beskriver i praktiken en process, men detta framgår inte helt tydligt i rubrik eller inledning.

Förslag:

ändra rubriken till ”Process: Skapa referensarkitektur”, eller
justera första meningen till exempelvis:
”Processen ‘Skapa referensarkitektur’ är framtagen för att kvalitetssäkra arbetet…”
 

3. Concern / Angelägenhet –-> terminologi och begriplighet

Jag förstår och respekterar kopplingen till ISO 42010, men upplever att översättningen Angelägenhet kan vara språkligt svår i praktiken.
Vet inte om något verkligen är bättre än detta – och jag misstänker ni pratat en hel del om detta begrepp.

Ett möjligt alternativ är att använda ”Arkitekturell fråga (Concern)” i löptext, exempelvis:

En arkitekturell fråga beskriver ett intresse, behov eller förhållande som är viktigt för en eller flera intressenter och som påverkar hur en lösning eller dess arkitektur bör utformas. Arkitekturella frågor kan avse verksamhet, kvalitet, teknik, säkerhet, juridik eller förvaltning och används för att styra vilka arkitekturvyer som behöver tas fram.


4. Användningen av ordet ”system” i HERAM

I flera avsnitt (t.ex. Typer av angelägenheter, Arkitekturperspektiv och Aspekter) används ordet system.

Detta att dra läsaren mot en för konkret och lösningsnära nivå. Jag tror det vore tydligare att konsekvent använda exempelvis lösning, lösningstyp eller arkitekturområde


5. Målgruppsperspektiv –-> förtydliga praktisk nytta av referensarkitekturen

Avsnittet om målgruppsperspektiv är i grunden bra och relevant, men jag upplever att det i nuläget finns en viss risk för feltolkning kring vad som faktiskt ingår i en referensarkitektur, kontra vad referensarkitekturen är tänkt att stödja och möjliggöra.

När exempel på målgruppers behov listas (t.ex. implementationsguider, kodexempel, API-specifikationer, detaljerade tekniska specifikationer) kan det uppfattas som att detta är sådant som kommer att finnas i referensarkitekturen. Min tolkning är dock att de flesta av dessa artefakter normalt inte ingår i själva referensarkitekturen, utan snarare tas fram senare – med stöd av referensarkitekturen – i lösningsarkitektur, design och implementation.


Jag tror därför att avsnittet skulle vinna på att ännu tydligare beskriva hur olika målgrupper drar praktisk nytta av referensarkitekturen, snarare än att uppfattas som en lista över leverabler som referensarkitekturen förväntas innehålla.


Ett möjligt förtydligande skulle kunna vara att betona att referensarkitekturen tillhandahåller principer, strukturer, begrepp, mönster och arkitekturvyer, samt tydliggöra att dessa används som grund och stöd för att målgrupperna senare ska kunna ta fram exempelvis implementationsguider, teknisk design, API-specifikationer och kod?


Man skulle kunna byta fokus från “Behov” till “Nytta av referensarkitekturen” per målgrupp, och/eller lägga in en kort förklarande text före målgruppsexemplen som tydliggör denna distinktion

 

Man skulle tex kunna ändra till ett format som det här:


IT-arkitekter

Nytta av referensarkitekturen:
Referensarkitekturen ger IT-arkitekter en gemensam grund för arkitektoniska beslut genom principer, mönster och arkitekturvyer. Den används som stöd vid framtagning av lösningsarkitektur och teknisk design och bidrar till konsekventa val över projekt och organisationer.

Exempel på relevanta vyer:
Översiktliga arkitekturvyer, logiska vyer, integrations- och strukturvyer.




6. Vad ska faktiskt tas fram i en referensarkitektur?

En fråga som väcks är vilka delar i HERAM som faktiskt ska realiseras som artefakter i en referensarkitektur enligt HERAF.

Jag tror ramverket skulle vinna på att tydligare beskriva en miniminivå för en referensarkitektur, samt vilka delar som är valbara eller kontextberoende tillägg

7. Konceptbeskrivningar och konceptkarta – meta-nivån

I HERAM-delen hade jag även uppskattat:

en kort introduktion som förklarar vad konceptbeskrivningarna är till för
eventuellt en kort motivering till ordningen på konceptbeskrivningarna