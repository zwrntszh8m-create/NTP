import React, { useState, useMemo } from 'react';
import {
  MOBILITET_360_CITIES,
  MOBILITET_360_STEPS,
  SEAFOOD_CORRIDORS,
} from '../data/ntpData';
import { SeafoodD3FlowDiagram } from './SeafoodD3FlowDiagram';
import {
  FileText,
  Car,
  Bus,
  Bike,
  Footprints,
  Zap,
  Ship,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MobilityAndFreightModuleProps {
  onOpenPdfPage: (page: number) => void;
}

export const MobilityAndFreightModule: React.FC<MobilityAndFreightModuleProps> = ({
  onOpenPdfPage,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(MOBILITET_360_CITIES[0].id);
  const [selectedMode, setSelectedMode] = useState<string>('Alle');
  const [selectedStep, setSelectedStep] = useState<number>(3);
  const [selectedSeafoodId, setSelectedSeafoodId] = useState<string>(SEAFOOD_CORRIDORS[0].id);
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState<string>('Alle');

  const activeCity = useMemo(() => {
    return (
      MOBILITET_360_CITIES.find((c) => c.id === selectedCityId) || MOBILITET_360_CITIES[0]
    );
  }, [selectedCityId]);

  const filteredSeafoodCorridors = useMemo(() => {
    if (vulnerabilityFilter === 'Alle') return SEAFOOD_CORRIDORS;
    return SEAFOOD_CORRIDORS.filter((c) => c.vulnerabilityScore === vulnerabilityFilter);
  }, [vulnerabilityFilter]);

  const activeSeafood = useMemo(() => {
    return (
      filteredSeafoodCorridors.find((c) => c.id === selectedSeafoodId) ||
      filteredSeafoodCorridors[0] ||
      SEAFOOD_CORRIDORS[0]
    );
  }, [filteredSeafoodCorridors, selectedSeafoodId]);

  const totalSeafoodTonnage = useMemo(
    () => SEAFOOD_CORRIDORS.reduce((acc, c) => acc + c.tonnage, 0),
    []
  );
  const totalSeafoodValue = useMemo(
    () => SEAFOOD_CORRIDORS.reduce((acc, c) => acc + c.exportValueBillionNok, 0),
    []
  );

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Bil':
        return <Car className="w-4 h-4 text-slate-700" />;
      case 'Kollektiv':
        return <Bus className="w-4 h-4 text-sky-800" />;
      case 'Sykling':
        return <Bike className="w-4 h-4 text-emerald-700" />;
      case 'Gange':
        return <Footprints className="w-4 h-4 text-teal-700" />;
      default:
        return <Zap className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: Mobilitet 360 – «Pulsen på byen» (PDF Page 7 & Page 4) */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Mobilitet 360 – «Pulsen på byen» (Side 7)</span>
              <span aria-hidden="true">·</span>
              <span>Byområder med byvekstavtaler</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              Inhouse datagrunnlag og innsiktsløsning for alle transportformer i byområder
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* City selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {MOBILITET_360_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCityId === city.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {city.city}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenPdfPage(7)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF s. 7</span>
            </button>
          </div>
        </div>

        {/* City Summary Metadata Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">Byvekstavtale:</span>
            <div className="font-semibold text-slate-900 mt-0.5">{activeCity.agreementName}</div>
          </div>
          <div>
            <span className="text-slate-500">Befolkningsgrunnlag:</span>
            <div className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
              {activeCity.population} innb.
            </div>
          </div>
          <div>
            <span className="text-slate-500">Aktive sensor- og tellepunkter:</span>
            <div className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
              {activeCity.activeCountingPoints} stasjoner · RVU n={activeCity.rvuSampleSize.toLocaleString('nb-NO')}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Nullvekstmål personbiltrafikk:</span>
            <div className="font-semibold text-slate-900 mt-0.5 inline-flex items-center gap-1.5">
              {activeCity.zeroGrowthStatus === 'I rute' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{activeCity.zeroGrowthStatus}</span>
            </div>
          </div>
        </div>

        {/* Main 12-Col Grid: Left 5-Mode Hub & Breakdown + Right Quarterly Index Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-stretch">
          {/* Left 6 cols: 5 Transport Modes from "360° Pulsen på byen" */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-900">
                  Fordeling og årsvekst per transportform ({activeCity.city})
                </h3>
                <button
                  onClick={() => setSelectedMode('Alle')}
                  className={`text-xs font-medium cursor-pointer ${
                    selectedMode === 'Alle' ? 'text-sky-800 underline' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Vis alle 5 i graf
                </button>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {activeCity.modes.map((m) => {
                  const isModeSelected = selectedMode === m.mode;
                  const isPositiveGoal =
                    (m.mode === 'Bil' && m.yoyChangePercent <= 0) ||
                    (m.mode !== 'Bil' && m.yoyChangePercent > 0);

                  return (
                    <button
                      key={m.mode}
                      onClick={() =>
                        setSelectedMode((curr) => (curr === m.mode ? 'Alle' : m.mode))
                      }
                      className={`w-full text-left p-4 transition-colors cursor-pointer ${
                        isModeSelected ? 'bg-sky-50/70' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          {getModeIcon(m.mode)}
                          <div>
                            <span className="text-sm font-semibold text-slate-900">
                              {m.mode}
                            </span>
                            <span className="text-xs text-slate-500 block">
                              {m.dataSource}
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono tabular-nums">
                          <div className="text-sm font-bold text-slate-900">
                            {m.sharePercent.toFixed(1)} % andel
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isPositiveGoal ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {m.yoyChangePercent > 0
                              ? `+${m.yoyChangePercent.toFixed(1)}`
                              : m.yoyChangePercent.toFixed(1)}{' '}
                            % siste år · {m.dailyTrips.toLocaleString('nb-NO')} reiser/døgn
                          </div>
                        </div>
                      </div>

                      {/* Horizontal share bar */}
                      <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.mode === 'Bil'
                              ? 'bg-slate-700'
                              : m.mode === 'Kollektiv'
                              ? 'bg-sky-700'
                              : m.mode === 'Sykling'
                              ? 'bg-emerald-600'
                              : m.mode === 'Gange'
                              ? 'bg-teal-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, m.sharePercent * 1.6)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 6 cols: Quarterly Trend Index SVG Chart + 3-Step Process */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800">
                  Indeksert trafikkutvikling (K1 2025 = 100) · {activeCity.city}
                </span>
                <span className="text-xs text-slate-500">
                  Filter: <strong>{selectedMode}</strong>
                </span>
              </div>

              <svg
                viewBox="0 0 560 220"
                className="w-full h-52 overflow-visible"
                role="img"
                aria-label="Kvartalsvis trafikkutvikling for bil, kollektiv, sykling, gange og mikromobilitet"
              >
                {[95, 100, 105, 110, 115, 120, 125, 130].map((val) => {
                  const y = 190 - ((val - 95) / 35) * 165;
                  return (
                    <g key={val}>
                      <line
                        x1={42}
                        y1={y}
                        x2={535}
                        y2={y}
                        stroke={val === 100 ? '#94a3b8' : '#e2e8f0'}
                        strokeDasharray={val === 100 ? undefined : '3 3'}
                        strokeWidth={1}
                      />
                      <text
                        x={34}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-slate-500 text-[10px] font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {activeCity.quarterlyIndex.map((q, idx) => {
                  const x = 60 + idx * 76;
                  return (
                    <text
                      key={q.quarter}
                      x={x}
                      y={210}
                      textAnchor="middle"
                      className="fill-slate-600 text-[10px] font-mono"
                    >
                      {q.quarter}
                    </text>
                  );
                })}

                {/* Lines for each mode */}
                {[
                  { key: 'bil', label: 'Bil', color: '#334155' },
                  { key: 'kollektiv', label: 'Kollektiv', color: '#0369a1' },
                  { key: 'sykling', label: 'Sykling', color: '#059669' },
                  { key: 'gange', label: 'Gange', color: '#0d9488' },
                  { key: 'mikromobilitet', label: 'Mikromobilitet', color: '#d97706' },
                ].map((series) => {
                  const isVisible = selectedMode === 'Alle' || selectedMode === series.label;
                  if (!isVisible) return null;

                  const points = activeCity.quarterlyIndex
                    .map((q, idx) => {
                      const x = 60 + idx * 76;
                      const val = q[series.key as keyof typeof q] as number;
                      const y = 190 - ((val - 95) / 35) * 165;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <g key={series.key}>
                      <polyline
                        fill="none"
                        stroke={series.color}
                        strokeWidth={selectedMode === series.label ? 3.2 : 2.2}
                        points={points}
                      />
                      {activeCity.quarterlyIndex.map((q, idx) => {
                        const x = 60 + idx * 76;
                        const val = q[series.key as keyof typeof q] as number;
                        const y = 190 - ((val - 95) / 35) * 165;
                        return (
                          <circle
                            key={`${series.key}-${idx}`}
                            cx={x}
                            cy={y}
                            r={3.5}
                            fill={series.color}
                            stroke="#ffffff"
                            strokeWidth={1.2}
                          >
                            <title>{`${series.label} (${q.quarter}): Indeks ${val.toFixed(1)}`}</title>
                          </circle>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-700 inline-block" /> Bil
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-700 inline-block" /> Kollektiv
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" /> Sykling
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 inline-block" /> Gange
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" /> Mikromobilitet
                </span>
              </div>
            </div>

            {/* "Slik kommer vi dit" 3-Step Roadmap from PDF Page 7 */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="text-xs font-semibold text-slate-800 mb-3">
                Mobilitet 360 — «Slik kommer vi dit» (3-trinns prosess fra PDF s. 7)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MOBILITET_360_STEPS.map((st) => {
                  const isActive = selectedStep === st.step;
                  return (
                    <button
                      key={st.step}
                      onClick={() => setSelectedStep(st.step)}
                      className={`text-left p-3 rounded-md border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-50/70 border-amber-400 text-slate-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-800">
                          Steg {st.step}
                        </span>
                        <span className="text-[11px] text-slate-500">{st.status}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-1">
                        {st.title}
                      </div>
                    </button>
                  );
                })}
              </div>
              {(() => {
                const stepObj =
                  MOBILITET_360_STEPS.find((s) => s.step === selectedStep) ||
                  MOBILITET_360_STEPS[2];
                return (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    <div>
                      <strong>Innhold i steg {stepObj.step}:</strong> {stepObj.description}
                    </div>
                    <div className="text-slate-500 mt-1">
                      <strong>Leveranse:</strong> {stepObj.deliverables}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Sjømat- og godskorridorer i Nord-Norge (725 000 tonn / 46 mrd. kr - PDF Page 4) */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Strekninger og godskorridorer (Side 4)</span>
              <span aria-hidden="true">·</span>
              <span>Sjømat Nord-Norge</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {totalSeafoodTonnage.toLocaleString('nb-NO')} tonn · {totalSeafoodValue.toFixed(0)} mrd. kr
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              Verdistrømmer, sårbarhet og korridoranalyse for sjømat fra Nord-Norge
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {['Alle', 'Høy', 'Moderat'].map((level) => (
                <button
                  key={level}
                  onClick={() => setVulnerabilityFilter(level)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    vulnerabilityFilter === level
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {level === 'Alle' ? 'Alle korridorer' : `${level} sårbarhet`}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenPdfPage(4)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Se kart i PDF s. 4</span>
            </button>
          </div>
        </div>

        {/* Interactive D3.js Sankey Value-Chain & Freight Volume Flow Diagram */}
        <div className="pt-6">
          <SeafoodD3FlowDiagram
            selectedCorridorId={activeSeafood.id}
            onSelectOriginCorridor={setSelectedSeafoodId}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-stretch">
          {/* Left 5 cols: Interactive Nord-Norge Corridor Map (modeled on Page 4 map: Helgeland, Gildeskål, Vesterålen, Senja, Tromsø, Vest-Finnmark, Varanger) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Geografisk verdistrømskart — Nord-Norge
                </h3>
                <span className="text-xs font-mono tabular-nums text-emerald-800 font-semibold">
                  725 000 tonn / 46 mrd. kr
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Klikk på en kystregion eller hovedkorridor for å se tonnasje, eksportverdi og transportmiddelfordeling.
              </p>

              <div className="mt-4 bg-white border border-slate-200 rounded-lg p-3">
                <svg
                  viewBox="0 0 380 280"
                  className="w-full h-64"
                  role="img"
                  aria-label="Kart over sjømatkorridorer i Nord-Norge fra Helgeland via Vesterålen og Senja til Vest-Finnmark og Varanger"
                >
                  {/* Simplified Northern Norway Coastline silhouette */}
                  <path
                    d="M45,260 L75,215 L105,175 L125,135 L165,105 L215,72 L275,45 L335,55 L350,85 L300,105 L245,125 L195,160 L150,205 L110,260 Z"
                    fill="#f1f5f9"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />

                  {/* Main E6 / Rail / Export Trunk Lines */}
                  <polyline
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={3}
                    points="65,245 100,190 140,145 185,115 235,85 315,72"
                  />
                  {/* Ofotbanen branch from Narvik to Sweden */}
                  <line
                    x1={140}
                    y1={145}
                    x2={195}
                    y2={175}
                    stroke="#b45309"
                    strokeWidth={3.5}
                    strokeDasharray="5 3"
                  />
                  <text x={182} y={190} className="fill-amber-900 text-[9px] font-mono font-semibold">
                    Ofotbanen (Narvik)
                  </text>

                  {/* Interactive Corridor Nodes */}
                  {[
                    {
                      id: 'salten-helgeland',
                      x: 78,
                      y: 222,
                      short: 'Salten / Helgeland',
                      sub: '106k t · 6,6 mrd.',
                    },
                    {
                      id: 'vesteralen-lofoten',
                      x: 122,
                      y: 148,
                      short: 'Vesterålen / Ofoten',
                      sub: '215k t · 13,8 mrd.',
                    },
                    {
                      id: 'senja-midt-troms',
                      x: 168,
                      y: 118,
                      short: 'Senja / Midt-Troms',
                      sub: '168k t · 10,6 mrd.',
                    },
                    {
                      id: 'tromso-nord-troms',
                      x: 218,
                      y: 88,
                      short: 'Tromsø / Skjervøy',
                      sub: '124k t · 7,9 mrd.',
                    },
                    {
                      id: 'vest-finnmark-varanger',
                      x: 295,
                      y: 68,
                      short: 'Vest-Finnmark / Varanger',
                      sub: '112k t · 7,1 mrd.',
                    },
                  ].map((node) => {
                    const isSelected = activeSeafood.id === node.id;
                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedSeafoodId(node.id)}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isSelected ? 9 : 6}
                          fill={isSelected ? '#0369a1' : '#0f766e'}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                        <rect
                          x={node.x + 11}
                          y={node.y - 12}
                          width={126}
                          height={26}
                          rx={3}
                          fill={isSelected ? '#0f172a' : '#ffffff'}
                          stroke={isSelected ? '#0f172a' : '#cbd5e1'}
                          strokeWidth={1}
                        />
                        <text
                          x={node.x + 16}
                          y={node.y - 1}
                          className={`text-[9.5px] font-semibold ${
                            isSelected ? 'fill-white' : 'fill-slate-900'
                          }`}
                        >
                          {node.short}
                        </text>
                        <text
                          x={node.x + 16}
                          y={node.y + 10}
                          className={`text-[8.5px] font-mono ${
                            isSelected ? 'fill-sky-200' : 'fill-slate-600'
                          }`}
                        >
                          {node.sub}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5 text-sky-800" />
                <span>Total: 725 000 tonn · 46 mrd. kr eksportverdi</span>
              </span>
              <span className="font-mono text-slate-500">Kilde: Godsmodellen / SSB</span>
            </div>
          </div>

          {/* Right 7 cols: Corridor Table & Selected Corridor Inspector */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">Kystregion og knutepunkter</th>
                    <th className="py-3 px-4 text-right">Volum (tonn)</th>
                    <th className="py-3 px-4 text-right">Verdi (mrd. kr)</th>
                    <th className="py-3 px-4 text-right">Veg / Bane / Sjø</th>
                    <th className="py-3 px-4 text-right">Vinterstengt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredSeafoodCorridors.map((corr) => {
                    const isSelected = corr.id === activeSeafood.id;
                    return (
                      <tr
                        key={corr.id}
                        onClick={() => setSelectedSeafoodId(corr.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-sky-50/80' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{corr.region}</div>
                          <div className="text-slate-500 mt-0.5">{corr.keyNodes}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                          {corr.tonnage.toLocaleString('nb-NO')} t
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                          {corr.exportValueBillionNok.toFixed(1)} mrd.
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                          {corr.roadSharePercent}% / {corr.railSharePercent}% / {corr.seaAirSharePercent}%
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-800">
                          {corr.winterClosureHoursPerYear} t/år
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Active Corridor Detail Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-500">
                    Valgt sjømatkorridor · Sårbarhetsvurdering: {activeSeafood.vulnerabilityScore}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 mt-0.5">
                    {activeSeafood.region} ({activeSeafood.tonnage.toLocaleString('nb-NO')} tonn ·{' '}
                    {activeSeafood.exportValueBillionNok.toFixed(1)} mrd. kr)
                  </h4>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-700">
                  Hovedakse: {activeSeafood.primaryRoute}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Dynamiske data om regularitet, kolonnekjøring ({activeSeafood.winterClosureHoursPerYear} timer/år), reisetid og godsoverføring mellom riksveg og bane gjør det mulig å målrette skredsikring, krysningsspor og beredskap der verdiskapingen per time stengt veg er høyest.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
