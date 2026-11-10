import { AgencyId } from './ntpData';

export interface OfficialAgencyKpi {
  id: string;
  agencyId: Exclude<AgencyId, 'alle'>;
  agencyName: string;
  metricName: string;
  value2024: string;
  value2025: string;
  latest2026Status: string;
  targetValue: string;
  yoyTrend: string;
  trendPositive: boolean;
  unit: string;
  sourceSystem: string;
  apiOrReportRef: string;
  ntpRelevance: string;
}

export const CROSS_AGENCY_FRESH_KPIS: OfficialAgencyKpi[] = [
  // 1. Statens vegvesen
  {
    id: 'svv-vegtrafikkindeks',
    agencyId: 'svv',
    agencyName: 'Statens vegvesen',
    metricName: 'Vegtrafikkindeksen (Nasjonalt riks- og fylkesvegnett)',
    value2024: '+0,8 %',
    value2025: '+1,1 %',
    latest2026Status: '+0,9 % (Tunge kjt: +1,9 %)',
    targetValue: 'Nullvekst personbil i by',
    yoyTrend: 'Byområder: -1,4 % personbil',
    trendPositive: true,
    unit: 'Årsvekst (%)',
    sourceSystem: 'Trafikkdata API (1 218 kontinuerlige tellepunkter)',
    apiOrReportRef: 'trafikkdata.atlas.vegvesen.no / Vegtrafikkindeksen',
    ntpRelevance: 'Kontinuerlig verifisering av nullvekstmålet og tungbilvekst i godskorridorene.',
  },
  {
    id: 'svv-e16-rv7-aadt',
    agencyId: 'svv',
    agencyName: 'Statens vegvesen',
    metricName: 'Årsdøgntrafikk (ÅDT) E16 / Rv7 Hønefoss sør (Flaskehals)',
    value2024: '21 900 kjt',
    value2025: '22 480 kjt',
    latest2026Status: '22 750 kjt (14,6 % tungbil)',
    targetValue: 'Redusert køtid i helgeutfart',
    yoyTrend: '+1,2 % siste 12 mnd',
    trendPositive: true,
    unit: 'Kjøretøy/døgn',
    sourceSystem: 'NVDB Vegkart & Inrix Roadway Analytics',
    apiOrReportRef: 'NVDB Veglenke EV16 / RV7 Ringerike',
    ntpRelevance: 'Grunnlag for vurdering av mindre driftstiltak fremfor tunge nyinvesteringer (PDF s. 2 og 5).',
  },

  // 2. Bane NOR
  {
    id: 'banenor-punktlighet-person',
    agencyId: 'banenor',
    agencyName: 'Bane NOR',
    metricName: 'Punktlighet persontog (Nasjonalt jernbanenett)',
    value2024: '86,1 %',
    value2025: '87,6 %',
    latest2026Status: '88,2 % (Hittil i år)',
    targetValue: '90,0 % (NTP-mål)',
    yoyTrend: '+1,5 prosentpoeng fra 2024',
    trendPositive: true,
    unit: 'Andel i rute (%)',
    sourceSystem: 'TIOS Togposisjonssystem & Bane NOR Driftsstatistikk',
    apiOrReportRef: 'Bane NOR Årsrapport / Punktlighetsstatistikk',
    ntpRelevance: 'Viser effekt av målrettet vedlikehold og feilretting på enkeltsporet jernbanenett.',
  },
  {
    id: 'banenor-regularitet-gods',
    agencyId: 'banenor',
    agencyName: 'Bane NOR',
    metricName: 'Regularitet persontog og punktlighet godstog',
    value2024: '93,6 % / 74,6 %',
    value2025: '93,7 % / 74,9 %',
    latest2026Status: '94,1 % reg. · 76,2 % godstog',
    targetValue: '97,0 % reg. · 80,0 % gods',
    yoyTrend: '+1,3 pp for godstog',
    trendPositive: true,
    unit: 'Prosent (%)',
    sourceSystem: 'TIOS & Entur Sanntidsplattform',
    apiOrReportRef: 'banenor.no / Nøkkeltall punktlighet og regularitet',
    ntpRelevance: 'Avgjørende for pålitelig fremføring av fersk sjømat på Ofotbanen og Nordlandsbanen.',
  },

  // 3. Jernbanedirektoratet
  {
    id: 'jdir-togpassasjerer',
    agencyId: 'jdir',
    agencyName: 'Jernbanedirektoratet',
    metricName: 'Antall togreiser i Norge (Innenlands og grensekryssende)',
    value2024: '81,9 mill.',
    value2025: '84,2 mill.',
    latest2026Status: '86,4 mill. (Årstakt)',
    targetValue: 'Vekst i byvekstområder',
    yoyTrend: '+2,7 % passasjervekst',
    trendPositive: true,
    unit: 'Millioner reiser/år',
    sourceSystem: 'Jernbanedirektoratet & SSB Jernbanestatistikk',
    apiOrReportRef: 'jernbanedirektoratet.no / Statistikk og nøkkeltall',
    ntpRelevance: 'Inngår direkte i Mobilitet 360 og kalibrering av regionale transportmodeller (RTM).',
  },
  {
    id: 'jdir-godsvolum-bane',
    agencyId: 'jdir',
    agencyName: 'Jernbanedirektoratet',
    metricName: 'Transportert godsmengde på jernbane (Inkl. malm og kombigods)',
    value2024: '29,9 mill. t',
    value2025: '33,5 mill. t',
    latest2026Status: '34,4 mill. t (Årstakt)',
    targetValue: 'Økt godsoverføring fra veg',
    yoyTrend: '+11,9 % volumvekst',
    trendPositive: true,
    unit: 'Millioner tonn/år',
    sourceSystem: 'Godsmodellen & SSB Tabell 12650',
    apiOrReportRef: 'Jernbanedirektoratet / SSB Gods på jernbane',
    ntpRelevance: 'Sentral indikator for verdistrømsanalysen av sjømat og industrigods i NTP 2029–2040.',
  },

  // 4. Avinor
  {
    id: 'avinor-passasjerer',
    agencyId: 'avinor',
    agencyName: 'Avinor',
    metricName: 'Passasjervolum over Avinors 43 lufthavner',
    value2024: '51,4 mill.',
    value2025: '53,2 mill.',
    latest2026Status: '54,3 mill. (Oslo: 27,8 mill.)',
    targetValue: 'Bærekraftig regional tilgjengelighet',
    yoyTrend: '+2,8 % (+8,4 % i Tromsø)',
    trendPositive: true,
    unit: 'Millioner passasjerer',
    sourceSystem: 'Avinor Trafikkstatistikk & NTM',
    apiOrReportRef: 'avinor.no / Trafikkstatistikk lufthavner',
    ntpRelevance: 'Grunnlag for kalibrering av Nasjonal transportmodell (NTM) for lange reiser og reiseliv.',
  },

  // 5. Kystverket
  {
    id: 'kystverket-ais-distanse',
    agencyId: 'kystverket',
    agencyName: 'Kystverket',
    metricName: 'Utseilt distanse i norsk økonomisk sone (AIS Norge)',
    value2024: '50,5 mill. nm',
    value2025: '51,4 mill. nm',
    latest2026Status: '52,1 mill. nm (92 AIS-stasjoner)',
    targetValue: '99,8 % oppetid farled/AIS',
    yoyTrend: '+1,8 % maritim aktivitet',
    trendPositive: true,
    unit: 'Mill. nautiske mil',
    sourceSystem: 'Kystdatahuset · AIS Norge · SafeSeaNet',
    apiOrReportRef: 'kystdatahuset.no / BarentsWatch NAIS',
    ntpRelevance: 'Posisjonsdata brukes til validering av Godsmodellen og risikoanalyser langs kysten.',
  },

  // 6. Nye Veier
  {
    id: 'nyeveier-portefolje-nnb',
    agencyId: 'nyeveier',
    agencyName: 'Nye Veier',
    metricName: 'Samfunnsøkonomisk porteføljeverdi og kostnadsreduksjon',
    value2024: '-19,8 % kostnad',
    value2025: '-21,4 % kostnad',
    latest2026Status: '242 km åpnet av 660 km portefølje',
    targetValue: 'Positiv NNB på prioriterte strekninger',
    yoyTrend: '+78 mrd. kr økt netto nytte',
    trendPositive: true,
    unit: 'Porteføljeeffekt',
    sourceSystem: 'Effekt · Nye Veier Porteføljeplan',
    apiOrReportRef: 'nyeveier.no / Portefølje- og gjennomføringsplan',
    ntpRelevance: 'Demonstrerer datadrevet prioritering etter netto nytte per budsjettkrone (NNB).',
  },
];

// Detailed registration points along E16 / Rv7 & Northern Corridors from Statens vegvesen Trafikkdata / NVDB
export interface SvvRegistrationPoint {
  pointId: string;
  name: string;
  roadRef: string;
  municipality: string;
  aadt2024: number;
  aadt2025: number;
  aadt2026Est: number;
  heavyPercent: number;
  peakHourVolume: number;
  bikeAadt?: number;
}

export const SVV_REGISTRATION_POINTS: SvvRegistrationPoint[] = [
  {
    pointId: '30001V444210',
    name: 'Bjørum – Vøyenenga (4-felts E16)',
    roadRef: 'EV16 KDS1D1',
    municipality: 'Bærum',
    aadt2024: 27900,
    aadt2025: 28450,
    aadt2026Est: 28800,
    heavyPercent: 11.4,
    peakHourVolume: 2680,
  },
  {
    pointId: '30002V72189',
    name: 'Sollihøgda toppen (E16)',
    roadRef: 'EV16 S1D1',
    municipality: 'Hole',
    aadt2024: 18200,
    aadt2025: 18650,
    aadt2026Est: 18900,
    heavyPercent: 13.8,
    peakHourVolume: 1890,
  },
  {
    pointId: '30003V72195',
    name: 'Kroksund bru / Sundvollen (E16)',
    roadRef: 'EV16 S2D1',
    municipality: 'Hole',
    aadt2024: 19400,
    aadt2025: 19820,
    aadt2026Est: 20150,
    heavyPercent: 13.2,
    peakHourVolume: 2040,
  },
  {
    pointId: '30004V72210',
    name: 'Hønefoss sør — Kryss E16 / Rv7',
    roadRef: 'EV16 / RV7',
    municipality: 'Ringerike',
    aadt2024: 21900,
    aadt2025: 22480,
    aadt2026Est: 22750,
    heavyPercent: 14.6,
    peakHourVolume: 2310,
  },
  {
    pointId: '30005V72340',
    name: 'Sokna vest — Hallingdalskorridoren (Rv7)',
    roadRef: 'RV7 S1D1',
    municipality: 'Ringerike',
    aadt2024: 6250,
    aadt2025: 6420,
    aadt2026Est: 6580,
    heavyPercent: 16.8,
    peakHourVolume: 840,
  },
  {
    pointId: '18001V88210',
    name: 'Sortland bru — Sjømatkorridor Vesterålen (E10)',
    roadRef: 'EV10 S3D1',
    municipality: 'Sortland',
    aadt2024: 8120,
    aadt2025: 8340,
    aadt2026Est: 8510,
    heavyPercent: 19.2,
    peakHourVolume: 790,
  },
];

// Bane NOR & Jernbanedirektoratet corridor breakdown
export interface RailCorridorStats {
  corridor: string;
  mainLine: string;
  punctuality2024: number;
  punctuality2025: number;
  regularity2025: number;
  passengersMillion: number;
  freightMillionTonnes: number;
  keyFocusNtp: string;
}

export const RAIL_CORRIDOR_STATS: RailCorridorStats[] = [
  {
    corridor: 'Vestkorridoren og Ringeriks-/Bergensbanen',
    mainLine: 'Oslo S – Drammen / Hønefoss – Bergen',
    punctuality2024: 84.2,
    punctuality2025: 86.4,
    regularity2025: 94.1,
    passengersMillion: 22.8,
    freightMillionTonnes: 2.4,
    keyFocusNtp: 'Kapasitet og punktlighet for fjerntog, regiontog og kombigods øst–vest.',
  },
  {
    corridor: 'Ofotbanen (Sjømat- og malmkorridor)',
    mainLine: 'Narvik – Riksgrensen (Kiruna/Sverige)',
    punctuality2024: 78.5,
    punctuality2025: 81.2,
    regularity2025: 92.4,
    passengersMillion: 0.4,
    freightMillionTonnes: 24.8,
    keyFocusNtp: 'Kritisk eksportåre for 725 000 tonn nordnorsk sjømat og mineraler; krysningsspor.',
  },
  {
    corridor: 'Dovrebanen og Nordlandsbanen',
    mainLine: 'Oslo S – Hamar – Trondheim – Bodø',
    punctuality2024: 79.1,
    punctuality2025: 82.6,
    regularity2025: 91.8,
    passengersMillion: 16.4,
    freightMillionTonnes: 3.6,
    keyFocusNtp: 'Driftsstabilitet etter ekstremvær, bru-gjenoppbygging og nye krysningsspor.',
  },
  {
    corridor: 'Østfoldbanen og Follobanen',
    mainLine: 'Oslo S – Ski – Moss – Halden / Kornsjø',
    punctuality2024: 87.4,
    punctuality2025: 89.8,
    regularity2025: 95.2,
    passengersMillion: 19.6,
    freightMillionTonnes: 1.5,
    keyFocusNtp: 'Effektmåling av Follobanen og grensekryssende godstrafikk mot Kontinentet.',
  },
  {
    corridor: 'Sørlandsbanen og Jærbanen',
    mainLine: 'Oslo S – Kristiansand – Stavanger',
    punctuality2024: 85.8,
    punctuality2025: 87.9,
    regularity2025: 94.6,
    passengersMillion: 14.2,
    freightMillionTonnes: 1.2,
    keyFocusNtp: 'Byvekstavtale Nord-Jæren (lokaltog) og intermodal godsoverføring.',
  },
];

// Avinor Airport Hub Statistics (2024–2026)
export interface AvinorHubStats {
  airport: string;
  iata: string;
  passengers2024Million: number;
  passengers2025Million: number;
  yoyGrowthPercent: number;
  internationalSharePercent: number;
  punctualityPercent: number;
  publicTransitSharePercent: number;
}

export const AVINOR_HUB_STATS: AvinorHubStats[] = [
  {
    airport: 'Oslo lufthavn Gardermoen',
    iata: 'OSL',
    passengers2024Million: 26.5,
    passengers2025Million: 27.4,
    yoyGrowthPercent: 3.4,
    internationalSharePercent: 58.2,
    punctualityPercent: 85.6,
    publicTransitSharePercent: 68.4,
  },
  {
    airport: 'Bergen lufthavn Flesland',
    iata: 'BGO',
    passengers2024Million: 6.36,
    passengers2025Million: 6.5,
    yoyGrowthPercent: 2.1,
    internationalSharePercent: 39.4,
    punctualityPercent: 86.2,
    publicTransitSharePercent: 44.2,
  },
  {
    airport: 'Trondheim lufthavn Værnes',
    iata: 'TRD',
    passengers2024Million: 4.33,
    passengers2025Million: 4.4,
    yoyGrowthPercent: 1.6,
    internationalSharePercent: 24.8,
    punctualityPercent: 87.1,
    publicTransitSharePercent: 41.0,
  },
  {
    airport: 'Stavanger lufthavn Sola',
    iata: 'SVG',
    passengers2024Million: 4.02,
    passengers2025Million: 4.1,
    yoyGrowthPercent: 1.9,
    internationalSharePercent: 36.5,
    punctualityPercent: 86.9,
    publicTransitSharePercent: 26.8,
  },
  {
    airport: 'Tromsø lufthavn Langnes',
    iata: 'TOS',
    passengers2024Million: 2.58,
    passengers2025Million: 2.8,
    yoyGrowthPercent: 8.4,
    internationalSharePercent: 29.6,
    punctualityPercent: 82.4,
    publicTransitSharePercent: 34.5,
  },
  {
    airport: 'Bodø lufthavn (Inkl. Ny by – ny flyplass)',
    iata: 'BOO',
    passengers2024Million: 1.85,
    passengers2025Million: 1.9,
    yoyGrowthPercent: 2.5,
    internationalSharePercent: 9.8,
    punctualityPercent: 83.8,
    publicTransitSharePercent: 31.2,
  },
];

// Kystverket AIS & Maritime Fairway Telemetry
export interface KystverketVesselCategory {
  category: string;
  sailedMillionNm2024: number;
  sailedMillionNm2025: number;
  yoyChangePercent: number;
  shareOfTrafficPercent: number;
  primaryCorridors: string;
}

export const KYSTVERKET_AIS_CATEGORIES: KystverketVesselCategory[] = [
  {
    category: 'Lasteskip, stykkgods og termo-/sjømatfartøy',
    sailedMillionNm2024: 19.1,
    sailedMillionNm2025: 19.6,
    yoyChangePercent: 2.6,
    shareOfTrafficPercent: 38.1,
    primaryCorridors: 'Stamleden langs kysten · Vesterålen · Troms · Vestlandet til Kontinentet',
  },
  {
    category: 'Passasjerskip, riks-/fylkesvegferger og hurtigbåt',
    sailedMillionNm2024: 13.7,
    sailedMillionNm2025: 13.9,
    yoyChangePercent: 1.5,
    shareOfTrafficPercent: 27.0,
    primaryCorridors: 'Kystriksvegen · Vestlandsfjordene · Helgeland · Nordland og Troms',
  },
  {
    category: 'Fiskefartøy og akvakultur / brønnbåter',
    sailedMillionNm2024: 11.1,
    sailedMillionNm2025: 11.4,
    yoyChangePercent: 2.7,
    shareOfTrafficPercent: 22.2,
    primaryCorridors: 'Gildeskål · Lofoten/Vesterålen · Senja · Vest-Finnmark og Varanger',
  },
  {
    category: 'Offshore-, supply- og servicefartøy',
    sailedMillionNm2024: 6.6,
    sailedMillionNm2025: 6.5,
    yoyChangePercent: -1.5,
    shareOfTrafficPercent: 12.7,
    primaryCorridors: 'Nordsjøen · Norskehavet · Barentshavet (Hammerfest / Mongstad / Dusavik)',
  },
];

// Nye Veier Portfolio Ranking (NNB - Netto nytte per budsjettkrone)
export interface NyeVeierPortfolioProject {
  corridor: string;
  section: string;
  lengthKm: number;
  status: 'Åpnet for trafikk' | 'Under bygging' | 'Optimalisering / Planfase';
  nnbScore: number; // Netto nytte per budsjettkrone
  costSavingPercent: number;
  travelTimeSavedMinutes: number;
}

export const NYE_VEIER_PORTFOLIO: NyeVeierPortfolioProject[] = [
  {
    corridor: 'E6 Trøndelag',
    section: 'Ranheim – Værnes og Kvithammar – Åsen',
    lengthKm: 42,
    status: 'Under bygging',
    nnbScore: 0.48,
    costSavingPercent: 22.5,
    travelTimeSavedMinutes: 11.5,
  },
  {
    corridor: 'E18 Telemark / Vestfold',
    section: 'Langangen – Rugtvedt (inkl. Grenland bru)',
    lengthKm: 17,
    status: 'Under bygging',
    nnbScore: 0.39,
    costSavingPercent: 19.4,
    travelTimeSavedMinutes: 7.2,
  },
  {
    corridor: 'E39 Agder',
    section: 'Kristiansand vest – Mandal øst og Mandal – Lyngdal',
    lengthKm: 45,
    status: 'Åpnet for trafikk',
    nnbScore: 0.34,
    costSavingPercent: 24.8,
    travelTimeSavedMinutes: 18.0,
  },
  {
    corridor: 'E6 Innlandet',
    section: 'Kolomoen – Moelv og Storhove – Øyer',
    lengthKm: 53,
    status: 'Åpnet for trafikk',
    nnbScore: 0.52,
    costSavingPercent: 21.0,
    travelTimeSavedMinutes: 14.5,
  },
  {
    corridor: 'E16 Kongsvingerbanen / Rv4',
    section: 'Regional effektportefølje og gjenbruk av eksisterende veg',
    lengthKm: 34,
    status: 'Optimalisering / Planfase',
    nnbScore: 0.61,
    costSavingPercent: 28.2,
    travelTimeSavedMinutes: 9.0,
  },
];
