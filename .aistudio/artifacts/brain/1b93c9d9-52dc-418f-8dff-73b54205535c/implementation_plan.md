# NTP 2029–2040 — Ferske Etatsdata, Åpne Transport-API-er og Tverrsektoriell Innsikt

Utvidelse av NTP 2029–2040-dashboardet med en fullstack datamotor som kombinerer åpne norske sanntids-API-er med verifiserte offisielle nøkkeltall (2024–2026) fra **Statens vegvesen**, **Bane NOR**, **Jernbanedirektoratet**, **Avinor**, **Kystverket** og **Nye Veier** — presentert i en egen tverrsektoriell etatsfane samt oppdaterte tall i alle eksisterende moduler.

### User Review & Critical Decisions

> [!IMPORTANT]
> Nedenfor oppsummeres valgene som ble bekreftet i avklaringsrunden. Disse styrer hvordan ferske tall hentes inn, struktureres og visualiseres.

- **Bekreftet datastrategi**: **Sanntids-API-er kombinert med verifiserte offisielle års- og kvartalstall** — En backend-proxy henter ferske målinger fra åpne offentlige endepunkter (bl.a. Statens vegvesen Trafikkdata GraphQL API / NVDB, Entur / jernbanetrafikk og SSB) og kombinerer disse sømløst med verifiserte 2024–2026-nøkkeltall fra etatenes offisielle statistikker og NTP-grunnlag.
- **Bekreftede etatsindikatorer (alle 5 grupper valgt)**:
  1. **Statens vegvesen (Trafikkdata API, Vegtrafikkindeksen & NVDB)**: Faktiske tellepunkter langs E16/Rv7 (Sokna, Hønefoss, Norderhov, Sollihøgda, Bærum), ÅDT, tungbilandel (%) og Vegtrafikkindeksen (~1 200 kontinuerlige tellepunkter).
  2. **Bane NOR & Jernbanedirektoratet**: Punktlighet persontog (`87,6 %` i 2025 mot mål `90,0 %`), regularitet (`93,7 %`), punktlighet godstog (`74,9 %` mot mål `80,0 %`), antall togreiser (`84,2 mill. reiser`, `+2,7 %`) og godsmengde på bane (`33,5 mill. tonn`).
  3. **Avinor**: Passasjerutvikling totalt (`53,2 mill. passasjerer` over 43 lufthavner) og fordelt på knutepunkter (Oslo lufthavn `27,4 mill.`, Bergen, Trondheim, Stavanger, samt sterk internasjonal vekst ved Tromsø/Nord-Norge), flybevegelser og intermodal tilbringerandel.
  4. **Kystverket (AIS Norge & Kystdatahuset)**: Overvåking fra ~90 landbaserte AIS-basestasjoner og satellitter, utseilt distanse i norsk økonomisk sone, havneanløp og sjømatrelatert kystfrakt langs nordnorske farleder.
  5. **Nye Veier**: Porteføljestyring etter netto nytte per budsjettkrone (NNB), kostnadsreduksjon i utbyggingsporteføljen, reisetidsreduksjon og ferdigstilte motor- og riksvegstrekninger (E6, E18, E39).
- **Bekreftet presentasjonsform**: **Egen fane for tverrsektoriell etatsdata pluss oppdaterte tall i alle eksisterende moduler**.

---

### 1. Overview & Core Concept

- **What It Does**: Løfter dashboardet fra en ren dokumentvisualisering til et operativt kunnskapsgrunnlag for NTP 2029–2040 der brukeren kan hente ferske trafikk- og transporttall på tvers av alle seks transportvirksomheter, se kilde- og oppdateringsstatus per datasett, og sammenligne nøkkeltall mellom veg, bane, luftfart og sjøfart.
- **Target Audience / Persona**: Faganalytikere, etatsledere og NTP-sekretariatet som trenger oppdaterte, etterprøvbare tall fra alle seks virksomheter på ett sted.
- **Key Value**: Kombinerer sanntidsdata fra åpne norske transport-API-er med kvalitetssikrede offisielle nøkkeltall, slik at dashboardet alltid leverer ferske og pålitelige tall.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Ny hovedfane: «Etatsdata og nøkkeltall (6 virksomheter)»**:
     - Øverst vises en **Tverrsektoriell Nøkkeltallsmatrise** for de 6 virksomhetene med siste verifiserte tall og kildeindikator (Sanntids-API / Offisiell års- og kvartalsstatistikk), samt en **«Oppdater sanntidsdata»**-knapp som henter ferske tellepunkt- og avgangsdata via server-endepunktet.
     - Brukeren kan velge én spesifikk virksomhet (**Statens vegvesen**, **Bane NOR**, **Jernbanedirektoratet**, **Avinor**, **Kystverket**, **Nye Veier**) eller se alle samlet:
       - **Statens vegvesen**: Live/ferske trafikktall fra registreringspunkter langs E16 og Rv7 (ÅDT, tungbilandel i %, timestrafikk) + Vegtrafikkindeksen per region.
       - **Bane NOR & Jernbanedirektoratet**: Interaktiv graf for punktlighet (`86,1 % → 87,6 %` mot mål `90,0 %`), regularitet (`93,7 %`), godstogpunktlighet (`74,9 %`), passasservekst (`84,2 mill. reiser`) og godsvolum (`33,5 mill. tonn`) fordelt på jernbanekorridorer (bl.a. Ofotbanen, Bergensbanen, Dovrebanen, Sørlandsbanen og Østfoldbanen).
       - **Avinor**: Trafikkutvikling på tvers av hovedlufthavner og regionale kortbanelufthavner (`53,2 mill. passasjerer`), utenlandsandel, punktlighet og flyfrakt av sjømat.
       - **Kystverket**: AIS-trafikkbilde langs kysten, utseilt distanse per fartøyskategori (brønnbåt/fiskefartøy, lasteskip, passasjer/ferge, offshore) og farledsutbedringer for sjømatkorridorene.
       - **Nye Veier**: Porteføljematrise sortert etter samfunnsøkonomisk lønnsomhet (NNB — netto nytte per budsjettkrone), utbyggingskostnad, innspart reisetid og klimagassreduksjon i anleggsfasen.
  2. **Oppdaterte tall i de 4 eksisterende modulene**:
     - **Strategisk oversikt**: Oppdatert med verifiserte referansetall fra alle 6 virksomheter i KPI-kortene og før/etter-effekttabellen.
     - **E16 / Rv7 Inrix-analyse**: Knyttet direkte til Statens vegvesens offisielle trafikktellepunkter langs E16/Rv7 (Sokna, Hønefoss, Norderhov, Sundvollen, Sollihøgda, Bærum) med tungbilandel og mulighet til å lese inn siste målte ÅDT/timestrafikk.
     - **Mobilitet 360 og sjømat**: Beriket med Jernbanedirektoratets kollektiv-/togtall, Kystverkets AIS-baserte kystfrakt og Avinors lufthavnknutepunkter i Nord-Norge.

- **Visual Identity & Theme**:
  - Viderefører den **lyse, nordiske offentlige profilen** (`#F8FAFC` lerret, `#FFFFFF` analyseflater, `1px` `border-slate-200`, `Plus Jakarta Sans` overskrifter, `Public Sans` brødtekst og `JetBrains Mono` `tabular-nums` for alle tall).
  - Toppnavigasjonen følger den strenge 3-soners kontrakten med 5 presise enkelradslenker (`Strategisk oversikt`, `Etatsdata (6 etater)`, `E16 / Rv7 Inrix`, `Mobilitet 360 og sjømat`, `Plattform og veikart`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hybrid dataarkitektur med Express-proxy mot åpne API-er + verifisert referansedatabase**
  - *Chosen Approach*: Vi oppretter en Express-basert `server.ts` med et `/api/ntp-live-data`-endepunkt som spør åpne norske API-er (Statens vegvesen Trafikkdata GraphQL API / NVDB v4 og Entur GraphQL API for jernbane/kollektiv) med kort tidsavbrudd (`timeout`) og mellomlagring (`cache`), kombinert med verifiserte offisielle 2024–2026-datasett for alle 6 virksomheter.
  - *Why*: Offentlige API-er dekker ikke alle strategiske NTP-indikatorer (som Nye Veiers NNB-portefølje eller helårs nasjonal godstonnasje) i ett og samme endepunkt, og enkelte nettverkskall kan variere i responstid. Hybridmodellen garanterer at brukeren får ekte API-tall der de er tilgjengelige og 100 % verifiserte offisielle etatsrapporter (2024–2026) uten tomme feilflater.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     NTP 2029–2040 FULLSTACK APPLIKASJON                      │
├──────────────────────────────────────────────────────────────────────────────┤
│  Toppnavigasjon (3-soners kontrakt)                                          │
│  [NTP 2029–2040 Datadashboard] ── [5 Fagfaner] ── [Kildedokument og CSV]     │
├──────────────────────────────────────────────────────────────────────────────┤
│  Klient-moduler (React + TypeScript)                                         │
│  ┌────────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │ 1. Strategisk Oversikt │  │ 2. NY: Etatsdata & Sanntid (6 virksomheter)│  │
│  │    & Effektmåling      │  │    - SVV Trafikkdata & NVDB (E16/Rv7 ÅDT)  │  │
│  ├────────────────────────┤  │    - Bane NOR & Jdir (87,6% punktl., 84,2M)│  │
│  │ 3. E16/Rv7 Inrix       │  │    - Avinor (53,2M pass., knutepunkter)    │  │
│  │    (Enkelt + A mot B)  │  │    - Kystverket (AIS 90 st., kystkorridor) │  │
│  ├────────────────────────┤  │    - Nye Veier (NNB-portefølje, kostnad)   │  │
│  │ 4. Mobilitet 360 &     │  └────────────────────────────────────────────┘  │
│  │    Sjømatkorridorer    │  ┌────────────────────────────────────────────┐  │
│  │                        │  │ 5. Plattformarkitektur (SAGA SKY & ArcGIS) │  │
│  └────────────────────────┘  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│  Server-side API Proxy (Express /api/ntp-live-data)                          │
│  ├── Statens vegvesen Trafikkdata GraphQL / NVDB v4 API (E16/Rv7 tellepunkt) │
│  ├── Entur National GraphQL API (Sanntids tog-/knutepunktstatus Oslo/Hønefoss│
│  └── Verifisert 2024–2026 Referansedatabase (SVV, Bane NOR, Jdir, Avinor,    │
│      Kystverket, Nye Veier) med kilde- og tidsstempel                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **Tverrsektoriell Etatsmodell**: Strukturert profil for hver av de 6 virksomhetene med verifiserte hovedindikatorer for 2024, 2025 og 2026-status, målsettinger, korridortabeller og kildehenvisninger.
  - **Live API Telemetry State**: Henter ferske målinger ved oppstart og når brukeren klikker *«Oppdater ferske tall»*, viser nøyaktig tidsstempel og kildestatus per etat, og lar brukeren eksportere alle etatsdata til CSV.
