import React, { useState, useMemo } from 'react';
import {
  STRATEGIC_DRIVERS,
  NTP_NEEDS_AND_TOOLS,
  MODEL_CALIBRATION_SERIES,
  EFFECT_EVALUATION_CASES,
  AgencyId,
} from '../data/ntpData';
import { ArrowUpRight, FileText, CheckCircle2, SlidersHorizontal, TrendingUp } from 'lucide-react';

interface StrategicOverviewModuleProps {
  selectedAgency: AgencyId;
  onNavigateTab: (tab: 'oversikt' | 'etatsdata' | 'e16-inrix' | 'mobilitet-gods') => void;
  onOpenPdfPage: (page: number) => void;
}

export const StrategicOverviewModule: React.FC<StrategicOverviewModuleProps> = ({
  selectedAgency,
  onNavigateTab,
  onOpenPdfPage,
}) => {
  const [activeDriverId, setActiveDriverId] = useState<string>(STRATEGIC_DRIVERS[0].id);
  const [selectedMeasureType, setSelectedMeasureType] = useState<string>('Alle');
  const [showStaticForecast, setShowStaticForecast] = useState<boolean>(true);
  const [showObservedSensor, setShowObservedSensor] = useState<boolean>(true);
  const [showCalibratedModel, setShowCalibratedModel] = useState<boolean>(true);
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number>(5); // Default 2026

  const filteredDrivers = useMemo(() => {
    if (selectedAgency === 'alle') return STRATEGIC_DRIVERS;
    return STRATEGIC_DRIVERS.filter((d) => d.agencies.includes(selectedAgency));
  }, [selectedAgency]);

  const activeDriver = useMemo(() => {
    return (
      filteredDrivers.find((d) => d.id === activeDriverId) ||
      filteredDrivers[0] ||
      STRATEGIC_DRIVERS[0]
    );
  }, [filteredDrivers, activeDriverId]);

  const filteredNeeds = NTP_NEEDS_AND_TOOLS;

  const filteredEffectCases = useMemo(() => {
    if (selectedMeasureType === 'Alle') return EFFECT_EVALUATION_CASES;
    return EFFECT_EVALUATION_CASES.filter((c) => c.measureType === selectedMeasureType);
  }, [selectedMeasureType]);

  const hoveredPoint = MODEL_CALIBRATION_SERIES[hoveredYearIndex] || MODEL_CALIBRATION_SERIES[5];

  return (
    <div className="space-y-10">
      {/* Top 4 Quantitative KPI Strip (Single-elevation border grid) */}
      <section aria-label="Nøkkeltall fra NTP 2029–2040 datagrunnlag">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Sanntidskorridor E16 / Rv7</span>
                <span aria-hidden="true">·</span>
                <span>SVV & Inrix</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  57,2 km
                </span>
                <span className="text-xs font-mono tabular-nums text-amber-700">
                  ÅDT 22 480 kjt
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Sokna – Hønefoss – Sollihøgda/Skaret koblet mot Statens vegvesens tellepunkter (14,6 % tungbil) og Inrix.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('e16-inrix')}
                className="text-xs font-medium text-sky-800 hover:text-sky-950 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Åpne kø- og strekningsanalyse</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenPdfPage(5)}
                className="text-xs text-slate-500 hover:text-slate-800 font-mono tabular-nums whitespace-nowrap shrink-0 cursor-pointer"
              >
                PDF s. 5
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Sjømat & Godskorridorer</span>
                <span aria-hidden="true">·</span>
                <span>Bane · Kyst · Veg</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  725 000 t
                </span>
                <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
                  46 mrd. kr
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Nordnorsk sjømatvolum, 33,5 mill. tonn jernbanegods (+11,9 %) og 51,4 mill. nm AIS-seilingsdistanse.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('mobilitet-gods')}
                className="text-xs font-medium text-sky-800 hover:text-sky-950 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Utforsk sjømat- og tellepunkter</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenPdfPage(4)}
                className="text-xs text-slate-500 hover:text-slate-800 font-mono tabular-nums whitespace-nowrap shrink-0 cursor-pointer"
              >
                PDF s. 4
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Jernbane, Luftfart & Byvekst</span>
                <span aria-hidden="true">·</span>
                <span>Ferske etatstall</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  84,2M / 53,2M
                </span>
                <span className="text-xs font-mono tabular-nums text-emerald-700">
                  87,6 % punktl. tog
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                84,2 mill. togreiser (+2,7 %), 53,2 mill. flypassasjerer (+2,8 %) og -1,4 % personbil i byområdene.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('etatsdata')}
                className="text-xs font-medium text-sky-800 hover:text-sky-950 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Se alle 6 virksomheters ferske tall</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenPdfPage(7)}
                className="text-xs text-slate-500 hover:text-slate-800 font-mono tabular-nums whitespace-nowrap shrink-0 cursor-pointer"
              >
                PDF s. 7
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Mobilitet 360</span>
                <span aria-hidden="true">·</span>
                <span>«Pulsen på byen» (Byvekst)</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  +14,2 %
                </span>
                <span className="text-xs font-mono tabular-nums text-emerald-700">
                  Sykkelindeks 2025
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Løpende byindeks for bil (-1,4 %), kollektiv (+6,8 %), sykkel (+14,2 %) og gange (+4,5 %) fra tellepunkter og APC.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('mobilitet-gods')}
                className="text-xs font-medium text-sky-800 hover:text-sky-950 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Se Mobilitet 360 og byindeks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenPdfPage(11)}
                className="text-xs text-slate-500 hover:text-slate-800 font-mono tabular-nums whitespace-nowrap shrink-0 cursor-pointer"
              >
                PDF s. 11
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Hvorfor mer datadrevet NTP 2029–2040 (7 Strategic Drivers) */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>NTP 2029–2040</span>
              <span aria-hidden="true">·</span>
              <span>Kunnskapsgrunnlag (Side 2 i presentasjonen)</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              Hvorfor mer datadrevet transportplanlegging
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Viser {filteredDrivers.length} av 7 målområder
            </span>
            <button
              onClick={() => onOpenPdfPage(2)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Vis side 2 i PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-stretch">
          {/* Left column: 7 clickable strategic drivers */}
          <div className="lg:col-span-5 divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {filteredDrivers.map((driver) => {
              const isSelected = driver.id === activeDriver.id;
              return (
                <button
                  key={driver.id}
                  onClick={() => setActiveDriverId(driver.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/80 text-slate-950'
                      : 'bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tabular-nums font-semibold text-sky-800">
                        {driver.number}.
                      </span>
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {driver.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                      {driver.summary}
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                    {driver.keyMetricsValue}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right column: Detailed inspection of the selected strategic driver */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-mono font-semibold text-sky-800">
                    Målområde {activeDriver.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeDriver.keyMetricsLabel}: {activeDriver.keyMetricsValue}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Kilde: NTP-presentasjon s. {activeDriver.pdfPage}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {activeDriver.title}
              </h3>

              <p className="mt-3 text-sm text-slate-800 leading-relaxed bg-white border border-slate-200 rounded-md p-4">
                «{activeDriver.pdfQuote}»
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white border border-slate-200 rounded-md p-4">
                  <div className="text-xs text-slate-500 font-medium">
                    Tradisjonell praksis (Før)
                  </div>
                  <div className="text-sm font-medium text-slate-900 mt-1">
                    {activeDriver.beforeState}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-4">
                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Målbilde NTP 2029–2040</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {activeDriver.targetState}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Tilhørende verktøy og datakilder: </span>
                <span>{activeDriver.relatedTools.join(' · ')}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigateTab('e16-inrix')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  Se strekningseksempel (E16/Rv7)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Bedre transportmodeller (RTM, NTM, Gods) & Effektmåling */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Modellkalibrering og effektmåling</span>
              <span aria-hidden="true">·</span>
              <span>RTM · NTM · Godsmodellen · Effekt</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              Fra statiske prognoser til kontinuerlig kalibrering og før/etter-analyse
            </h2>
          </div>

          {/* Series toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowStaticForecast((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showStaticForecast
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Statisk NTP-prognose
            </button>
            <button
              onClick={() => setShowObservedSensor((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showObservedSensor
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Faktisk observert (Sensordata)
            </button>
            <button
              onClick={() => setShowCalibratedModel((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showCalibratedModel
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Kalibrert RTM / NTM
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Interactive SVG Chart: Prognose vs Faktisk utvikling */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-600">
                  Trafikk- og etterspørselsindeks (2021 = 100) · Klikk eller pek på år for avviksanalyse
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-700">
                  Valgt år: <strong>{hoveredPoint.year}</strong>
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <svg
                  viewBox="0 0 640 250"
                  className="w-full h-60 overflow-visible"
                  role="img"
                  aria-label="Sammenligning av statisk prognose og kontinuerlig sensorkalibrert transportmodell"
                >
                  {/* Horizontal grid lines (Index 98 to 120) */}
                  {[100, 105, 110, 115, 120].map((val) => {
                    const y = 210 - ((val - 98) / 22) * 180;
                    return (
                      <g key={val}>
                        <line
                          x1={48}
                          y1={y}
                          x2={610}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray={val === 100 ? undefined : '4 4'}
                          strokeWidth={1}
                        />
                        <text
                          x={40}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-500 text-[11px] font-mono"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* X-axis labels and interactive vertical hover bands */}
                  {MODEL_CALIBRATION_SERIES.map((item, idx) => {
                    const x = 65 + idx * 75;
                    const isHovered = idx === hoveredYearIndex;
                    return (
                      <g
                        key={item.year}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredYearIndex(idx)}
                        onClick={() => setHoveredYearIndex(idx)}
                      >
                        {isHovered && (
                          <line
                            x1={x}
                            y1={20}
                            x2={x}
                            y2={210}
                            stroke="#94a3b8"
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                          />
                        )}
                        <text
                          x={x}
                          y={232}
                          textAnchor="middle"
                          className={`text-[11px] font-mono ${
                            isHovered ? 'fill-slate-950 font-semibold' : 'fill-slate-500'
                          }`}
                        >
                          {item.year.replace(' (Kalibrert)', '*')}
                        </text>
                        <rect
                          x={x - 32}
                          y={15}
                          width={64}
                          height={205}
                          fill="transparent"
                        />
                      </g>
                    );
                  })}

                  {/* Static Forecast Line */}
                  {showStaticForecast && (
                    <polyline
                      fill="none"
                      stroke="#475569"
                      strokeWidth={2.25}
                      strokeDasharray="6 4"
                      points={MODEL_CALIBRATION_SERIES.map((item, idx) => {
                        const x = 65 + idx * 75;
                        const y = 210 - ((item.staticForecastIndex - 98) / 22) * 180;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}

                  {/* Calibrated Model Line */}
                  {showCalibratedModel && (
                    <polyline
                      fill="none"
                      stroke="#15803d"
                      strokeWidth={2.5}
                      points={MODEL_CALIBRATION_SERIES.map((item, idx) => {
                        const x = 65 + idx * 75;
                        const y = 210 - ((item.calibratedModelIndex - 98) / 22) * 180;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}

                  {/* Observed Sensor Data Line */}
                  {showObservedSensor && (
                    <polyline
                      fill="none"
                      stroke="#0369a1"
                      strokeWidth={3}
                      points={MODEL_CALIBRATION_SERIES.map((item, idx) => {
                        const x = 65 + idx * 75;
                        const y = 210 - ((item.observedSensorIndex - 98) / 22) * 180;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}

                  {/* Data nodes */}
                  {MODEL_CALIBRATION_SERIES.map((item, idx) => {
                    const x = 65 + idx * 75;
                    const yStatic = 210 - ((item.staticForecastIndex - 98) / 22) * 180;
                    const yObs = 210 - ((item.observedSensorIndex - 98) / 22) * 180;
                    const yCal = 210 - ((item.calibratedModelIndex - 98) / 22) * 180;
                    const isHovered = idx === hoveredYearIndex;

                    return (
                      <g
                        key={`dots-${item.year}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredYearIndex(idx)}
                        onClick={() => setHoveredYearIndex(idx)}
                      >
                        {showStaticForecast && (
                          <circle
                            cx={x}
                            cy={yStatic}
                            r={isHovered ? 5 : 3.5}
                            fill="#475569"
                            stroke="#ffffff"
                            strokeWidth={1.5}
                          />
                        )}
                        {showCalibratedModel && (
                          <circle
                            cx={x}
                            cy={yCal}
                            r={isHovered ? 5 : 3.5}
                            fill="#15803d"
                            stroke="#ffffff"
                            strokeWidth={1.5}
                          />
                        )}
                        {showObservedSensor && (
                          <circle
                            cx={x}
                            cy={yObs}
                            r={isHovered ? 5.5 : 4}
                            fill="#0369a1"
                            stroke="#ffffff"
                            strokeWidth={1.5}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Year Readout Strip */}
            <div className="mt-4 grid grid-cols-3 gap-4 border border-slate-200 rounded-lg p-3.5 bg-white">
              <div>
                <div className="text-xs text-slate-500">Statisk prognose ({hoveredPoint.year})</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-700 mt-0.5">
                  {hoveredPoint.staticForecastIndex.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Faktisk sensordata ({hoveredPoint.year})</div>
                <div className="text-lg font-bold font-mono tabular-nums text-sky-800 mt-0.5">
                  {hoveredPoint.observedSensorIndex.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Prognoseavvik oppdaget</div>
                <div className="text-lg font-bold font-mono tabular-nums text-amber-700 mt-0.5">
                  -{(hoveredPoint.staticForecastIndex - hoveredPoint.observedSensorIndex).toFixed(1)} p
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Transportmodell Input -> Modell -> Output (from Page 4 graphic) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-slate-200 rounded-lg p-5 bg-slate-50">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-800" />
                <span>Transportmodell-sløyfe (PDF s. 4)</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mt-1">
                Fra arealbruk og etterspørsel til kalibrert rutevalg og transportytelse
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Reise-, trafikk-, gods-, mobilitets- og posisjonsdata brukes til løpende kalibrering av RTM, NTM og godsmodellene.
              </p>

              <div className="mt-4 space-y-3">
                <div className="bg-white border border-slate-200 rounded-md p-3">
                  <div className="text-xs font-semibold text-slate-900">
                    1. Dynamisk Input (Kunnskapsgrunnlag)
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Befolkning og næringsliv · Arealbruk og vegnett · Transportkostnader · Faktiske reisevaner (RVU / M360) · Tellepunkter og Inrix.
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-3">
                  <div className="text-xs font-semibold text-sky-900">
                    2. 4-trinns Transportmodell (RTM · NTM · Gods · Cube)
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Generering (hvor mange reiser) → Fordeling (hvor går reisene) → Transportmiddelvalg → Rutevalg og trafikkberegning i nettverket.
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-md p-3">
                  <div className="text-xs font-semibold text-emerald-900">
                    3. Beslutningsrelevant Output (Effekt & NTP)
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Trafikkmengder på veg og bane · Godsmengder på sjø og land · Transportytelse (person- og tonn-km) · Samfunnsøkonomisk nytte.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Støttes av: Effekt · Cube · RVU</span>
              <button
                onClick={() => onOpenPdfPage(4)}
                className="font-medium text-sky-800 hover:underline cursor-pointer"
              >
                Se modellskisse i PDF s. 4
              </button>
            </div>
          </div>
        </div>

        {/* Bottom half of Section 3: Concrete Before/After Effect Evaluation Table */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-800" />
                <span>Etterprøving og effektmåling av gjennomførte tiltak (Før / Etter)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Sammenligning av beregnet reisetidsgevinst (forhåndsmodellert) mot faktisk observert effekt fra sensordata.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
              {['Alle', 'Drift / mindre tiltak', 'Kollektiv / Byvekst', 'Kapasitetsutvidelse'].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMeasureType(type)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedMeasureType === type
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Tiltak og strekning</th>
                  <th className="py-3 px-4">Virksomhet · Tiltakstype</th>
                  <th className="py-3 px-4 text-right">Prognose (min)</th>
                  <th className="py-3 px-4 text-right">Målt effekt (min)</th>
                  <th className="py-3 px-4 text-right">Tiltakskostnad</th>
                  <th className="py-3 px-4">Funn fra dynamiske data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredEffectCases.map((c) => {
                  const delta = c.observedBenefitMinutes - c.forecastedBenefitMinutes;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-slate-900">{c.projectTitle}</div>
                        <div className="text-slate-500 mt-0.5">
                          {c.corridor} · Datakilde: {c.sensorSource}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-600 whitespace-nowrap">
                        <div>{c.agency}</div>
                        <div className="text-slate-500 mt-0.5">{c.measureType}</div>
                      </td>
                      <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-slate-700">
                        -{c.forecastedBenefitMinutes.toFixed(1)} min
                      </td>
                      <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums font-semibold text-emerald-700">
                        -{c.observedBenefitMinutes.toFixed(1)} min{' '}
                        <span className="text-slate-500 font-normal">
                          ({delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-slate-800 whitespace-nowrap">
                        {c.costMillionNok.toLocaleString('nb-NO')} mill. kr
                      </td>
                      <td className="py-3.5 px-4 align-top text-slate-700 max-w-md leading-relaxed">
                        {c.keyFinding}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 4: NTP Behov og Verktøyoversikt (Page 3) */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>NTP 2029–2040 behov (Side 3)</span>
              <span aria-hidden="true">·</span>
              <span>Verktøy og analysekapabiliteter</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mt-1">
              Fra dagens analyseverktøy (Effekt, Cube, ArcGIS) til åpne og fleksible løsninger
            </h2>
          </div>
          <button
            onClick={() => onOpenPdfPage(3)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer self-start"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Vis side 3 i PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Behovskategori i NTP</th>
                <th className="py-3 px-4">Beskrivelse</th>
                <th className="py-3 px-4">Dagens verktøy / plattform</th>
                <th className="py-3 px-4">Veien videre mot NTP 2029–2040</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredNeeds.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 align-top">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 align-top leading-relaxed">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 align-top">
                    {item.currentTools}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 align-top leading-relaxed">
                    {item.futureDirection}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
