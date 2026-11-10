export type AgencyId = 'alle' | 'svv' | 'banenor' | 'jdir' | 'avinor' | 'kystverket' | 'nyeveier';
export type PhaseId = 'alle' | 'idag' | 'mellomfase' | 'langsikt';

export interface AgencyInfo {
  id: AgencyId;
  name: string;
  shortName: string;
  role: string;
  primaryDataSources: string[];
}

export const NTP_AGENCIES: AgencyInfo[] = [
  {
    id: 'alle',
    name: 'Alle NTP-virksomheter',
    shortName: 'Felles NTP',
    role: 'Tverrsektorielt kunnskapsgrunnlag for Nasjonal transportplan 2029–2040',
    primaryDataSources: ['Effekt', 'Cube', 'ArcGIS', 'Inrix', 'RVU', 'RTM / NTM', 'SAGA SKY'],
  },
  {
    id: 'svv',
    name: 'Statens vegvesen',
    shortName: 'Statens vegvesen',
    role: 'Veginfrastruktur, Inrix sanntidsdata, trafikktellepunkter, Mobilitet 360 og SAGA SKY',
    primaryDataSources: ['Inrix Roadway Analytics', 'Trafikktellepunkter', 'SAGA SKY', 'ArcGIS', 'Effekt'],
  },
  {
    id: 'banenor',
    name: 'Bane NOR',
    shortName: 'Bane NOR',
    role: 'Jernbaneinfrastruktur, punktlighet, kapasitetsutnyttelse og godskorridorer på bane',
    primaryDataSources: ['TIOS / Punktlighetsdata', 'Kapasitetsmodeller', 'ArcGIS', 'Godsmodellen'],
  },
  {
    id: 'jdir',
    name: 'Jernbanedirektoratet',
    shortName: 'Jernbanedirektoratet',
    role: 'Strategisk jernbaneplanlegging, byvekstavtaler, kollektivtellinger og RTM/NTM',
    primaryDataSources: ['RTM / NTM', 'RVU', 'Kollektivtelling', 'Cube'],
  },
  {
    id: 'avinor',
    name: 'Avinor',
    shortName: 'Avinor',
    role: 'Luftfart, tilbringertjenester, regionale reisekjeder og intermodale knutepunkter',
    primaryDataSources: ['Passasjer- og flydata', 'NTM', 'RVU', 'Tilbringeranalyser'],
  },
  {
    id: 'kystverket',
    name: 'Kystverket',
    shortName: 'Kystverket',
    role: 'Farleder, havner, AIS-posisjonsdata og sjømat-/godsstrømmer langs kysten',
    primaryDataSources: ['AIS Posisjonsdata', 'Godsmodellen', 'Havnestatistikk', 'ArcGIS'],
  },
  {
    id: 'nyeveier',
    name: 'Nye Veier',
    shortName: 'Nye Veier',
    role: 'Utbyggingsstrekninger, samfunnsøkonomisk porteføljeprioritering og effektmåling',
    primaryDataSources: ['Inrix', 'Effekt', 'Byggherre- og punktskydata', 'ArcGIS'],
  },
];

export interface StrategicDriver {
  id: string;
  number: string;
  title: string;
  summary: string;
  pdfQuote: string;
  beforeState: string;
  targetState: string;
  keyMetricsLabel: string;
  keyMetricsValue: string;
  relatedTools: string[];
  agencies: AgencyId[];
  pdfPage: number;
}

export const STRATEGIC_DRIVERS: StrategicDriver[] = [
  {
    id: 'prioriteringer',
    number: '01',
    title: 'Bedre prioriteringer',
    summary: 'Sammenligning av behov og tiltak på tvers av transportformer og geografi.',
    pdfQuote: 'Mer systematisk bruk av data gjør det lettere å sammenligne behov og tiltak på tvers av transportformer og geografi.',
    beforeState: 'Silo-baserte analyser per transportform',
    targetState: 'Tverrsektoriell rangering med felles datagrunnlag',
    keyMetricsLabel: 'Transportvirksomheter koblet',
    keyMetricsValue: '6 etater',
    relatedTools: ['Effekt', 'Cube', 'ArcGIS', 'SAGA SKY'],
    agencies: ['svv', 'banenor', 'jdir', 'avinor', 'kystverket', 'nyeveier'],
    pdfPage: 2,
  },
  {
    id: 'kontinuerlig-innsikt',
    number: '02',
    title: 'Fra prognoser til kontinuerlig innsikt',
    summary: 'Løpende oppfølging av faktisk trafikkutvikling fremfor kun statiske framskrivninger.',
    pdfQuote: 'NTP bygger mye på langsiktige framskrivninger. Nye data kan brukes til å følge faktisk utvikling og oppdatere kunnskapsgrunnlaget oftere.',
    beforeState: 'Revisjon hvert 4. år ved ny NTP-rullering',
    targetState: 'Løpende oppdatering med dynamiske sensordata',
    keyMetricsLabel: 'Oppdateringsfrekvens',
    keyMetricsValue: 'Kontinuerlig / Døgn',
    relatedTools: ['Inrix', 'Trafikktellepunkter', 'RVU', 'Mobilitet 360'],
    agencies: ['svv', 'jdir', 'banenor', 'nyeveier'],
    pdfPage: 2,
  },
  {
    id: 'usikkerhet',
    number: '03',
    title: 'Bedre håndtering av usikkerhet',
    summary: 'Tidlig varsling når befolkning, økonomi, teknologi eller klima avviker fra prognosene.',
    pdfQuote: 'Befolkning, økonomi, teknologi, klima og transportetterspørsel kan utvikle seg annerledes enn forventet. Data gjør det mulig å oppdage slike endringer tidligere.',
    beforeState: 'Statiske følsomhetsanalyser på gamle basisår',
    targetState: 'Tidlig deteksjon av trendbrudd i etterspørsel',
    keyMetricsLabel: 'Overvåkede drivere',
    keyMetricsValue: '5 faktorer',
    relatedTools: ['RTM / NTM', 'RVU', 'Mobilitet 360', 'AIS / Inrix'],
    agencies: ['svv', 'jdir', 'avinor', 'kystverket'],
    pdfPage: 2,
  },
  {
    id: 'transportmodeller',
    number: '04',
    title: 'Bedre transportmodeller',
    summary: 'Kalibrering og validering av regionale, nasjonale og godsmodeller med reelle observasjoner.',
    pdfQuote: 'Reise-, trafikk-, gods-, mobilitets- og posisjonsdata kan brukes til kalibrering og validering av RTM, NTM og godsmodellene.',
    beforeState: 'Modeller kalibrert på eldre utvalgsundersøkelser',
    targetState: 'Kontinuerlig validering mot tellepunkter og posisjonsdata',
    keyMetricsLabel: 'Modellfamilier støttet',
    keyMetricsValue: 'RTM · NTM · Gods',
    relatedTools: ['Cube', 'RTM', 'NTM', 'Godsmodellen', 'RVU'],
    agencies: ['svv', 'jdir', 'banenor', 'avinor', 'kystverket'],
    pdfPage: 2,
  },
  {
    id: 'effektmaling',
    number: '05',
    title: 'Bedre effektmåling',
    summary: 'Etterprøving av faktisk effekt etter gjennomførte tiltak for læring til neste prioritering.',
    pdfQuote: 'Vi kan i større grad undersøke hva som faktisk skjedde etter at et tiltak ble gjennomført, og bruke erfaringene i neste prioritering.',
    beforeState: 'Få systematiske før-/etteranalyser av reisetid',
    targetState: 'Faktisk målt reisetid, kø og overført trafikk',
    keyMetricsLabel: 'Før/etter-verifisering',
    keyMetricsValue: '100 % sporbarhet',
    relatedTools: ['Effekt', 'Inrix', 'Trafikktellepunkter', 'ArcGIS'],
    agencies: ['svv', 'nyeveier', 'banenor', 'jdir'],
    pdfPage: 2,
  },
  {
    id: 'eksisterende-infrastruktur',
    number: '06',
    title: 'Mer effektiv bruk av eksisterende infrastruktur',
    summary: 'Målrettet drift og mindre tiltak som høyverdig alternativ til tunge nyinvesteringer.',
    pdfQuote: 'Data om kapasitet, regularitet, kø, reisetid og sårbarhet kan synliggjøre hvor bedre drift eller mindre tiltak kan være et alternativ til store investeringer.',
    beforeState: 'Store utbyggingsprosjekter som standardløsning',
    targetState: 'Presis flaskehalsutbedring basert på kø- og sårbarhetsdata',
    keyMetricsLabel: 'Pilotstrekning E16/Rv7',
    keyMetricsValue: '57,2 km',
    relatedTools: ['Inrix', 'ArcGIS', 'Effekt', 'SAGA SKY'],
    agencies: ['svv', 'banenor', 'kystverket', 'nyeveier'],
    pdfPage: 2,
  },
  {
    id: 'transparens',
    number: '07',
    title: 'Mer transparent NTP',
    summary: 'Åpen og etterprøvbar kobling mellom identifisert problem, anbefalt tiltak og forventet effekt.',
    pdfQuote: 'Det blir lettere å vise hvorfor et problem prioriteres, hvorfor et tiltak anbefales og hvilken effekt tiltaket forventes å ha.',
    beforeState: 'Komplekse utredninger med lav tilgjengelighet',
    targetState: 'Visuell og datadrevet begrunnelse for prioriteringer',
    keyMetricsLabel: 'Dokumentasjonsportal',
    keyMetricsValue: 'ntpmetode.no',
    relatedTools: ['ArcGIS', 'Effekt', 'Åpne ad-hoc verktøy'],
    agencies: ['svv', 'banenor', 'jdir', 'avinor', 'kystverket', 'nyeveier'],
    pdfPage: 2,
  },
];

export interface NtpNeedItem {
  id: string;
  category: string;
  description: string;
  currentTools: string;
  futureDirection: string;
  phase: PhaseId;
  pdfPage: number;
}

export const NTP_NEEDS_AND_TOOLS: NtpNeedItem[] = [
  {
    id: 'samfunnsokonomi',
    category: 'Transport- og samfunnsøkonomiske analyser',
    description: 'Grunnlag for nytte-kostnadsanalyser, prissatte konsekvenser og nettverksberegninger.',
    currentTools: 'Effekt, Cube, RTM, NTM, Godsmodellen',
    futureDirection: 'Tettere kobling mot dynamiske reisetids- og posisjonsdata for kalibrering.',
    phase: 'idag',
    pdfPage: 3,
  },
  {
    id: 'kartanalyse',
    category: 'Kartanalyse og geografisk visualisering',
    description: 'Romlig sammenstilling av strekninger, flaskehalser, sårbarhet og godskorridorer.',
    currentTools: 'ArcGIS Enterprise / Online / Pro',
    futureDirection: 'Direkte integrasjon mellom SAGA SKY og ArcGIS (GeoAnalytics Engine, Pipelines, Parquet).',
    phase: 'mellomfase',
    pdfPage: 3,
  },
  {
    id: 'sanntidsdata',
    category: 'Nye datakilder og sanntidsdata',
    description: 'Kontinuerlig innhenting av reisetid, kødannelse, mikromobilitet og flyt på strekninger.',
    currentTools: 'Inrix Roadway Analytics, Trafikktellepunkter, AIS',
    futureDirection: 'Automatisert innlesing i dataplattform for ad-hoc analyser på tvers av etater.',
    phase: 'idag',
    pdfPage: 3,
  },
  {
    id: 'datalagring',
    category: 'Datalagring, styring og deling',
    description: 'Strukturert lagring, tilgangsstyring, databeskrivelser, verdivurdering, ROS og DPIA.',
    currentTools: 'Eroom (i dag) · Midlertidig løsning i Sky / M-files / ArcGIS (mellomfase)',
    futureDirection: 'SAGA SKY med full delingskapabilitet og etablerte Data Governance (DG)-prosesser.',
    phase: 'langsikt',
    pdfPage: 3,
  },
  {
    id: 'adhoc-verktøy',
    category: 'Ad-hoc analyser, innsikt og fleksible verktøy',
    description: 'Fleksible analysemiljøer for å utforske nye problemstillinger raskt i NTP-arbeidet.',
    currentTools: 'ArcGIS for kjente behov, regneark, enkeltstående skript',
    futureDirection: 'Åpne og fleksible verktøy koblet mot skybasert lagring og spørringslag.',
    phase: 'mellomfase',
    pdfPage: 3,
  },
];

// Page 5: E16 / Rv7 Sokna - Sollihøgda / Skaret (57.2 km) Inrix Congestion Scan (31/08/2026 - 25/09/2026)
export interface CorridorSegment {
  km: number;
  label: string;
  municipality: string;
  road: 'Rv7' | 'E16/Rv7' | 'E16';
  isBottleneck: boolean;
  // 24 hours (00 to 23) congestion percentage (0 to 110%)
  // Authentic reconstruction of the Page 5 Inrix heatmap (green/blue 0-20% baseline, intense red/yellow cluster km 21-42 between hours 11-19)
  hourlyCongestionSouthbound: number[];
  hourlyCongestionNorthbound: number[];
  avgSpeedKmh: number;
  freeFlowSpeedKmh: number;
  aadt: number; // ÅDT
}

export const E16_RV7_SEGMENTS: CorridorSegment[] = [
  {
    km: 0.0,
    label: 'Sokna sentrum (Rv7)',
    municipality: 'Ringerike',
    road: 'Rv7',
    isBottleneck: false,
    hourlyCongestionSouthbound: [2, 1, 1, 2, 3, 6, 12, 18, 15, 14, 16, 18, 20, 22, 24, 26, 22, 16, 12, 8, 5, 4, 3, 2],
    hourlyCongestionNorthbound: [2, 1, 1, 2, 4, 7, 10, 14, 15, 18, 22, 25, 28, 30, 34, 38, 32, 24, 15, 10, 6, 4, 3, 2],
    avgSpeedKmh: 76,
    freeFlowSpeedKmh: 80,
    aadt: 6400,
  },
  {
    km: 6.0,
    label: 'Ramsrud – Veme',
    municipality: 'Ringerike',
    road: 'Rv7',
    isBottleneck: false,
    hourlyCongestionSouthbound: [2, 1, 1, 2, 4, 8, 15, 22, 18, 16, 18, 21, 24, 25, 28, 30, 26, 19, 14, 9, 6, 4, 3, 2],
    hourlyCongestionNorthbound: [2, 1, 1, 2, 4, 8, 12, 16, 16, 19, 24, 26, 28, 32, 36, 40, 35, 25, 16, 11, 7, 5, 3, 2],
    avgSpeedKmh: 74,
    freeFlowSpeedKmh: 80,
    aadt: 7100,
  },
  {
    km: 12.0,
    label: 'Veme – Heradsbygda',
    municipality: 'Ringerike',
    road: 'Rv7',
    isBottleneck: false,
    hourlyCongestionSouthbound: [3, 2, 1, 2, 5, 10, 18, 26, 22, 20, 22, 25, 28, 30, 34, 36, 30, 22, 15, 10, 7, 5, 4, 3],
    hourlyCongestionNorthbound: [2, 1, 1, 3, 5, 9, 14, 19, 20, 22, 26, 30, 33, 36, 42, 46, 38, 28, 18, 12, 8, 5, 4, 2],
    avgSpeedKmh: 69,
    freeFlowSpeedKmh: 80,
    aadt: 8900,
  },
  {
    km: 18.0,
    label: 'Heradsbygda – Veienmoen',
    municipality: 'Ringerike',
    road: 'Rv7',
    isBottleneck: false,
    hourlyCongestionSouthbound: [3, 2, 2, 3, 6, 14, 25, 35, 28, 26, 30, 38, 42, 46, 52, 55, 46, 32, 20, 14, 9, 6, 4, 3],
    hourlyCongestionNorthbound: [3, 2, 2, 3, 6, 12, 18, 25, 24, 28, 34, 40, 44, 48, 56, 62, 52, 36, 22, 15, 10, 6, 4, 3],
    avgSpeedKmh: 62,
    freeFlowSpeedKmh: 70,
    aadt: 12400,
  },
  {
    km: 21.0,
    label: 'Hønefoss Nord / E16 innfartsåre',
    municipality: 'Ringerike',
    road: 'E16/Rv7',
    isBottleneck: true,
    hourlyCongestionSouthbound: [4, 2, 2, 4, 8, 18, 32, 45, 38, 36, 48, 62, 72, 78, 84, 86, 75, 52, 32, 18, 11, 8, 5, 4],
    hourlyCongestionNorthbound: [3, 2, 2, 4, 7, 15, 24, 34, 32, 38, 46, 55, 64, 70, 82, 88, 78, 54, 30, 18, 12, 8, 5, 3],
    avgSpeedKmh: 44,
    freeFlowSpeedKmh: 70,
    aadt: 18600,
  },
  {
    km: 24.0,
    label: 'Kryss E16 / Rv7 Hønefoss sør',
    municipality: 'Ringerike',
    road: 'E16/Rv7',
    isBottleneck: true,
    hourlyCongestionSouthbound: [4, 3, 2, 4, 9, 20, 38, 54, 45, 48, 68, 84, 94, 98, 102, 104, 92, 68, 42, 24, 14, 9, 6, 4],
    hourlyCongestionNorthbound: [4, 2, 2, 4, 8, 16, 28, 40, 38, 45, 58, 72, 82, 88, 96, 102, 88, 62, 36, 22, 14, 9, 6, 4],
    avgSpeedKmh: 34,
    freeFlowSpeedKmh: 70,
    aadt: 22400,
  },
  {
    km: 27.0,
    label: 'Norderhov – Hesselberg (E16)',
    municipality: 'Ringerike',
    road: 'E16',
    isBottleneck: true,
    hourlyCongestionSouthbound: [5, 3, 2, 4, 10, 22, 42, 58, 48, 52, 74, 88, 96, 100, 105, 106, 95, 74, 48, 28, 15, 10, 6, 5],
    hourlyCongestionNorthbound: [4, 3, 2, 4, 8, 18, 30, 42, 40, 46, 60, 74, 84, 90, 98, 100, 86, 60, 35, 20, 13, 8, 5, 4],
    avgSpeedKmh: 36,
    freeFlowSpeedKmh: 80,
    aadt: 21800,
  },
  {
    km: 30.0,
    label: 'Steinsletta – Vik i Hole',
    municipality: 'Hole',
    road: 'E16',
    isBottleneck: true,
    hourlyCongestionSouthbound: [4, 3, 2, 4, 9, 20, 38, 52, 44, 46, 65, 82, 92, 98, 104, 108, 98, 82, 55, 32, 16, 10, 6, 4],
    hourlyCongestionNorthbound: [4, 2, 2, 4, 7, 16, 26, 38, 36, 42, 54, 68, 78, 86, 94, 96, 82, 58, 34, 19, 12, 8, 5, 4],
    avgSpeedKmh: 38,
    freeFlowSpeedKmh: 80,
    aadt: 20900,
  },
  {
    km: 33.0,
    label: 'Kroksund – Sundvollen (Tyrifjorden)',
    municipality: 'Hole',
    road: 'E16',
    isBottleneck: true,
    hourlyCongestionSouthbound: [4, 2, 2, 4, 8, 18, 35, 48, 40, 42, 58, 76, 88, 95, 102, 105, 96, 84, 58, 34, 18, 11, 6, 4],
    hourlyCongestionNorthbound: [3, 2, 2, 3, 7, 14, 24, 35, 34, 40, 52, 65, 76, 84, 92, 95, 80, 56, 32, 18, 11, 7, 5, 3],
    avgSpeedKmh: 39,
    freeFlowSpeedKmh: 70,
    aadt: 19800,
  },
  {
    km: 36.0,
    label: 'Sundvollen – Nestunnelen',
    municipality: 'Hole',
    road: 'E16',
    isBottleneck: true,
    hourlyCongestionSouthbound: [3, 2, 2, 3, 7, 16, 32, 44, 36, 38, 52, 70, 84, 92, 98, 102, 94, 80, 54, 30, 16, 10, 6, 3],
    hourlyCongestionNorthbound: [3, 2, 2, 3, 6, 13, 22, 32, 30, 36, 48, 60, 70, 78, 86, 90, 76, 52, 30, 16, 10, 7, 4, 3],
    avgSpeedKmh: 43,
    freeFlowSpeedKmh: 80,
    aadt: 19200,
  },
  {
    km: 39.0,
    label: 'Nes – Skaret oppstigning',
    municipality: 'Hole',
    road: 'E16',
    isBottleneck: true,
    hourlyCongestionSouthbound: [3, 2, 2, 3, 7, 15, 28, 40, 32, 34, 45, 60, 72, 82, 90, 94, 86, 72, 48, 26, 14, 9, 5, 3],
    hourlyCongestionNorthbound: [3, 2, 1, 3, 6, 12, 20, 28, 28, 32, 42, 52, 62, 70, 78, 82, 68, 46, 26, 15, 9, 6, 4, 3],
    avgSpeedKmh: 49,
    freeFlowSpeedKmh: 80,
    aadt: 18700,
  },
  {
    km: 42.0,
    label: 'Sollihøgda vest',
    municipality: 'Hole',
    road: 'E16',
    isBottleneck: false,
    hourlyCongestionSouthbound: [3, 2, 1, 3, 6, 14, 26, 36, 28, 28, 34, 42, 52, 62, 70, 74, 66, 52, 34, 20, 12, 8, 5, 3],
    hourlyCongestionNorthbound: [2, 2, 1, 2, 5, 10, 18, 25, 24, 28, 34, 42, 48, 55, 64, 68, 56, 38, 22, 14, 8, 5, 4, 2],
    avgSpeedKmh: 58,
    freeFlowSpeedKmh: 80,
    aadt: 18400,
  },
  {
    km: 45.0,
    label: 'Sollihøgda – Skaret kryss',
    municipality: 'Hole / Bærum',
    road: 'E16',
    isBottleneck: false,
    hourlyCongestionSouthbound: [2, 2, 1, 2, 5, 12, 24, 34, 26, 22, 25, 30, 36, 42, 48, 52, 44, 34, 22, 14, 9, 6, 4, 2],
    hourlyCongestionNorthbound: [2, 1, 1, 2, 4, 9, 16, 22, 20, 22, 26, 32, 36, 42, 48, 52, 42, 28, 18, 12, 7, 5, 3, 2],
    avgSpeedKmh: 66,
    freeFlowSpeedKmh: 80,
    aadt: 19500,
  },
  {
    km: 51.0,
    label: 'Bjørum – Vøyenenga (4-felts E16)',
    municipality: 'Bærum',
    road: 'E16',
    isBottleneck: false,
    hourlyCongestionSouthbound: [2, 1, 1, 2, 5, 14, 28, 38, 30, 20, 18, 20, 22, 25, 30, 34, 30, 22, 15, 10, 7, 5, 3, 2],
    hourlyCongestionNorthbound: [2, 1, 1, 2, 4, 8, 14, 20, 18, 18, 20, 22, 26, 30, 36, 40, 34, 24, 15, 10, 6, 4, 3, 2],
    avgSpeedKmh: 82,
    freeFlowSpeedKmh: 90,
    aadt: 28400,
  },
  {
    km: 57.2,
    label: 'Sandvika / Kjørbo (Sluttpunkt 57,2 km)',
    municipality: 'Bærum',
    road: 'E16',
    isBottleneck: false,
    hourlyCongestionSouthbound: [2, 1, 1, 2, 6, 16, 32, 42, 34, 22, 20, 22, 24, 28, 34, 38, 34, 24, 16, 11, 8, 5, 3, 2],
    hourlyCongestionNorthbound: [2, 1, 1, 2, 4, 9, 16, 22, 20, 20, 22, 25, 28, 34, 42, 46, 38, 26, 16, 11, 7, 5, 3, 2],
    avgSpeedKmh: 78,
    freeFlowSpeedKmh: 90,
    aadt: 34200,
  },
];

// Page 7: Mobilitet 360 – «Pulsen på byen»
export interface MobilityCityData {
  id: string;
  city: string;
  agreementName: string;
  population: string;
  activeCountingPoints: number;
  rvuSampleSize: number;
  zeroGrowthStatus: 'I rute' | 'Krever forsterkede tiltak';
  modes: {
    mode: 'Bil' | 'Kollektiv' | 'Sykling' | 'Gange' | 'Mikromobilitet';
    sharePercent: number;
    yoyChangePercent: number;
    dailyTrips: number;
    dataSource: string;
  }[];
  quarterlyIndex: {
    quarter: string;
    bil: number;
    kollektiv: number;
    sykling: number;
    gange: number;
    mikromobilitet: number;
  }[];
}

export const MOBILITET_360_CITIES: MobilityCityData[] = [
  {
    id: 'oslo',
    city: 'Oslo og Akershus',
    agreementName: 'Byvekstavtale Osloområdet',
    population: '1 420 000',
    activeCountingPoints: 312,
    rvuSampleSize: 18400,
    zeroGrowthStatus: 'I rute',
    modes: [
      { mode: 'Bil', sharePercent: 31.2, yoyChangePercent: -1.8, dailyTrips: 685000, dataSource: 'Trafikktellepunkter & Bompasseringer' },
      { mode: 'Kollektiv', sharePercent: 30.4, yoyChangePercent: 4.2, dailyTrips: 668000, dataSource: 'APC Kollektivtelling (Ruter / Vy)' },
      { mode: 'Gange', sharePercent: 27.1, yoyChangePercent: 1.5, dailyTrips: 595000, dataSource: 'RVU & By-sensorer' },
      { mode: 'Sykling', sharePercent: 8.4, yoyChangePercent: 6.8, dailyTrips: 184000, dataSource: 'Automatisk sykkeltelling (94 snitt)' },
      { mode: 'Mikromobilitet', sharePercent: 2.9, yoyChangePercent: 11.4, dailyTrips: 63500, dataSource: 'GBFS / MDS Operatør-API' },
    ],
    quarterlyIndex: [
      { quarter: 'K1 2025', bil: 100, kollektiv: 100, sykling: 100, gange: 100, mikromobilitet: 100 },
      { quarter: 'K2 2025', bil: 99.4, kollektiv: 102.1, sykling: 108.5, gange: 101.2, mikromobilitet: 114.0 },
      { quarter: 'K3 2025', bil: 98.9, kollektiv: 103.4, sykling: 112.0, gange: 101.8, mikromobilitet: 119.5 },
      { quarter: 'K4 2025', bil: 99.1, kollektiv: 104.8, sykling: 104.2, gange: 101.0, mikromobilitet: 106.2 },
      { quarter: 'K1 2026', bil: 98.5, kollektiv: 105.9, sykling: 106.8, gange: 101.9, mikromobilitet: 111.0 },
      { quarter: 'K2 2026', bil: 98.1, kollektiv: 107.6, sykling: 115.4, gange: 102.7, mikromobilitet: 124.8 },
      { quarter: 'K3 2026', bil: 97.6, kollektiv: 108.9, sykling: 118.2, gange: 103.3, mikromobilitet: 128.4 },
    ],
  },
  {
    id: 'bergen',
    city: 'Bergensområdet',
    agreementName: 'Byvekstavtale Bergensområdet',
    population: '425 000',
    activeCountingPoints: 148,
    rvuSampleSize: 7900,
    zeroGrowthStatus: 'I rute',
    modes: [
      { mode: 'Bil', sharePercent: 42.5, yoyChangePercent: -2.1, dailyTrips: 298000, dataSource: 'Trafikktellepunkter & Bomring' },
      { mode: 'Kollektiv', sharePercent: 24.8, yoyChangePercent: 5.6, dailyTrips: 174000, dataSource: 'Skyss Kollektivtelling & Bybanen' },
      { mode: 'Gange', sharePercent: 24.2, yoyChangePercent: 1.2, dailyTrips: 169500, dataSource: 'RVU & Sentrumssensorer' },
      { mode: 'Sykling', sharePercent: 6.3, yoyChangePercent: 8.9, dailyTrips: 44100, dataSource: 'Sykkeltellepunkter (inkl. Fyllingsdalstunnelen)' },
      { mode: 'Mikromobilitet', sharePercent: 2.2, yoyChangePercent: 9.2, dailyTrips: 15400, dataSource: 'Operatørdata & Kommunalt dashboard' },
    ],
    quarterlyIndex: [
      { quarter: 'K1 2025', bil: 100, kollektiv: 100, sykling: 100, gange: 100, mikromobilitet: 100 },
      { quarter: 'K2 2025', bil: 99.1, kollektiv: 103.2, sykling: 109.4, gange: 100.8, mikromobilitet: 110.5 },
      { quarter: 'K3 2025', bil: 98.4, kollektiv: 104.9, sykling: 114.2, gange: 101.4, mikromobilitet: 115.2 },
      { quarter: 'K4 2025', bil: 98.2, kollektiv: 106.1, sykling: 107.8, gange: 100.9, mikromobilitet: 104.8 },
      { quarter: 'K1 2026', bil: 97.7, kollektiv: 107.4, sykling: 110.1, gange: 101.5, mikromobilitet: 108.9 },
      { quarter: 'K2 2026', bil: 97.2, kollektiv: 109.2, sykling: 119.5, gange: 102.1, mikromobilitet: 118.4 },
      { quarter: 'K3 2026', bil: 96.8, kollektiv: 110.8, sykling: 122.4, gange: 102.6, mikromobilitet: 121.0 },
    ],
  },
  {
    id: 'trondheim',
    city: 'Trondheimsområdet',
    agreementName: 'Byvekstavtale Trondheimsområdet',
    population: '295 000',
    activeCountingPoints: 124,
    rvuSampleSize: 6400,
    zeroGrowthStatus: 'I rute',
    modes: [
      { mode: 'Bil', sharePercent: 44.1, yoyChangePercent: -1.1, dailyTrips: 215000, dataSource: 'Vegvesen Trafikktellepunkter' },
      { mode: 'Gange', sharePercent: 23.4, yoyChangePercent: 1.4, dailyTrips: 114000, dataSource: 'RVU & Fotgjengertelling' },
      { mode: 'Kollektiv', sharePercent: 18.9, yoyChangePercent: 3.4, dailyTrips: 92000, dataSource: 'AtB Metrobuss-passasjertelling' },
      { mode: 'Sykling', sharePercent: 10.8, yoyChangePercent: 5.2, dailyTrips: 52600, dataSource: 'Sykkeltellepunkter (46 stasjoner)' },
      { mode: 'Mikromobilitet', sharePercent: 2.8, yoyChangePercent: 8.5, dailyTrips: 13600, dataSource: 'Sanntids API mikromobilitet' },
    ],
    quarterlyIndex: [
      { quarter: 'K1 2025', bil: 100, kollektiv: 100, sykling: 100, gange: 100, mikromobilitet: 100 },
      { quarter: 'K2 2025', bil: 99.6, kollektiv: 101.5, sykling: 106.8, gange: 100.7, mikromobilitet: 109.2 },
      { quarter: 'K3 2025', bil: 99.2, kollektiv: 102.8, sykling: 110.4, gange: 101.2, mikromobilitet: 114.6 },
      { quarter: 'K4 2025', bil: 99.3, kollektiv: 103.4, sykling: 103.5, gange: 100.8, mikromobilitet: 103.1 },
      { quarter: 'K1 2026', bil: 98.9, kollektiv: 104.2, sykling: 105.9, gange: 101.4, mikromobilitet: 107.8 },
      { quarter: 'K2 2026', bil: 98.5, kollektiv: 105.6, sykling: 112.9, gange: 101.9, mikromobilitet: 116.5 },
      { quarter: 'K3 2026', bil: 98.2, kollektiv: 106.4, sykling: 115.2, gange: 102.4, mikromobilitet: 119.8 },
    ],
  },
  {
    id: 'nordjaeren',
    city: 'Nord-Jæren',
    agreementName: 'Byvekstavtale Nord-Jæren',
    population: '340 000',
    activeCountingPoints: 136,
    rvuSampleSize: 6800,
    zeroGrowthStatus: 'Krever forsterkede tiltak',
    modes: [
      { mode: 'Bil', sharePercent: 51.4, yoyChangePercent: -0.4, dailyTrips: 282000, dataSource: 'Trafikktellepunkter & Bymiljøpakken' },
      { mode: 'Gange', sharePercent: 19.8, yoyChangePercent: 1.1, dailyTrips: 108500, dataSource: 'RVU & Bysensorer' },
      { mode: 'Kollektiv', sharePercent: 16.5, yoyChangePercent: 4.8, dailyTrips: 90500, dataSource: 'Kolumbus & Bussveien APC' },
      { mode: 'Sykling', sharePercent: 9.9, yoyChangePercent: 7.4, dailyTrips: 54300, dataSource: 'Sykkelstamvegen & kommunale snitt' },
      { mode: 'Mikromobilitet', sharePercent: 2.4, yoyChangePercent: 10.1, dailyTrips: 13200, dataSource: 'Kolumbus Bysykkel / Sparkesykkel API' },
    ],
    quarterlyIndex: [
      { quarter: 'K1 2025', bil: 100, kollektiv: 100, sykling: 100, gange: 100, mikromobilitet: 100 },
      { quarter: 'K2 2025', bil: 99.9, kollektiv: 102.4, sykling: 107.5, gange: 100.5, mikromobilitet: 111.0 },
      { quarter: 'K3 2025', bil: 99.7, kollektiv: 104.1, sykling: 111.8, gange: 101.0, mikromobilitet: 116.4 },
      { quarter: 'K4 2025', bil: 99.8, kollektiv: 105.0, sykling: 106.2, gange: 100.6, mikromobilitet: 108.2 },
      { quarter: 'K1 2026', bil: 99.6, kollektiv: 106.2, sykling: 108.9, gange: 101.1, mikromobilitet: 112.5 },
      { quarter: 'K2 2026', bil: 99.4, kollektiv: 107.8, sykling: 115.6, gange: 101.6, mikromobilitet: 120.2 },
      { quarter: 'K3 2026', bil: 99.3, kollektiv: 109.1, sykling: 118.4, gange: 102.0, mikromobilitet: 123.6 },
    ],
  },
];

export const MOBILITET_360_STEPS = [
  {
    step: 1,
    title: 'Identifisere behovseiere',
    description: 'Kartlegge analysebehov hos bymiljøavtaler, fagmiljøer i SVV, Jernbanedirektoratet og fylkeskommuner.',
    status: 'Fullført / Forankret',
    deliverables: 'Behovsmatrise på tvers av byvekstområder og RVU-kobling (M360 / RVX).',
  },
  {
    step: 2,
    title: 'Beskrive use case',
    description: 'Definere prioriterte bruksområder for samlet visning av Bil, Kollektiv, Sykling, Gange og Mikromobilitet.',
    status: 'Pågår (NTP Workshop)',
    deliverables: 'Spesifikasjon av indikatorer, tellepunkt-kvalitet og datagrunnlag.',
  },
  {
    step: 3,
    title: 'Sette opp prototype',
    description: 'Etablere inhouse datagrunnlag og interaktiv analyseløsning i sky før overføring til SAGA SKY.',
    status: 'Prototype under etablering',
    deliverables: 'Operativt dashboard for trafikkutvikling i byområder med byvekstavtaler.',
  },
];

// Page 4: Sjømat Nord-Norge (Volum: 725 000 tonn, Eksportverdi: 46 mrd. kr)
export interface SeafoodCorridor {
  id: string;
  region: string;
  keyNodes: string;
  tonnage: number; // tonn
  exportValueBillionNok: number; // mrd. kr
  roadSharePercent: number;
  railSharePercent: number;
  seaAirSharePercent: number;
  vulnerabilityScore: 'Høy' | 'Moderat' | 'Lav';
  winterClosureHoursPerYear: number;
  primaryRoute: string;
}

export const SEAFOOD_CORRIDORS: SeafoodCorridor[] = [
  {
    id: 'vesteralen-lofoten',
    region: 'Vesterålen, Lofoten og Ofoten',
    keyNodes: 'Sortland · Svolvær · Røst · Værøy · Narvik (Ofotbanen)',
    tonnage: 215000,
    exportValueBillionNok: 13.8,
    roadSharePercent: 48,
    railSharePercent: 42,
    seaAirSharePercent: 10,
    vulnerabilityScore: 'Høy',
    winterClosureHoursPerYear: 142,
    primaryRoute: 'E10 Kong Olavs veg → Ofotbanen (Narvik) / E6 sørover',
  },
  {
    id: 'senja-midt-troms',
    region: 'Senja og Midt-Troms',
    keyNodes: 'Senja · Finnsnes · Bardufoss · Nordkjosbotn',
    tonnage: 168000,
    exportValueBillionNok: 10.6,
    roadSharePercent: 64,
    railSharePercent: 26,
    seaAirSharePercent: 10,
    vulnerabilityScore: 'Høy',
    winterClosureHoursPerYear: 118,
    primaryRoute: 'Fv. 86 / E6 Nordkjosbotn – Narvik terminal',
  },
  {
    id: 'tromso-nord-troms',
    region: 'Tromsø og Nord-Troms',
    keyNodes: 'Skjervøy · Kvænangen · Tromsø · Kåfjord',
    tonnage: 124000,
    exportValueBillionNok: 7.9,
    roadSharePercent: 72,
    railSharePercent: 14,
    seaAirSharePercent: 14,
    vulnerabilityScore: 'Høy',
    winterClosureHoursPerYear: 164,
    primaryRoute: 'E6 Kvænangsfjellet / E8 Skibotndalen (Finland-korridor)',
  },
  {
    id: 'vest-finnmark-varanger',
    region: 'Vest-Finnmark og Varanger',
    keyNodes: 'Alta · Hammerfest · Båtsfjord · Vadsø · Kirkenes',
    tonnage: 112000,
    exportValueBillionNok: 7.1,
    roadSharePercent: 78,
    railSharePercent: 6,
    seaAirSharePercent: 16,
    vulnerabilityScore: 'Høy',
    winterClosureHoursPerYear: 210,
    primaryRoute: 'E6 Sennalandet / E45 Kautokeino – Rovaniemi',
  },
  {
    id: 'salten-helgeland',
    region: 'Gildeskål, Salten og Helgeland',
    keyNodes: 'Gildeskål · Bodø · Lovund · Herøy · Alstahaug · Brønnøysund',
    tonnage: 106000,
    exportValueBillionNok: 6.6,
    roadSharePercent: 68,
    railSharePercent: 20,
    seaAirSharePercent: 12,
    vulnerabilityScore: 'Moderat',
    winterClosureHoursPerYear: 76,
    primaryRoute: 'Ferge/Kystveg Fv. 17 → E6 Saltfjellet / Nordlandsbanen',
  },
];

// Page 2 & 4: Transportmodeller (RTM, NTM, Gods) & Effektmåling
export interface ModelCalibrationSeries {
  year: string;
  staticForecastIndex: number; // Tradisjonell NTP-framskrivning
  observedSensorIndex: number; // Faktisk utvikling fra dynamiske data
  calibratedModelIndex: number; // Oppdatert RTM/NTM etter kalibrering
}

export const MODEL_CALIBRATION_SERIES: ModelCalibrationSeries[] = [
  { year: '2021', staticForecastIndex: 100.0, observedSensorIndex: 100.0, calibratedModelIndex: 100.0 },
  { year: '2022', staticForecastIndex: 102.4, observedSensorIndex: 101.2, calibratedModelIndex: 101.4 },
  { year: '2023', staticForecastIndex: 104.8, observedSensorIndex: 101.9, calibratedModelIndex: 102.1 },
  { year: '2024', staticForecastIndex: 107.3, observedSensorIndex: 102.6, calibratedModelIndex: 102.8 },
  { year: '2025', staticForecastIndex: 109.9, observedSensorIndex: 103.1, calibratedModelIndex: 103.3 },
  { year: '2026', staticForecastIndex: 112.5, observedSensorIndex: 103.8, calibratedModelIndex: 104.0 },
  { year: '2027 (Kalibrert)', staticForecastIndex: 115.2, observedSensorIndex: 104.5, calibratedModelIndex: 104.9 },
  { year: '2028 (Kalibrert)', staticForecastIndex: 118.0, observedSensorIndex: 105.2, calibratedModelIndex: 105.8 },
];

export interface EffectEvaluationCase {
  id: string;
  projectTitle: string;
  agency: string;
  corridor: string;
  measureType: 'Drift / mindre tiltak' | 'Kapasitetsutvidelse' | 'Kollektiv / Byvekst';
  forecastedBenefitMinutes: number;
  observedBenefitMinutes: number;
  costMillionNok: number;
  sensorSource: string;
  keyFinding: string;
}

export const EFFECT_EVALUATION_CASES: EffectEvaluationCase[] = [
  {
    id: 'e16-rv7-drift',
    projectTitle: 'E16 / Rv7 Hønefoss–Sollihøgda: Dynamisk trafikkstyring og kryssutbedring',
    agency: 'Statens vegvesen',
    corridor: 'Rv7 / E16 (57,2 km)',
    measureType: 'Drift / mindre tiltak',
    forecastedBenefitMinutes: 6.5,
    observedBenefitMinutes: 8.2,
    costMillionNok: 185,
    sensorSource: 'Inrix Roadway Analytics & Tellepunkter',
    keyFinding: 'Målrettet utbedring i flaskehalsen km 24–36 ga 26 % høyere reisetidsgevinst i helgeutfart enn modellert i forhåndsanalysen.',
  },
  {
    id: 'byvekst-kollektiv',
    projectTitle: 'Fremkommelighetstiltak kollektivkorridor og sykkelstamveg',
    agency: 'Statens vegvesen / Jernbanedirektoratet',
    corridor: 'Byvekstområde Stor-Oslo & Bergen',
    measureType: 'Kollektiv / Byvekst',
    forecastedBenefitMinutes: 4.8,
    observedBenefitMinutes: 5.1,
    costMillionNok: 420,
    sensorSource: 'Mobilitet 360 · APC Kollektivtelling · Sykkeltelling',
    keyFinding: 'Kontinuerlige sensortellinger bekrefter varig trafikkoverføring fra personbil (-1,8 %) til sykkel (+6,8 %) og kollektiv (+4,2 %).',
  },
  {
    id: 'ofotbanen-krysningsspor',
    projectTitle: 'Krysningsspor og digital kapasitetsstyring for sjømatgods',
    agency: 'Bane NOR / Kystverket',
    corridor: 'Nord-Norge → Narvik / Ofotbanen',
    measureType: 'Kapasitetsutvidelse',
    forecastedBenefitMinutes: 28.0,
    observedBenefitMinutes: 31.5,
    costMillionNok: 890,
    sensorSource: 'TIOS Togposisjonsdata · Godsmodellen · AIS',
    keyFinding: 'Redusert sårbarhet og bedre punktlighet for fersk sjømat fra Vesterålen og Senja ved samkjøring av veg- og banedata.',
  },
  {
    id: 'e18-nyeveier-effekt',
    projectTitle: 'Etterprøving av reisetid og trafikksikkerhet på ny motorvegstrekning',
    agency: 'Nye Veier',
    corridor: 'E18 Sørvestkorridoren',
    measureType: 'Kapasitetsutvidelse',
    forecastedBenefitMinutes: 14.0,
    observedBenefitMinutes: 13.6,
    costMillionNok: 6400,
    sensorSource: 'Inrix · Effektdatabasen · RTM',
    keyFinding: 'Høy samsvarsgrad mellom observert reisetid og Effekt-beregning, men lavere nyskapt personbiltrafikk enn fryktet i gammel prognose.',
  },
];

// Page 6: Dataplattform med geo-kapabiliteter (Integrasjon mellom SAGA SKY og ArcGIS)
export interface SagaArcGisLayer {
  number: number;
  name: string;
  maturity: 'ready' | 'dev' | 'beta';
  maturityLabel: string;
  technicalSummary: string;
  ntpUseCase: string;
}

export const SAGA_ARCGIS_LAYERS: SagaArcGisLayer[] = [
  {
    number: 1,
    name: 'ArcGIS GeoAnalytics Engine',
    maturity: 'ready',
    maturityLabel: 'Kan benyttes i dag',
    technicalSummary: 'Distribuert romlig prosessering direkte på store datamengder i SAGA SKY uten å flytte rådata.',
    ntpUseCase: 'Tunge korridoranalyser, aggregering av Inrix-historikk og nasjonale AIS-/posisjonsdatasett.',
  },
  {
    number: 2,
    name: 'ArcGIS Data Pipelines',
    maturity: 'ready',
    maturityLabel: 'Kan benyttes i dag',
    technicalSummary: 'Lavkode dataflyt for automatisert innhenting, vasking og berikelse fra SAGA SKY til ArcGIS.',
    ntpUseCase: 'Løpende oppdatering av trafikktellepunkter, sykkeltellinger og strekningsindikatorer til kartportaler.',
  },
  {
    number: 3,
    name: 'Custom Data Feeds',
    maturity: 'dev',
    maturityLabel: 'Utvikling JavaScript / Node.js',
    technicalSummary: 'Skreddersydde API-adaptere i Node.js for å eksponere spesialiserte datastrømmer som Feature Services.',
    ntpUseCase: 'Tilpassede datastrømmer fra Mobilitet 360, operatør-API-er og tverrsektorielle NTP-tabeller.',
  },
  {
    number: 4,
    name: 'Query Layer',
    maturity: 'beta',
    maturityLabel: 'I beta / kommende versjoner av ArcGIS',
    technicalSummary: 'Direkte SQL-baserte spørringer fra ArcGIS Pro og Enterprise mot skybaserte datavarehus i SAGA SKY.',
    ntpUseCase: 'Ad-hoc filtrering av store transportmodell-kjøringer (RTM/NTM) direkte i kartklienten.',
  },
  {
    number: 5,
    name: 'Parquet Layers',
    maturity: 'beta',
    maturityLabel: 'I beta / kommende versjoner av ArcGIS',
    technicalSummary: 'Direkte lesing av GeoParquet-filer fra skylagring med høy ytelse og minimal lagringskostnad.',
    ntpUseCase: 'Deling og visualisering av terabyte-store historiske sensordatasett og gjennomføringsplaner.',
  },
];

export const GIS_USE_CASES = [
  {
    number: 1,
    title: 'Visualisering',
    description: 'Ferdige datasett fra dataplattformen vises direkte i ArcGIS for innsyn og formidling.',
  },
  {
    number: 2,
    title: 'Geografiske analyser',
    description: 'Videre romlige analyser (nettverk, dekningsområder, sårbarhet) på datasettene på GIS-plattformen.',
  },
  {
    number: 3,
    title: 'Lokal berikelse',
    description: 'Hente ned data og berike / analysere sammen med lokale fagdata på GIS-plattformen.',
  },
  {
    number: 4,
    title: 'Geoanalyse på dataplattformen',
    description: 'Fullverdige geoanalyser direkte i SAGA SKY, f.eks. via ArcGIS GeoAnalytics Engine.',
  },
];

export const DATASET_TYPES = [
  {
    title: 'Klassiske tabelldata med geometri',
    examples: 'Trafikktellepunkter, ulykkespunkter, streknings-KPIer, RVU-soner og byvekstgrenser.',
  },
  {
    title: 'Punktskyer',
    examples: 'LiDAR-skanning av veg- og banekorridorer, tunnelprofiler, skredutsatte partier og havneanlegg.',
  },
  {
    title: 'Georefererte objekter, f.eks. bilder',
    examples: 'Vegbilder, droneopptak, sensorkameraer og tilstandsregistreringer langs riksveg og jernbane.',
  },
];

// Page 8 & 9: Interimløsning i sky (6-12 mnd) og Hva løses ikke med midlertidig løsning
export interface InterimGapDimension {
  id: string;
  title: string;
  subtitle: string;
  todayState: string;
  todayDetail: string;
  interimState: string;
  interimDetail: string;
  longTermState: string;
  longTermDetail: string;
}

export const INTERIM_GAP_MATRIX: InterimGapDimension[] = [
  {
    id: 'datadeling',
    title: 'Datadeling med eksterne',
    subtitle: 'Samhandling mellom de 6 NTP-virksomhetene, konsulenter og forskningsmiljøer',
    todayState: 'Eroom',
    todayDetail: 'Manuell opplasting og mappebasert dokumentdeling med begrenset versjonskontroll på store datasett.',
    interimState: 'M-files / ArcGIS',
    interimDetail: 'Strukturert dokument- og kartdeling i mellomfasen (6–12 mnd) mens SAGA SKY ferdigstilles.',
    longTermState: 'SAGA SKY med delingskapabilitet',
    longTermDetail: 'Sikker, rollebasert datadeling direkte fra felles dataplattform med API- og Parquet-tilgang.',
  },
  {
    id: 'sanntidsdata',
    title: 'Analyser og innsikt med sanntidsdata',
    subtitle: 'Bruk av dynamiske strømmer som Inrix, AIS, APC og mikromobilitet',
    todayState: 'ArcGIS-plattform for kjente behov',
    todayDetail: 'Etablerte kartløsninger og leverandørportaler (f.eks. Inrix Roadway Analytics) for forhåndsdefinerte strekninger.',
    interimState: 'ArcGIS og andre ad-hoc verktøy',
    interimDetail: 'Kombinasjon av interim skylagring, ArcGIS og fleksible ad-hoc analyse- og visualiseringsverktøy.',
    longTermState: 'Avklares i målbilde (TBD)',
    longTermDetail: 'Fullintegrert strømme- og batch-arkitektur mellom SAGA SKY, GeoAnalytics Engine og spesialverktøy.',
  },
  {
    id: 'datastyring',
    title: 'Styring av data (Data Governance)',
    subtitle: 'Kvalitetssikring, personvern, sikkerhet og katalogisering av NTP-data',
    todayState: 'Må håndteres manuelt og av bruker',
    todayDetail: 'Den enkelte analytiker eller prosjekteier må selv avklare rettigheter, kvalitet og lagring.',
    interimState: 'Samarbeid med Data Governance (DG)-miljøet',
    interimDetail: 'Iterativ utvikling av effektive prosesser og rutiner for databeskrivelser, verdivurdering, ROS og DPIA.',
    longTermState: 'Integrert styring i SAGA SKY',
    longTermDetail: 'Standardiserte datakataloger, automatisert tilgangsstyring og ferdigstilte DPIA/ROS-løp for datakilder.',
  },
];
