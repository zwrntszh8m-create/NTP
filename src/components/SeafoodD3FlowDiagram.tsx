import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { Ship, Truck, Train, Plane, RotateCcw } from 'lucide-react';

type FlowMetricMode = 'tonnes' | 'value_nok' | 'ais_nm';

interface FlowNodeDatum {
  id: string;
  name: string;
  stage: 'origin' | 'corridor' | 'market';
  stageLabel: string;
  color: string;
  aisDetail: string;
  vulnerabilityNote: string;
}

interface FlowLinkDatum {
  source: string;
  target: string;
  tonnes: number;
  valueBillionNok: number;
  aisThousandNm: number;
  routeNote: string;
}

const FLOW_NODES: FlowNodeDatum[] = [
  // Stage 1: Origins (5 Northern Regions from NTP PDF p. 4 & Kystverket AIS)
  {
    id: 'orig_vesteralen',
    name: 'Vesterålen, Lofoten og Ofoten',
    stage: 'origin',
    stageLabel: 'Opprinnelsesregion (Kyst)',
    color: '#0f766e',
    aisDetail: 'Kystverket AIS: 4,8 mill. nm brønnbåt/lasteskip · Sortland / Svolvær / Røst',
    vulnerabilityNote: '142 t/år vinterstengt E10 · Høy kritikalitet mot Ofotbanen (Narvik)',
  },
  {
    id: 'orig_senja',
    name: 'Senja og Midt-Troms',
    stage: 'origin',
    stageLabel: 'Opprinnelsesregion (Kyst)',
    color: '#0d9488',
    aisDetail: 'Kystverket AIS: 3,9 mill. nm i Gisundet og Vågsfjorden · Finnsnes / Senja',
    vulnerabilityNote: '118 t/år vinterstengt · Primær tilførsel via Fv. 86 / E6 til Narvik',
  },
  {
    id: 'orig_tromso',
    name: 'Tromsø og Nord-Troms',
    stage: 'origin',
    stageLabel: 'Opprinnelsesregion (Kyst)',
    color: '#0284c7',
    aisDetail: 'Kystverket AIS: 3,4 mill. nm · Skjervøy / Kvænangen / Tromsø havn',
    vulnerabilityNote: '164 t/år vinterstengt på E6 Kvænangsfjellet og E8 Skibotndalen',
  },
  {
    id: 'orig_finnmark',
    name: 'Vest-Finnmark og Varanger',
    stage: 'origin',
    stageLabel: 'Opprinnelsesregion (Kyst)',
    color: '#0369a1',
    aisDetail: 'Kystverket AIS: 4,2 mill. nm langs stamleden · Hammerfest / Båtsfjord / Kirkenes',
    vulnerabilityNote: '210 t/år vinterstengt på E6 Sennalandet · Høy avhengighet av E45 og kystfrakt',
  },
  {
    id: 'orig_salten',
    name: 'Gildeskål, Salten og Helgeland',
    stage: 'origin',
    stageLabel: 'Opprinnelsesregion (Kyst)',
    color: '#1e40af',
    aisDetail: 'Kystverket AIS: 3,3 mill. nm brønnbåt og kystlast · Lovund / Herøy / Bodø',
    vulnerabilityNote: '76 t/år vinterstengt E6 Saltfjellet · Fergeavhengighet langs Fv. 17',
  },

  // Stage 2: Transport Corridors & Modal Hubs
  {
    id: 'mode_road',
    name: 'Riksveg E6 / E10 / E8 / E45 (SVV Termovogntog)',
    stage: 'corridor',
    stageLabel: 'Transportform & Korridor',
    color: '#334155',
    aisDetail: 'Statens vegvesen: 16–21 % tungbilandel på hovedkorridorene ut av Nord-Norge',
    vulnerabilityNote: 'Direkte fremføring fra slakteri til terminal eller grensepassering',
  },
  {
    id: 'mode_rail',
    name: 'Ofotbanen og Nordlandsbanen (Bane NOR Kombigods)',
    stage: 'corridor',
    stageLabel: 'Transportform & Korridor',
    color: '#b45309',
    aisDetail: 'Bane NOR / Jdir: Narvik og Bodø terminaler · Punktlighet godstog 74,9 % (mål 80 %)',
    vulnerabilityNote: 'Høykapasitets grønn korridor via Sverige (ARE-togene Narvik–Oslo/Padborg)',
  },
  {
    id: 'mode_sea',
    name: 'Kystverket Stamled & Sjøfrakt (19,6 mill. nm last/termo)',
    stage: 'corridor',
    stageLabel: 'Transportform & Korridor',
    color: '#0369a1',
    aisDetail: 'Kystverket AIS Norge: 19,6 mill. nm lasteskip + 11,4 mill. nm fiskefartøy/brønnbåt',
    vulnerabilityNote: '99,86 % farledsoppetid · Direkte sjøruter fra nordnorske fiskerihavner til EU',
  },
  {
    id: 'mode_air',
    name: 'Avinor Flyfrakt (OSL / Evenes / Tromsø)',
    stage: 'corridor',
    stageLabel: 'Transportform & Korridor',
    color: '#0f766e',
    aisDetail: 'Avinor: Høyverdi fersk laks/sjømat til interkontinentale markeder via OSL og Evenes',
    vulnerabilityNote: 'Tidskritisk tilbringerkjede på veg/bane frem til fraktfly',
  },

  // Stage 3: Export Hubs & End Markets
  {
    id: 'mkt_eu_land',
    name: 'EU-markedet via Sverige / Kontinentet (Alnabru / Padborg)',
    stage: 'market',
    stageLabel: 'Eksportknutepunkt & Marked',
    color: '#0f172a',
    aisDetail: 'Hovedstrøm for fersk og bearbeidet sjømat til foredling og distribusjon i EU',
    vulnerabilityNote: 'Kritisk avhengig av regularitet på E6, E45 og Ofotbanen',
  },
  {
    id: 'mkt_sea_global',
    name: 'Sjøbasert Eksport til Storbritannia og Kontinentet',
    stage: 'market',
    stageLabel: 'Eksportknutepunkt & Marked',
    color: '#1e3a8a',
    aisDetail: 'Overføring fra veg til sjø i tråd med NTP-mål og Kystverkets havnesatsing',
    vulnerabilityNote: 'Lavest klimafotavtrykk per tonn-km og minimal vinterstengningsrisiko',
  },
  {
    id: 'mkt_air_intercont',
    name: 'Asia og Nord-Amerika (Fersk flyfrakt via OSL)',
    stage: 'market',
    stageLabel: 'Eksportknutepunkt & Marked',
    color: '#065f46',
    aisDetail: 'Høyest eksportverdi per tonn (ca. 95–110 kr/kg) via Oslo lufthavn Gardermoen',
    vulnerabilityNote: 'Krever sømløs kobling mellom nordnorske korridorer, Ofotbanen og OSL',
  },
];

// Total across origins = 725,000 tonnes & 46.0 billion NOK (matching NTP PDF Page 4)
const FLOW_LINKS: FlowLinkDatum[] = [
  // 1. Vesterålen, Lofoten og Ofoten (215,000 t | 13.8 mrd kr)
  {
    source: 'orig_vesteralen',
    target: 'mode_road',
    tonnes: 103200,
    valueBillionNok: 6.62,
    aisThousandNm: 2100,
    routeNote: 'E10 Kong Olavs veg → E6 / E45 med termovogntog',
  },
  {
    source: 'orig_vesteralen',
    target: 'mode_rail',
    tonnes: 90300,
    valueBillionNok: 5.8,
    aisThousandNm: 1850,
    routeNote: 'Omlasting i Narvik terminal til Ofotbanen (ARE/sjømattog)',
  },
  {
    source: 'orig_vesteralen',
    target: 'mode_sea',
    tonnes: 13500,
    valueBillionNok: 0.86,
    aisThousandNm: 580,
    routeNote: 'Kystfrakt fra Sortland/Svolvær langs Kystverkets stamled',
  },
  {
    source: 'orig_vesteralen',
    target: 'mode_air',
    tonnes: 8000,
    valueBillionNok: 0.52,
    aisThousandNm: 270,
    routeNote: 'Tilbringer til Evenes / OSL for interkontinental flyfrakt',
  },

  // 2. Senja og Midt-Troms (168,000 t | 10.6 mrd kr)
  {
    source: 'orig_senja',
    target: 'mode_road',
    tonnes: 107520,
    valueBillionNok: 6.78,
    aisThousandNm: 2240,
    routeNote: 'Fv. 86 Senja → E6 Nordkjosbotn / Sverige',
  },
  {
    source: 'orig_senja',
    target: 'mode_rail',
    tonnes: 43680,
    valueBillionNok: 2.76,
    aisThousandNm: 980,
    routeNote: 'Innmating med bil til Narvik godsterminal (Ofotbanen)',
  },
  {
    source: 'orig_senja',
    target: 'mode_sea',
    tonnes: 10800,
    valueBillionNok: 0.68,
    aisThousandNm: 450,
    routeNote: 'Direkte sjøfrakt fra Senja/Finnsnes via Gisundet',
  },
  {
    source: 'orig_senja',
    target: 'mode_air',
    tonnes: 6000,
    valueBillionNok: 0.38,
    aisThousandNm: 230,
    routeNote: 'Høyverdi laks via Bardufoss/Evenes/OSL',
  },

  // 3. Tromsø og Nord-Troms (124,000 t | 7.9 mrd kr)
  {
    source: 'orig_tromso',
    target: 'mode_road',
    tonnes: 89280,
    valueBillionNok: 5.69,
    aisThousandNm: 2150,
    routeNote: 'E8 Skibotndalen (Finland-korridor) og E6 sørover',
  },
  {
    source: 'orig_tromso',
    target: 'mode_rail',
    tonnes: 17360,
    valueBillionNok: 1.11,
    aisThousandNm: 490,
    routeNote: 'Omlasting Narvik terminal for videre togtransport',
  },
  {
    source: 'orig_tromso',
    target: 'mode_sea',
    tonnes: 11160,
    valueBillionNok: 0.71,
    aisThousandNm: 520,
    routeNote: 'Sjøfrakt fra Skjervøy og Tromsø havn',
  },
  {
    source: 'orig_tromso',
    target: 'mode_air',
    tonnes: 6200,
    valueBillionNok: 0.39,
    aisThousandNm: 240,
    routeNote: 'Flyfrakt fra Tromsø lufthavn Langnes (TOS) og OSL',
  },

  // 4. Vest-Finnmark og Varanger (112,000 t | 7.1 mrd kr)
  {
    source: 'orig_finnmark',
    target: 'mode_road',
    tonnes: 87360,
    valueBillionNok: 5.54,
    aisThousandNm: 2890,
    routeNote: 'E6 Sennalandet og E45 Kautokeino gjennom Finland/Sverige',
  },
  {
    source: 'orig_finnmark',
    target: 'mode_rail',
    tonnes: 6720,
    valueBillionNok: 0.43,
    aisThousandNm: 310,
    routeNote: 'Kombitransport via Narvik / Rovaniemi',
  },
  {
    source: 'orig_finnmark',
    target: 'mode_sea',
    tonnes: 11920,
    valueBillionNok: 0.75,
    aisThousandNm: 760,
    routeNote: 'Kystrute fra Båtsfjord, Hammerfest og Kirkenes',
  },
  {
    source: 'orig_finnmark',
    target: 'mode_air',
    tonnes: 6000,
    valueBillionNok: 0.38,
    aisThousandNm: 240,
    routeNote: 'Fersk kongekrabbe og laks via Alta/Lakselv/OSL',
  },

  // 5. Gildeskål, Salten og Helgeland (106,000 t | 6.6 mrd kr)
  {
    source: 'orig_salten',
    target: 'mode_road',
    tonnes: 72080,
    valueBillionNok: 4.49,
    aisThousandNm: 2050,
    routeNote: 'Kystriksvegen Fv. 17 → E6 Saltfjellet sørover til Osloområdet',
  },
  {
    source: 'orig_salten',
    target: 'mode_rail',
    tonnes: 21200,
    valueBillionNok: 1.32,
    aisThousandNm: 590,
    routeNote: 'Nordlandsbanen fra Bodø og Mo i Rana mot Trondheim/Oslo',
  },
  {
    source: 'orig_salten',
    target: 'mode_sea',
    tonnes: 7720,
    valueBillionNok: 0.48,
    aisThousandNm: 460,
    routeNote: 'Brønnbåt- og stykkgodsfrakt langs Helgelandskysten',
  },
  {
    source: 'orig_salten',
    target: 'mode_air',
    tonnes: 5000,
    valueBillionNok: 0.31,
    aisThousandNm: 200,
    routeNote: 'Fersk sjømat til OSL for videre interkontinental flyfrakt',
  },

  // Stage 2 -> Stage 3 (Transport Modes -> Export Hubs & End Markets)
  // From Road (Total 459,440 t | 29.12 mrd kr)
  {
    source: 'mode_road',
    target: 'mkt_eu_land',
    tonnes: 382440,
    valueBillionNok: 24.18,
    aisThousandNm: 9430,
    routeNote: 'Grensekryssende vogntog via Svinesund/Ørje og Sverige til EU',
  },
  {
    source: 'mode_road',
    target: 'mkt_sea_global',
    tonnes: 38000,
    valueBillionNok: 2.38,
    aisThousandNm: 1100,
    routeNote: 'Tilførsel på veg til kysthavner og RoRo-linjer mot Storbritannia/Kontinentet',
  },
  {
    source: 'mode_road',
    target: 'mkt_air_intercont',
    tonnes: 39000,
    valueBillionNok: 2.56,
    aisThousandNm: 900,
    routeNote: 'Termovogntog direkte til flyfraktterminal ved Oslo lufthavn (OSL)',
  },

  // From Rail (Total 179,260 t | 11.42 mrd kr)
  {
    source: 'mode_rail',
    target: 'mkt_eu_land',
    tonnes: 149260,
    valueBillionNok: 9.48,
    aisThousandNm: 3420,
    routeNote: 'Direktetog på Ofotbanen/Sverige og Alnabru mot Padborg/Kontinentet',
  },
  {
    source: 'mode_rail',
    target: 'mkt_sea_global',
    tonnes: 16000,
    valueBillionNok: 1.0,
    aisThousandNm: 450,
    routeNote: 'Intermodal omlasting fra jernbane til eksportskip i sør- og vestnorske havner',
  },
  {
    source: 'mode_rail',
    target: 'mkt_air_intercont',
    tonnes: 14000,
    valueBillionNok: 0.94,
    aisThousandNm: 350,
    routeNote: 'Sjømattog fra Narvik/Bodø til OSL-regionen for flyeksport til Asia/USA',
  },

  // From Sea (Total 55,100 t | 3.48 mrd kr)
  {
    source: 'mode_sea',
    target: 'mkt_sea_global',
    tonnes: 55100,
    valueBillionNok: 3.48,
    aisThousandNm: 2770,
    routeNote: 'Direkte sjøtransport langs Kystverkets stamled til Hirtshals, Rotterdam og UK',
  },

  // From Air (Total 31,200 t | 1.98 mrd kr)
  {
    source: 'mode_air',
    target: 'mkt_air_intercont',
    tonnes: 31200,
    valueBillionNok: 1.98,
    aisThousandNm: 1180,
    routeNote: 'Direkte og samlastet flyfrakt via Avinors knutepunkter til Asia og Nord-Amerika',
  },
];

interface SeafoodD3FlowDiagramProps {
  selectedCorridorId?: string;
  onSelectOriginCorridor?: (corridorId: string) => void;
}

const ORIGIN_ID_TO_CORRIDOR_MAP: Record<string, string> = {
  orig_vesteralen: 'vesteralen-lofoten',
  orig_senja: 'senja-midt-troms',
  orig_tromso: 'tromso-nord-troms',
  orig_finnmark: 'vest-finnmark-varanger',
  orig_salten: 'salten-helgeland',
};

const CORRIDOR_TO_ORIGIN_ID_MAP: Record<string, string> = {
  'vesteralen-lofoten': 'orig_vesteralen',
  'senja-midt-troms': 'orig_senja',
  'tromso-nord-troms': 'orig_tromso',
  'vest-finnmark-varanger': 'orig_finnmark',
  'salten-helgeland': 'orig_salten',
};

export const SeafoodD3FlowDiagram: React.FC<SeafoodD3FlowDiagramProps> = ({
  selectedCorridorId,
  onSelectOriginCorridor,
}) => {
  const [metricMode, setMetricMode] = useState<FlowMetricMode>('tonnes');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null);

  const activeNodeId =
    focusedNodeId ||
    (selectedCorridorId ? CORRIDOR_TO_ORIGIN_ID_MAP[selectedCorridorId] || null : null);

  // Build D3 Sankey layout dynamically based on selected metricMode
  const sankeyGraph = useMemo(() => {
    const width = 980;
    const height = 430;

    const nodesInput: FlowNodeDatum[] = FLOW_NODES.map((n) => ({ ...n }));
    const linksInput: Array<FlowLinkDatum & { value: number }> = FLOW_LINKS.map((l) => ({
      ...l,
      value:
        metricMode === 'tonnes'
          ? l.tonnes
          : metricMode === 'value_nok'
          ? l.valueBillionNok
          : l.aisThousandNm,
    }));

    const sankeyGenerator = d3Sankey<FlowNodeDatum, FlowLinkDatum & { value: number }>()
      .nodeId((d) => d.id)
      .nodeWidth(18)
      .nodePadding(18)
      .extent([
        [16, 26],
        [width - 16, height - 18],
      ]);

    const graph = sankeyGenerator({
      nodes: nodesInput,
      links: linksInput,
    });

    return {
      width,
      height,
      nodes: graph.nodes as Array<SankeyNode<FlowNodeDatum, FlowLinkDatum & { value: number }>>,
      links: graph.links as Array<SankeyLink<FlowNodeDatum, FlowLinkDatum & { value: number }>>,
    };
  }, [metricMode]);

  const formatMetricValue = (val: number) => {
    if (metricMode === 'tonnes') {
      return `${Math.round(val).toLocaleString('nb-NO')} tonn`;
    }
    if (metricMode === 'value_nok') {
      return `${val.toFixed(2)} mrd. kr`;
    }
    return `${(val / 1000).toFixed(2)} mill. nm (AIS)`;
  };

  // Determine whether a link or node is connected to the currently active/focused node
  const isLinkHighlighted = (
    link: SankeyLink<FlowNodeDatum, FlowLinkDatum & { value: number }>,
    idx: number
  ) => {
    if (hoveredLinkIndex !== null) {
      return idx === hoveredLinkIndex;
    }
    if (!activeNodeId) return true;
    const src = link.source as SankeyNode<FlowNodeDatum, FlowLinkDatum & { value: number }>;
    const tgt = link.target as SankeyNode<FlowNodeDatum, FlowLinkDatum & { value: number }>;
    return src.id === activeNodeId || tgt.id === activeNodeId;
  };

  const activeInspectionSummary = useMemo(() => {
    if (hoveredLinkIndex !== null && sankeyGraph.links[hoveredLinkIndex]) {
      const lnk = sankeyGraph.links[hoveredLinkIndex];
      const src = lnk.source as SankeyNode<FlowNodeDatum, FlowLinkDatum & { value: number }>;
      const tgt = lnk.target as SankeyNode<FlowNodeDatum, FlowLinkDatum & { value: number }>;
      return {
        type: 'Strøm / Korridorlenke',
        title: `${src.name} → ${tgt.name}`,
        tonnes: lnk.tonnes,
        valueNok: lnk.valueBillionNok,
        aisNm: lnk.aisThousandNm / 1000,
        detail: lnk.routeNote,
        subDetail: src.aisDetail,
      };
    }

    if (activeNodeId) {
      const nd = sankeyGraph.nodes.find((n) => n.id === activeNodeId);
      if (nd) {
        const connectedLinks = FLOW_LINKS.filter(
          (l) => l.source === nd.id || l.target === nd.id
        );
        // For intermediate corridor nodes, only sum incoming links to avoid double counting
        const sumBase =
          nd.stage === 'corridor'
            ? FLOW_LINKS.filter((l) => l.target === nd.id)
            : connectedLinks;
        const totTonnes = sumBase.reduce((a, b) => a + b.tonnes, 0);
        const totVal = sumBase.reduce((a, b) => a + b.valueBillionNok, 0);
        const totAis = sumBase.reduce((a, b) => a + b.aisThousandNm, 0) / 1000;

        return {
          type: nd.stageLabel,
          title: nd.name,
          tonnes: totTonnes,
          valueNok: totVal,
          aisNm: totAis,
          detail: nd.aisDetail,
          subDetail: nd.vulnerabilityNote,
        };
      }
    }

    return {
      type: 'Hele verdikjeden (Nord-Norge Sjømat & Kystverket AIS)',
      title: 'Samlet gods- og verdistrøm: 5 kystregioner → 4 transportformer → 3 eksportmarkeder',
      tonnes: 725000,
      valueNok: 46.0,
      aisNm: 19.6,
      detail:
        'Kystverket AIS Norge registrerer 19,6 mill. nm utseilt distanse for lasteskip/sjømatfartøy og 11,4 mill. nm for fiskefartøy/brønnbåt.',
      subDetail:
        'Klikk på en kystregion, transportform eller strømlinje i D3-flytdiagrammet for å isolere verdikjeden.',
    };
  }, [hoveredLinkIndex, activeNodeId, sankeyGraph]);

  const pathGenerator = useMemo(() => sankeyLinkHorizontal(), []);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-5">
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
            <span>Interaktivt D3.js Sankey-flytdiagram</span>
            <span aria-hidden="true">·</span>
            <span>Kystverket AIS · Statens vegvesen · Bane NOR · Avinor</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mt-0.5">
            Verdikjede og modalstrømmer for nordnorsk sjømat (725 000 tonn · 46,0 mrd. kr)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
            <button
              onClick={() => setMetricMode('tonnes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                metricMode === 'tonnes'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Godsvolum (725 000 tonn)
            </button>
            <button
              onClick={() => setMetricMode('value_nok')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                metricMode === 'value_nok'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eksportverdi (46,0 mrd. kr)
            </button>
            <button
              onClick={() => setMetricMode('ais_nm')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                metricMode === 'ais_nm'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kystverket AIS-intensitet (nm)
            </button>
          </div>

          {activeNodeId && (
            <button
              onClick={() => setFocusedNodeId(null)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Vis alle strømmer</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage Column Headers */}
      <div className="grid grid-cols-3 text-xs font-semibold text-slate-600 px-2">
        <div>1. OPPRINNELSESREGION & KYSTVERKET AIS-SONE</div>
        <div className="text-center">2. TRANSPORTKORRIDOR (VEG · BANE · SJØ · LUFT)</div>
        <div className="text-right">3. EKSPORTKNUTEPUNKT & SLUTTMARKED</div>
      </div>

      {/* D3.js Sankey SVG Canvas */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto">
        <div className="min-w-[780px]">
          <svg
            viewBox={`0 0 ${sankeyGraph.width} ${sankeyGraph.height}`}
            className="w-full h-[410px] select-none"
            role="img"
            aria-label="D3 Sankey-flytdiagram over sjømatvolum, verdi og AIS-aktivitet langs transportkorridorene"
          >
            {/* Render Sankey Links */}
            <g fill="none">
              {sankeyGraph.links.map((link, idx) => {
                const dPath = pathGenerator(link as never) || '';
                const src = link.source as SankeyNode<
                  FlowNodeDatum,
                  FlowLinkDatum & { value: number }
                >;
                const tgt = link.target as SankeyNode<
                  FlowNodeDatum,
                  FlowLinkDatum & { value: number }
                >;
                const highlighted = isLinkHighlighted(link, idx);
                const strokeColor =
                  src.stage === 'origin' ? src.color : tgt.color;

                return (
                  <path
                    key={`link-${idx}`}
                    d={dPath}
                    stroke={strokeColor}
                    strokeWidth={Math.max(2, link.width || 2)}
                    strokeOpacity={highlighted ? 0.52 : 0.1}
                    className="transition-opacity duration-150 cursor-pointer hover:stroke-opacity-80"
                    onMouseEnter={() => setHoveredLinkIndex(idx)}
                    onMouseLeave={() => setHoveredLinkIndex(null)}
                    onClick={() => {
                      setFocusedNodeId((curr) =>
                        curr === src.id ? null : src.id
                      );
                      if (
                        src.stage === 'origin' &&
                        onSelectOriginCorridor &&
                        ORIGIN_ID_TO_CORRIDOR_MAP[src.id]
                      ) {
                        onSelectOriginCorridor(ORIGIN_ID_TO_CORRIDOR_MAP[src.id]);
                      }
                    }}
                  >
                    <title>
                      {`${src.name} → ${tgt.name}: ${link.tonnes.toLocaleString(
                        'nb-NO'
                      )} tonn · ${link.valueBillionNok.toFixed(2)} mrd. kr (${
                        link.routeNote
                      })`}
                    </title>
                  </path>
                );
              })}
            </g>

            {/* Render Sankey Nodes & Labels */}
            <g>
              {sankeyGraph.nodes.map((node) => {
                const x0 = node.x0 ?? 0;
                const x1 = node.x1 ?? 0;
                const y0 = node.y0 ?? 0;
                const y1 = node.y1 ?? 0;
                const nodeW = Math.max(14, x1 - x0);
                const nodeH = Math.max(8, y1 - y0);
                const isSelected = activeNodeId === node.id;
                const isLeft = x0 < sankeyGraph.width / 2;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => {
                      const nextId = focusedNodeId === node.id ? null : node.id;
                      setFocusedNodeId(nextId);
                      if (
                        node.stage === 'origin' &&
                        onSelectOriginCorridor &&
                        ORIGIN_ID_TO_CORRIDOR_MAP[node.id]
                      ) {
                        onSelectOriginCorridor(ORIGIN_ID_TO_CORRIDOR_MAP[node.id]);
                      }
                    }}
                  >
                    <rect
                      x={x0}
                      y={y0}
                      width={nodeW}
                      height={nodeH}
                      rx={2}
                      fill={node.color}
                      stroke={isSelected ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 1}
                    >
                      <title>{`${node.name}: ${formatMetricValue(node.value || 0)}`}</title>
                    </rect>

                    {/* Node Label */}
                    <text
                      x={isLeft ? x1 + 8 : x0 - 8}
                      y={(y0 + y1) / 2 - 5}
                      textAnchor={isLeft ? 'start' : 'end'}
                      className={`text-[11px] font-sans ${
                        isSelected
                          ? 'fill-slate-950 font-bold'
                          : 'fill-slate-900 font-semibold'
                      }`}
                    >
                      {node.name}
                    </text>

                    {/* Quantitative Value Readout in Monospace */}
                    <text
                      x={isLeft ? x1 + 8 : x0 - 8}
                      y={(y0 + y1) / 2 + 9}
                      textAnchor={isLeft ? 'start' : 'end'}
                      className="fill-slate-600 text-[10px] font-mono"
                    >
                      {formatMetricValue(node.value || 0)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Live Inspection Readout Strip for Selected Node or Link */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-sky-900">
                {activeInspectionSummary.type}
              </span>
              <span aria-hidden="true">·</span>
              <span>Sanntids- og verdikjedeinspektør</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
              {activeInspectionSummary.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {activeInspectionSummary.detail}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeInspectionSummary.subDetail}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-6 text-xs">
            <div>
              <span className="text-slate-500 block">Godsvolum</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                {Math.round(activeInspectionSummary.tonnes).toLocaleString('nb-NO')} t
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {((activeInspectionSummary.tonnes / 725000) * 100).toFixed(1)} % av total
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Eksportverdi</span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-700 mt-0.5 block">
                {activeInspectionSummary.valueNok.toFixed(2)} mrd. kr
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {((activeInspectionSummary.valueNok / 46.0) * 100).toFixed(1)} % av verdi
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Kystverket AIS</span>
              <span className="text-base font-bold font-mono tabular-nums text-sky-900 mt-0.5 block">
                {activeInspectionSummary.aisNm.toFixed(2)} mill. nm
              </span>
              <span className="text-[11px] text-slate-500">Maritim tilknytning</span>
            </div>
          </div>
        </div>

        {/* Modal Share Summary Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span>
              <strong>Riksveg (SVV):</strong> 459 440 t (63,4 %)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Train className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Jernbane (Bane NOR):</strong> 179 260 t (24,7 %)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ship className="w-3.5 h-3.5 text-sky-800 shrink-0" />
            <span>
              <strong>Sjøfrakt (Kystverket):</strong> 55 100 t (7,6 %)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              <strong>Flyfrakt (Avinor):</strong> 31 200 t (4,3 %)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
