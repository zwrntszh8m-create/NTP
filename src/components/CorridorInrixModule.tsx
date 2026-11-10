import React, { useState, useMemo } from 'react';
import { E16_RV7_SEGMENTS } from '../data/ntpData';
import {
  FileText,
  ArrowLeftRight,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Columns2,
  MapPin,
  Calendar,
} from 'lucide-react';

interface CorridorInrixModuleProps {
  onOpenPdfPage: (page: number) => void;
}

type DirectionMode = 'southbound' | 'northbound';
type MitigationScenario = 'baseline' | 'dynamic_signals' | 'full_corridor_ops';
type ViewMode = 'standard' | 'compare';
type ComparisonType = 'periods' | 'segments';
type TimePeriodId = 'aug_sep_2026' | 'july_summer_2026' | 'jan_feb_winter_2026' | 'oct_mitigated_2026';

interface TimePeriodConfig {
  id: TimePeriodId;
  label: string;
  shortLabel: string;
  dateRange: string;
  description: string;
  // Multipliers by hour bucket & bottleneck characteristics to generate realistic seasonal/period profiles
  peakMultiplier: number;
  middayMultiplier: number;
  weekendSpikeFactor: number;
  speedPenaltyKmh: number;
  aadtFactor: number;
}

const INRIX_TIME_PERIODS: TimePeriodConfig[] = [
  {
    id: 'aug_sep_2026',
    label: '31.08.2026–25.09.2026 (Referanseperiode i PDF s. 5)',
    shortLabel: 'Aug–Sep 2026 (PDF-referanse)',
    dateRange: '31.08.2026–25.09.2026',
    description: 'Ordinær sen-sommer og høsttrafikk med sterk ettermiddags- og helgeutfart gjennom Hønefoss og langs Tyrifjorden.',
    peakMultiplier: 1.0,
    middayMultiplier: 1.0,
    weekendSpikeFactor: 1.0,
    speedPenaltyKmh: 0,
    aadtFactor: 1.0,
  },
  {
    id: 'july_summer_2026',
    label: '01.07.2026–31.07.2026 (Sommerferie og utfartstrafikk)',
    shortLabel: 'Juli 2026 (Sommertrafikk)',
    dateRange: '01.07.2026–31.07.2026',
    description: 'Høyere trafikkmengde midt på dagen (kl. 10–16) mot Hallingdal og Valdres, men lavere morgenrush inn mot Bærum/Oslo.',
    peakMultiplier: 0.92,
    middayMultiplier: 1.24,
    weekendSpikeFactor: 1.15,
    speedPenaltyKmh: -2,
    aadtFactor: 1.14,
  },
  {
    id: 'jan_feb_winter_2026',
    label: '12.01.2026–08.02.2026 (Vinterføre og skred-/fjellovergangstrafikk)',
    shortLabel: 'Jan–Feb 2026 (Vinter)',
    dateRange: '12.01.2026–08.02.2026',
    description: 'Vinterføre og konsentrert helgeutfart mot fjellområdene på Rv7/E16 gir lavere snitthastighet og kødannelse ved Sollihøgda.',
    peakMultiplier: 1.08,
    middayMultiplier: 0.88,
    weekendSpikeFactor: 1.22,
    speedPenaltyKmh: -6,
    aadtFactor: 0.89,
  },
  {
    id: 'oct_mitigated_2026',
    label: '01.10.2026–28.10.2026 (Etter dynamisk kryss- og korridorstyring)',
    shortLabel: 'Okt 2026 (Etter driftstiltak)',
    dateRange: '01.10.2026–28.10.2026',
    description: 'Effektmåling etter optimalisert signal- og påkjøringsstyring i kryss E16/Rv7 ved Hønefoss og varsling over Sollihøgda.',
    peakMultiplier: 0.72,
    middayMultiplier: 0.8,
    weekendSpikeFactor: 0.75,
    speedPenaltyKmh: 7,
    aadtFactor: 0.98,
  },
];

function computeHourlyForPeriod(
  baseHours: number[],
  isBottleneck: boolean,
  period: TimePeriodConfig,
  scenarioMultiplier = 1.0
): number[] {
  return baseHours.map((val, hr) => {
    let factor = 1.0;
    if (hr >= 10 && hr <= 14) {
      factor = period.middayMultiplier;
    } else if (hr >= 15 && hr <= 18) {
      factor = isBottleneck
        ? period.peakMultiplier * period.weekendSpikeFactor
        : period.peakMultiplier;
    } else if (hr >= 6 && hr <= 9) {
      factor = period.peakMultiplier;
    }

    const scenarioFactor = isBottleneck
      ? scenarioMultiplier
      : Math.min(1, scenarioMultiplier + 0.12);

    return Math.min(110, Math.max(1, Math.round(val * factor * scenarioFactor)));
  });
}

export const CorridorInrixModule: React.FC<CorridorInrixModuleProps> = ({ onOpenPdfPage }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [comparisonType, setComparisonType] = useState<ComparisonType>('periods');

  // Shared controls
  const [direction, setDirection] = useState<DirectionMode>('southbound');
  const [scenario, setScenario] = useState<MitigationScenario>('baseline');
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number>(5); // Default Kryss E16/Rv7 Hønefoss sør (km 24.0)
  const [selectedHour, setSelectedHour] = useState<number>(15); // Default kl. 15:00 peak

  // Comparison state: Time Periods (A vs B)
  const [periodAId, setPeriodAId] = useState<TimePeriodId>('aug_sep_2026');
  const [periodBId, setPeriodBId] = useState<TimePeriodId>('oct_mitigated_2026');

  // Comparison state: Segments (Strekning A vs Strekning B)
  const [segmentAIndex, setSegmentAIndex] = useState<number>(5); // Km 24.0 Kryss E16/Rv7 Hønefoss sør
  const [segmentBIndex, setSegmentBIndex] = useState<number>(8); // Km 33.0 Kroksund – Sundvollen (Tyrifjorden)
  const [segmentComparePeriodId, setSegmentComparePeriodId] = useState<TimePeriodId>('aug_sep_2026');

  const scenarioMultiplier = useMemo(() => {
    if (scenario === 'dynamic_signals') return 0.78;
    if (scenario === 'full_corridor_ops') return 0.62;
    return 1.0;
  }, [scenario]);

  const defaultPeriod = INRIX_TIME_PERIODS[0];
  const periodA = useMemo(
    () => INRIX_TIME_PERIODS.find((p) => p.id === periodAId) || INRIX_TIME_PERIODS[0],
    [periodAId]
  );
  const periodB = useMemo(
    () => INRIX_TIME_PERIODS.find((p) => p.id === periodBId) || INRIX_TIME_PERIODS[3],
    [periodBId]
  );
  const segmentComparePeriod = useMemo(
    () =>
      INRIX_TIME_PERIODS.find((p) => p.id === segmentComparePeriodId) ||
      INRIX_TIME_PERIODS[0],
    [segmentComparePeriodId]
  );

  // Standard view segments
  const processedSegments = useMemo(() => {
    return E16_RV7_SEGMENTS.map((seg) => {
      const baseHours =
        direction === 'southbound'
          ? seg.hourlyCongestionSouthbound
          : seg.hourlyCongestionNorthbound;

      return {
        ...seg,
        activeHourly: computeHourlyForPeriod(
          baseHours,
          seg.isBottleneck,
          defaultPeriod,
          scenario === 'baseline' ? 1.0 : scenarioMultiplier
        ),
      };
    });
  }, [direction, scenario, scenarioMultiplier, defaultPeriod]);

  // Period A vs Period B segments
  const periodASegments = useMemo(() => {
    return E16_RV7_SEGMENTS.map((seg) => {
      const baseHours =
        direction === 'southbound'
          ? seg.hourlyCongestionSouthbound
          : seg.hourlyCongestionNorthbound;
      return {
        ...seg,
        activeHourly: computeHourlyForPeriod(baseHours, seg.isBottleneck, periodA, 1.0),
        periodAvgSpeed: Math.max(
          25,
          Math.min(seg.freeFlowSpeedKmh, seg.avgSpeedKmh + periodA.speedPenaltyKmh)
        ),
        periodAadt: Math.round(seg.aadt * periodA.aadtFactor),
      };
    });
  }, [direction, periodA]);

  const periodBSegments = useMemo(() => {
    return E16_RV7_SEGMENTS.map((seg) => {
      const baseHours =
        direction === 'southbound'
          ? seg.hourlyCongestionSouthbound
          : seg.hourlyCongestionNorthbound;
      return {
        ...seg,
        activeHourly: computeHourlyForPeriod(baseHours, seg.isBottleneck, periodB, 1.0),
        periodAvgSpeed: Math.max(
          25,
          Math.min(seg.freeFlowSpeedKmh, seg.avgSpeedKmh + periodB.speedPenaltyKmh)
        ),
        periodAadt: Math.round(seg.aadt * periodB.aadtFactor),
      };
    });
  }, [direction, periodB]);

  // Helper to compute corridor-wide statistics at `selectedHour`
  const summarizeCorridorAtHour = (
    segments: {
      km: number;
      freeFlowSpeedKmh: number;
      activeHourly: number[];
    }[],
    hour: number
  ) => {
    let freeFlowMinutes = 0;
    let actualMinutes = 0;
    let bottleneckCount = 0;
    let sumCongestion = 0;
    let maxCongestion = 0;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const nextKm = i < segments.length - 1 ? segments[i + 1].km : 57.2;
      const distKm = Math.max(2.5, nextKm - seg.km);
      const cong = seg.activeHourly[hour] || 0;

      sumCongestion += cong;
      if (cong > maxCongestion) maxCongestion = cong;
      if (cong >= 65) bottleneckCount++;

      const segFreeMin = (distKm / seg.freeFlowSpeedKmh) * 60;
      const speedReductionFactor = Math.max(0.28, 1 - (cong / 135) * 0.72);
      const effectiveSpeed = seg.freeFlowSpeedKmh * speedReductionFactor;
      const segActualMin = (distKm / effectiveSpeed) * 60;

      freeFlowMinutes += segFreeMin;
      actualMinutes += segActualMin;
    }

    return {
      freeFlowMinutes: Math.round(freeFlowMinutes * 10) / 10,
      actualMinutes: Math.round(actualMinutes * 10) / 10,
      delayMinutes: Math.max(0, Math.round((actualMinutes - freeFlowMinutes) * 10) / 10),
      bottleneckCount,
      avgCongestion: Math.round(sumCongestion / segments.length),
      maxCongestion,
    };
  };

  const corridorStatsAtHour = useMemo(
    () => summarizeCorridorAtHour(processedSegments, selectedHour),
    [processedSegments, selectedHour]
  );

  const statsPeriodA = useMemo(
    () => summarizeCorridorAtHour(periodASegments, selectedHour),
    [periodASegments, selectedHour]
  );

  const statsPeriodB = useMemo(
    () => summarizeCorridorAtHour(periodBSegments, selectedHour),
    [periodBSegments, selectedHour]
  );

  // Segment A vs Segment B computed metrics
  const segmentComparisonData = useMemo(() => {
    const rawSegA = E16_RV7_SEGMENTS[segmentAIndex] || E16_RV7_SEGMENTS[5];
    const rawSegB = E16_RV7_SEGMENTS[segmentBIndex] || E16_RV7_SEGMENTS[8];

    const baseA =
      direction === 'southbound'
        ? rawSegA.hourlyCongestionSouthbound
        : rawSegA.hourlyCongestionNorthbound;
    const baseB =
      direction === 'southbound'
        ? rawSegB.hourlyCongestionSouthbound
        : rawSegB.hourlyCongestionNorthbound;

    const hoursA = computeHourlyForPeriod(
      baseA,
      rawSegA.isBottleneck,
      segmentComparePeriod,
      1.0
    );
    const hoursB = computeHourlyForPeriod(
      baseB,
      rawSegB.isBottleneck,
      segmentComparePeriod,
      1.0
    );

    const summarizeSingleSegment = (raw: typeof rawSegA, hrs: number[]) => {
      const maxCong = Math.max(...hrs);
      const peakHr = hrs.indexOf(maxCong);
      const avgCong = Math.round(hrs.reduce((a, b) => a + b, 0) / hrs.length);
      const severeHoursCount = hrs.filter((h) => h >= 50).length;
      const effectivePeakSpeed = Math.round(
        raw.freeFlowSpeedKmh * Math.max(0.28, 1 - (maxCong / 135) * 0.72)
      );
      return {
        raw,
        hours: hrs,
        maxCong,
        peakHr,
        avgCong,
        severeHoursCount,
        effectivePeakSpeed,
        adjustedAadt: Math.round(raw.aadt * segmentComparePeriod.aadtFactor),
      };
    };

    return {
      segA: summarizeSingleSegment(rawSegA, hoursA),
      segB: summarizeSingleSegment(rawSegB, hoursB),
    };
  }, [segmentAIndex, segmentBIndex, direction, segmentComparePeriod]);

  const activeSegment = processedSegments[selectedSegmentIndex] || processedSegments[5];
  const currentCellCongestion = activeSegment.activeHourly[selectedHour] ?? 0;

  // Color scale matching the INRIX Roadway Analytics Congestion Scan on PDF Page 5
  const getInrixCellColor = (
    congestionPercent: number
  ): { bg: string; text: string; label: string } => {
    if (congestionPercent >= 90) {
      return { bg: '#b91c1c', text: '#ffffff', label: 'Kritisk kø (90–110 %)' };
    }
    if (congestionPercent >= 70) {
      return { bg: '#ef4444', text: '#ffffff', label: 'Sterk kø (70–89 %)' };
    }
    if (congestionPercent >= 50) {
      return { bg: '#f59e0b', text: '#0f172a', label: 'Tett trafikk (50–69 %)' };
    }
    if (congestionPercent >= 30) {
      return { bg: '#eab308', text: '#0f172a', label: 'Moderat tetthet (30–49 %)' };
    }
    if (congestionPercent >= 15) {
      return { bg: '#22c55e', text: '#0f172a', label: 'God flyt (15–29 %)' };
    }
    return { bg: '#0d9488', text: '#ffffff', label: 'Fri flyt (0–14 %)' };
  };

  return (
    <div className="space-y-8">
      {/* Header & Mode Switcher Card */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Eksempel fra NTP-presentasjonen (Side 5)</span>
              <span aria-hidden="true">·</span>
              <span>INRIX Roadway Analytics Congestion Scan</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">57,2 km</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              Strekning E16 og Rv7 Sokna – Hønefoss – Sollihøgda / Skaret
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary View Mode Toggle: Enkeltvisning vs. Sammenligningsmodus */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode('standard')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'standard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Enkeltvisning (Heatmap og kart)
              </button>
              <button
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                  viewMode === 'compare'
                    ? 'bg-sky-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Sammenligningsmodus (Side-om-side)</span>
              </button>
            </div>

            <button
              onClick={() =>
                setDirection((d) => (d === 'southbound' ? 'northbound' : 'southbound'))
              }
              className="px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-sky-800" />
              <span>
                {direction === 'southbound'
                  ? 'Sørgående (Sokna → Sandvika)'
                  : 'Nordgående (Sandvika → Sokna)'}
              </span>
            </button>

            <button
              onClick={() => onOpenPdfPage(5)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF s. 5</span>
            </button>
          </div>
        </div>

        {/* Sub-toolbar depending on whether we are in Standard Mode or Side-by-Side Comparison Mode */}
        {viewMode === 'standard' ? (
          <>
            {/* Operational Mitigation Simulator Bar */}
            <div className="pt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Simuler drift og mindre tiltak som alternativ til store nyinvesteringer
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Data om kapasitet, kø og reisetid synliggjør hvor målrettet trafikkstyring i kryss E16/Rv7 og over Sollihøgda løser flaskehalsen.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setScenario('baseline')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    scenario === 'baseline'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Målt situasjon (Aug–Sep 2026)
                </button>
                <button
                  onClick={() => setScenario('dynamic_signals')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    scenario === 'dynamic_signals'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kryss- og påkjøringsstyring E16/Rv7 (-22 %)
                </button>
                <button
                  onClick={() => setScenario('full_corridor_ops')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    scenario === 'full_corridor_ops'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Helhetlig korridorstyring og tungbilfelt (-38 %)
                </button>
              </div>
            </div>

            {/* 4 Corridor Telemetry Metrics for Selected Hour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Valgt tidspunkt og snittpunkt</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  Kl. {String(selectedHour).padStart(2, '0')}:00 · km {activeSegment.km.toFixed(1)}
                </div>
                <div className="text-xs text-slate-600 mt-0.5 truncate">{activeSegment.label}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Køprosent i valgt snitt (Inrix)</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1 flex items-center gap-2">
                  <span>{currentCellCongestion} %</span>
                  <span className="text-xs font-sans font-normal text-slate-600">
                    ({getInrixCellColor(currentCellCongestion).label})
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                  ÅDT: {activeSegment.aadt.toLocaleString('nb-NO')} kjt/døgn
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Samlet reisetid hele korridoren (57,2 km)</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {corridorStatsAtHour.actualMinutes.toFixed(1)} min
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                  Normalsituasjon fri flyt: {corridorStatsAtHour.freeFlowMinutes.toFixed(1)} min
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Forsinkelse og kritiske flaskehalser</div>
                <div className="text-lg font-bold font-mono tabular-nums text-amber-700 mt-1">
                  +{corridorStatsAtHour.delayMinutes.toFixed(1)} min forsinkelse
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {corridorStatsAtHour.bottleneckCount} delstrekninger med kø &ge; 65 %
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Comparison Mode Sub-Header: Choose between comparing two Time Periods OR two Corridor Segments */
          <div className="pt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-900">
                Sammenligningsmodus — Velg sammenligningsdimensjon (Side-om-side A mot B)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Sammenlign enten to ulike tidsperioder for hele E16/Rv7-korridoren eller to enkeltstrekninger mot hverandre over døgnet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setComparisonType('periods')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                    comparisonType === 'periods'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-800" />
                  <span>To tidsperioder (Periode A mot B)</span>
                </button>
                <button
                  onClick={() => setComparisonType('segments')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                    comparisonType === 'segments'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-800" />
                  <span>To strekninger (Strekning A mot B)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================================== */}
      {/* VIEW 1: STANDARD SINGLE VIEW (Heatmap + Geographic Corridor Map)       */}
      {/* ===================================================================== */}
      {viewMode === 'standard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 columns: Interactive 2D Congestion Scan Matrix */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Inrix Congestion Scan — Varmematrise (Kilometer × Klokketime)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Klikk på en celle for å inspisere strekningspunkt og klokkeslett. Rødt felt viser flaskehalsen fra E16/Rv7 Hønefoss til Sollihøgda.
                  </p>
                </div>
              </div>

              {/* Color Threshold Legend matching Page 5 */}
              <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs text-slate-600">
                <span className="font-medium text-slate-700">Fargeterskler — Køprosent (%):</span>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: '#0d9488' }} />
                    0–14 %
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: '#22c55e' }} />
                    15–29 %
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: '#eab308' }} />
                    30–49 %
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: '#f59e0b' }} />
                    50–69 %
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: '#ef4444' }} />
                    70–89 %
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: '#b91c1c' }} />
                    90–110 %
                  </span>
                </div>
              </div>

              {/* 2D Heatmap Grid */}
              <div className="overflow-x-auto mt-2">
                <div className="min-w-[600px]">
                  {/* Hour Header Row */}
                  <div className="grid grid-cols-[150px_repeat(24,minmax(16px,1fr))] gap-0.5 pb-1 border-b border-slate-200 text-[10px] font-mono text-slate-500">
                    <div className="pr-2 font-sans font-semibold text-slate-700">Km · Strekning</div>
                    {Array.from({ length: 24 }, (_, hr) => (
                      <button
                        key={hr}
                        onClick={() => setSelectedHour(hr)}
                        className={`text-center py-0.5 rounded-xs cursor-pointer ${
                          selectedHour === hr
                            ? 'bg-slate-900 text-white font-bold'
                            : 'hover:bg-slate-100'
                        }`}
                        title={`Velg kl. ${String(hr).padStart(2, '0')}:00`}
                      >
                        {String(hr).padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  {/* Segment Rows */}
                  <div className="divide-y divide-slate-100 mt-1">
                    {processedSegments.map((seg, segIdx) => {
                      const isRowSelected = segIdx === selectedSegmentIndex;
                      return (
                        <div
                          key={seg.km}
                          className={`grid grid-cols-[150px_repeat(24,minmax(16px,1fr))] gap-0.5 items-center py-0.5 ${
                            isRowSelected ? 'bg-sky-50/70' : ''
                          }`}
                        >
                          <button
                            onClick={() => setSelectedSegmentIndex(segIdx)}
                            className="text-left pr-2 py-1 truncate flex items-center gap-1.5 cursor-pointer hover:text-sky-900"
                            title={`${seg.km.toFixed(1)} km — ${seg.label}`}
                          >
                            <span className="text-[11px] font-mono tabular-nums font-semibold text-slate-800 w-8 shrink-0">
                              {seg.km.toFixed(0)}k
                            </span>
                            <span
                              className={`text-[11px] truncate ${
                                isRowSelected ? 'font-semibold text-slate-950' : 'text-slate-600'
                              }`}
                            >
                              {seg.label}
                            </span>
                          </button>

                          {seg.activeHourly.map((congVal, hr) => {
                            const cellStyle = getInrixCellColor(congVal);
                            const isSelectedCell =
                              segIdx === selectedSegmentIndex && hr === selectedHour;
                            return (
                              <button
                                key={hr}
                                onClick={() => {
                                  setSelectedSegmentIndex(segIdx);
                                  setSelectedHour(hr);
                                }}
                                style={{ backgroundColor: cellStyle.bg }}
                                className={`h-6 w-full rounded-[2px] transition-transform cursor-pointer ${
                                  isSelectedCell
                                    ? 'ring-2 ring-slate-950 scale-110 z-10'
                                    : 'hover:opacity-90'
                                }`}
                                title={`${seg.label} (${seg.km.toFixed(1)} km) kl. ${String(
                                  hr
                                ).padStart(2, '0')}:00 — Køprosent: ${congVal} %`}
                                aria-label={`${seg.label} kl ${hr} kø ${congVal} prosent`}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Hour Slider Control at Bottom of Heatmap */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Clock className="w-4 h-4 text-sky-800 shrink-0" />
                <span className="font-medium whitespace-nowrap">Tidspunkt på døgnet:</span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  Kl. {String(selectedHour).padStart(2, '0')}:00–{String((selectedHour + 1) % 24).padStart(2, '0')}:00
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <span className="text-[11px] font-mono text-slate-500">00:00</span>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(Number(e.target.value))}
                  className="w-full accent-sky-800 cursor-pointer"
                  aria-label="Velg klokketime på døgnet"
                />
                <span className="text-[11px] font-mono text-slate-500">23:00</span>
              </div>
            </div>
          </section>

          {/* Right 5 columns: Geographic Corridor Map & Segment Detail */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Geografisk korridorkart — Rv7 og E16 (57,2 km)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Fargekodet etter valgt klokketime (kl. {String(selectedHour).padStart(2, '0')}:00). Klikk på en node langs korridoren.
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  Ringerike · Hole · Bærum
                </span>
              </div>

              {/* Interactive SVG Map modeled after the right half of PDF Page 5 */}
              <div className="mt-4 border border-slate-200 rounded-lg bg-slate-50 p-3">
                <svg
                  viewBox="0 0 420 340"
                  className="w-full h-72"
                  role="img"
                  aria-label="Kart over E16 og Rv7 fra Sokna via Hønefoss og Tyrifjorden til Sollihøgda og Sandvika"
                >
                  <path
                    d="M155,165 C140,195 125,230 140,265 C155,285 185,270 198,240 C208,215 215,190 220,168 Z"
                    fill="#bae6fd"
                    stroke="#7dd3fc"
                    strokeWidth={1}
                  />
                  <path
                    d="M222,145 C235,135 248,155 240,185 C232,205 220,195 218,170 Z"
                    fill="#bae6fd"
                    stroke="#7dd3fc"
                    strokeWidth={1}
                  />
                  <text x="160" y="235" className="fill-sky-800/70 text-[10px] font-sans italic">
                    Tyrifjorden
                  </text>
                  <text x="246" y="162" className="fill-sky-800/70 text-[9px] font-sans italic">
                    Steinsfjorden
                  </text>

                  {(() => {
                    const coords = [
                      { x: 52, y: 38 },
                      { x: 84, y: 52 },
                      { x: 118, y: 66 },
                      { x: 154, y: 80 },
                      { x: 186, y: 92 },
                      { x: 204, y: 114 },
                      { x: 214, y: 138 },
                      { x: 222, y: 164 },
                      { x: 226, y: 192 },
                      { x: 234, y: 218 },
                      { x: 252, y: 242 },
                      { x: 278, y: 262 },
                      { x: 306, y: 278 },
                      { x: 342, y: 298 },
                      { x: 378, y: 316 },
                    ];

                    return (
                      <>
                        {coords.slice(0, -1).map((pt, idx) => {
                          const nextPt = coords[idx + 1];
                          const seg = processedSegments[idx];
                          const cong = seg.activeHourly[selectedHour] || 0;
                          const color = getInrixCellColor(cong).bg;
                          return (
                            <line
                              key={`seg-line-${idx}`}
                              x1={pt.x}
                              y1={pt.y}
                              x2={nextPt.x}
                              y2={nextPt.y}
                              stroke={color}
                              strokeWidth={7}
                              strokeLinecap="round"
                              className="cursor-pointer"
                              onClick={() => setSelectedSegmentIndex(idx)}
                            />
                          );
                        })}

                        {coords.map((pt, idx) => {
                          const seg = processedSegments[idx];
                          const cong = seg.activeHourly[selectedHour] || 0;
                          const color = getInrixCellColor(cong).bg;
                          const isSelected = idx === selectedSegmentIndex;
                          const showLabel =
                            idx === 0 ||
                            idx === 5 ||
                            idx === 8 ||
                            idx === 12 ||
                            idx === 14 ||
                            isSelected;

                          return (
                            <g
                              key={`node-${idx}`}
                              className="cursor-pointer"
                              onClick={() => setSelectedSegmentIndex(idx)}
                            >
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isSelected ? 8 : 5}
                                fill={color}
                                stroke="#0f172a"
                                strokeWidth={isSelected ? 2.5 : 1.2}
                              />
                              {showLabel && (
                                <g>
                                  <rect
                                    x={pt.x + 10}
                                    y={pt.y - 10}
                                    width={seg.label.length * 5.2 + 34}
                                    height={18}
                                    rx={3}
                                    fill="#ffffff"
                                    stroke="#cbd5e1"
                                    strokeWidth={1}
                                  />
                                  <text
                                    x={pt.x + 15}
                                    y={pt.y + 2}
                                    className="fill-slate-900 text-[10px] font-medium"
                                  >
                                    {seg.km.toFixed(0)}k: {seg.label.split(' (')[0]} ({cong}%)
                                  </text>
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Selected Segment Diagnostic Panel */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500 font-mono tabular-nums">
                  VALGT STREKNINGSSNITT · KM {activeSegment.km.toFixed(1)} ({activeSegment.road})
                </div>
                <span className="text-xs text-slate-600">
                  {activeSegment.municipality} kommune
                </span>
              </div>

              <div className="text-base font-semibold text-slate-900 mt-1">
                {activeSegment.label}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Snitthastighet</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 inline-flex items-center gap-1 mt-0.5">
                    <Gauge className="w-3.5 h-3.5 text-sky-800" />
                    {activeSegment.avgSpeedKmh} / {activeSegment.freeFlowSpeedKmh} km/t
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Årsdøgntrafikk (ÅDT)</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5 block">
                    {activeSegment.aadt.toLocaleString('nb-NO')} kjt
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Flaskehalsstatus</span>
                  <span className="font-medium text-slate-900 inline-flex items-center gap-1 mt-0.5">
                    {activeSegment.isBottleneck ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kritisk sone</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Normal flyt</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2A: SIDE-BY-SIDE COMPARISON OF TWO TIME PERIODS                  */}
      {/* ===================================================================== */}
      {viewMode === 'compare' && comparisonType === 'periods' && (
        <div className="space-y-8">
          {/* Synchronized Hour Control Bar + Delta Summary Strip */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Side-om-side sammenligning av to tidsperioder langs E16 / Rv7 (57,2 km)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Velg Periode A og Periode B under for å sammenligne varmematriser, reisetider og flaskehalser for valgt klokketime.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sky-800 shrink-0" />
                <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  Synkronisert klokketime:
                </span>
                <span className="text-xs font-mono tabular-nums font-bold text-slate-900">
                  Kl. {String(selectedHour).padStart(2, '0')}:00
                </span>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(Number(e.target.value))}
                  className="w-36 accent-sky-800 cursor-pointer"
                  aria-label="Synkronisert klokketime for periodesammenligning"
                />
              </div>
            </div>

            {/* Delta Summary Strip (Endring fra Periode A til Periode B) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
              <div>
                <div className="text-xs text-slate-500">Endring i total reisetid (B mot A)</div>
                {(() => {
                  const diffMin = statsPeriodB.actualMinutes - statsPeriodA.actualMinutes;
                  const isBetter = diffMin <= 0;
                  return (
                    <div
                      className={`text-xl font-bold font-mono tabular-nums mt-1 ${
                        isBetter ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {diffMin > 0 ? `+${diffMin.toFixed(1)}` : diffMin.toFixed(1)} min
                    </div>
                  );
                })()}
                <div className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                  A: {statsPeriodA.actualMinutes.toFixed(1)} min · B: {statsPeriodB.actualMinutes.toFixed(1)} min
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Endring i forsinkelse kl. {String(selectedHour).padStart(2, '0')}:00</div>
                {(() => {
                  const diffDelay = statsPeriodB.delayMinutes - statsPeriodA.delayMinutes;
                  const isBetter = diffDelay <= 0;
                  return (
                    <div
                      className={`text-xl font-bold font-mono tabular-nums mt-1 ${
                        isBetter ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {diffDelay > 0 ? `+${diffDelay.toFixed(1)}` : diffDelay.toFixed(1)} min
                    </div>
                  );
                })()}
                <div className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                  A: +{statsPeriodA.delayMinutes.toFixed(1)} min · B: +{statsPeriodB.delayMinutes.toFixed(1)} min
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Snitt køprosent hele korridoren</div>
                {(() => {
                  const diffCong = statsPeriodB.avgCongestion - statsPeriodA.avgCongestion;
                  const isBetter = diffCong <= 0;
                  return (
                    <div
                      className={`text-xl font-bold font-mono tabular-nums mt-1 ${
                        isBetter ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {diffCong > 0 ? `+${diffCong}` : diffCong} prosentpoeng
                    </div>
                  );
                })()}
                <div className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                  A: {statsPeriodA.avgCongestion} % · B: {statsPeriodB.avgCongestion} %
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Antall kritiske flaskehalser (&ge; 65 %)</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {statsPeriodA.bottleneckCount} → {statsPeriodB.bottleneckCount} snitt
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-mono tabular-nums">
                  Maks kø A: {statsPeriodA.maxCongestion} % · B: {statsPeriodB.maxCongestion} %
                </div>
              </div>
            </div>
          </section>

          {/* Two Side-by-Side Period Panels (Periode A Left, Periode B Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {[
              {
                side: 'A',
                selectedId: periodAId,
                onSelectId: setPeriodAId,
                config: periodA,
                segments: periodASegments,
                stats: statsPeriodA,
              },
              {
                side: 'B',
                selectedId: periodBId,
                onSelectId: setPeriodBId,
                config: periodB,
                segments: periodBSegments,
                stats: statsPeriodB,
              },
            ].map((panel) => (
              <section
                key={panel.side}
                className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <span className="text-xs font-mono font-bold text-sky-900">
                      TIDSROM {panel.side} · {panel.config.dateRange}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-slate-600">
                      Reisetid kl. {String(selectedHour).padStart(2, '0')}:00:{' '}
                      <strong>{panel.stats.actualMinutes.toFixed(1)} min</strong>
                    </span>
                  </div>

                  {/* Period Selector Dropdown */}
                  <div className="mt-3">
                    <label
                      htmlFor={`period-select-${panel.side}`}
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Velg tidsperiode {panel.side}:
                    </label>
                    <select
                      id={`period-select-${panel.side}`}
                      value={panel.selectedId}
                      onChange={(e) => panel.onSelectId(e.target.value as TimePeriodId)}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                    >
                      {INRIX_TIME_PERIODS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {panel.config.description}
                    </p>
                  </div>

                  {/* Key Metrics for this Period */}
                  <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
                    <div>
                      <span className="text-slate-500 block">Reisetid (57,2 km)</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        {panel.stats.actualMinutes.toFixed(1)} min
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Køforsinkelse</span>
                      <span className="font-mono tabular-nums font-bold text-amber-700 text-sm">
                        +{panel.stats.delayMinutes.toFixed(1)} min
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Maks køprosent</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        {panel.stats.maxCongestion} %
                      </span>
                    </div>
                  </div>

                  {/* Compact Side-by-Side 2D Heatmap for this Period */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[460px]">
                      <div className="grid grid-cols-[120px_repeat(24,minmax(12px,1fr))] gap-0.5 pb-1 border-b border-slate-200 text-[9px] font-mono text-slate-500">
                        <div className="font-sans font-semibold text-slate-700">Km · Snitt</div>
                        {Array.from({ length: 24 }, (_, hr) => (
                          <button
                            key={hr}
                            onClick={() => setSelectedHour(hr)}
                            className={`text-center rounded-xs cursor-pointer ${
                              selectedHour === hr
                                ? 'bg-slate-900 text-white font-bold'
                                : 'hover:bg-slate-100'
                            }`}
                          >
                            {String(hr).padStart(2, '0')}
                          </button>
                        ))}
                      </div>

                      <div className="divide-y divide-slate-100 mt-1">
                        {panel.segments.map((seg, segIdx) => (
                          <div
                            key={seg.km}
                            className={`grid grid-cols-[120px_repeat(24,minmax(12px,1fr))] gap-0.5 items-center py-0.5 ${
                              segIdx === selectedSegmentIndex ? 'bg-sky-50/70' : ''
                            }`}
                          >
                            <button
                              onClick={() => setSelectedSegmentIndex(segIdx)}
                              className="text-left pr-1.5 truncate text-[10px] font-mono text-slate-700 cursor-pointer"
                              title={seg.label}
                            >
                              <span className="font-semibold">{seg.km.toFixed(0)}k</span>{' '}
                              <span className="font-sans">{seg.label.split(' ')[0]}</span>
                            </button>
                            {seg.activeHourly.map((congVal, hr) => {
                              const cellStyle = getInrixCellColor(congVal);
                              const isHighlighted =
                                segIdx === selectedSegmentIndex && hr === selectedHour;
                              return (
                                <button
                                  key={hr}
                                  onClick={() => {
                                    setSelectedSegmentIndex(segIdx);
                                    setSelectedHour(hr);
                                  }}
                                  style={{ backgroundColor: cellStyle.bg }}
                                  className={`h-4 w-full rounded-[1px] cursor-pointer ${
                                    isHighlighted ? 'ring-2 ring-slate-950 z-10' : ''
                                  }`}
                                  title={`${panel.config.shortLabel} — ${seg.label} kl. ${String(
                                    hr
                                  ).padStart(2, '0')}:00: ${congVal} %`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Corridor Profile Line Chart Comparing Period A vs Period B along km 0 to 57.2 */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Køprofil langs hele korridoren (Km 0,0 til 57,2) kl. {String(selectedHour).padStart(2, '0')}:00 — Periode A mot Periode B
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sammenligner køprosent per delstrekning mellom {periodA.shortLabel} og {periodB.shortLabel}.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                  <span className="w-3 h-3 rounded-xs bg-slate-900 inline-block" />
                  Periode A: {periodA.shortLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-sky-800">
                  <span className="w-3 h-3 rounded-xs bg-sky-600 inline-block" />
                  Periode B: {periodB.shortLabel}
                </span>
              </div>
            </div>

            <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <svg
                viewBox="0 0 760 220"
                className="w-full h-56 overflow-visible"
                role="img"
                aria-label="Sammenligning av køprosent langs E16 og Rv7 mellom Periode A og Periode B"
              >
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 185 - (val / 110) * 155;
                  return (
                    <g key={val}>
                      <line
                        x1={44}
                        y1={y}
                        x2={730}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray={val === 0 ? undefined : '4 4'}
                        strokeWidth={1}
                      />
                      <text
                        x={36}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-500 text-[10px] font-mono"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {E16_RV7_SEGMENTS.map((seg, idx) => {
                  const x = 58 + idx * 47;
                  return (
                    <text
                      key={seg.km}
                      x={x}
                      y={204}
                      textAnchor="middle"
                      className="fill-slate-600 text-[10px] font-mono"
                    >
                      {seg.km.toFixed(0)}k
                    </text>
                  );
                })}

                {/* Period A polyline */}
                <polyline
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  points={periodASegments
                    .map((seg, idx) => {
                      const x = 58 + idx * 47;
                      const val = seg.activeHourly[selectedHour] || 0;
                      const y = 185 - (val / 110) * 155;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Period B polyline */}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  points={periodBSegments
                    .map((seg, idx) => {
                      const x = 58 + idx * 47;
                      const val = seg.activeHourly[selectedHour] || 0;
                      const y = 185 - (val / 110) * 155;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Interactive nodes */}
                {E16_RV7_SEGMENTS.map((seg, idx) => {
                  const x = 58 + idx * 47;
                  const valA = periodASegments[idx].activeHourly[selectedHour] || 0;
                  const valB = periodBSegments[idx].activeHourly[selectedHour] || 0;
                  const yA = 185 - (valA / 110) * 155;
                  const yB = 185 - (valB / 110) * 155;
                  return (
                    <g
                      key={`cmp-pt-${seg.km}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedSegmentIndex(idx)}
                    >
                      <circle cx={x} cy={yA} r={4} fill="#0f172a" stroke="#ffffff" strokeWidth={1.5}>
                        <title>{`Periode A (${seg.label}): ${valA} %`}</title>
                      </circle>
                      <circle cx={x} cy={yB} r={4} fill="#0284c7" stroke="#ffffff" strokeWidth={1.5}>
                        <title>{`Periode B (${seg.label}): ${valB} %`}</title>
                      </circle>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2B: SIDE-BY-SIDE COMPARISON OF TWO CORRIDOR SEGMENTS             */}
      {/* ===================================================================== */}
      {viewMode === 'compare' && comparisonType === 'segments' && (
        <div className="space-y-8">
          {/* Period Context & Delta Header for Segment A vs Segment B */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Side-om-side sammenligning av to strekninger / snitt langs E16 og Rv7
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Velg Strekning A og Strekning B for å sammenligne døgnprofil (00:00–23:00), hastighet, ÅDT og antall køtimer.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="segment-compare-period"
                  className="text-xs font-medium text-slate-600 whitespace-nowrap"
                >
                  Analyseperiode:
                </label>
                <select
                  id="segment-compare-period"
                  value={segmentComparePeriodId}
                  onChange={(e) => setSegmentComparePeriodId(e.target.value as TimePeriodId)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-md"
                >
                  {INRIX_TIME_PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.shortLabel} ({p.dateRange})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Cards: Strekning A vs Strekning B */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
              {[
                {
                  code: 'A',
                  selectedIndex: segmentAIndex,
                  onSelectIndex: setSegmentAIndex,
                  data: segmentComparisonData.segA,
                  accentClass: 'text-slate-900',
                  badgeBg: 'bg-slate-900 text-white',
                },
                {
                  code: 'B',
                  selectedIndex: segmentBIndex,
                  onSelectIndex: setSegmentBIndex,
                  data: segmentComparisonData.segB,
                  accentClass: 'text-sky-800',
                  badgeBg: 'bg-sky-800 text-white',
                },
              ].map((card) => (
                <div
                  key={card.code}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono font-bold rounded-xs ${card.badgeBg}`}
                      >
                        STREKNING {card.code}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        Km {card.data.raw.km.toFixed(1)} · {card.data.raw.road} ·{' '}
                        {card.data.raw.municipality} kommune
                      </span>
                    </div>

                    <div className="mt-3">
                      <label
                        htmlFor={`segment-select-${card.code}`}
                        className="block text-xs font-medium text-slate-600 mb-1"
                      >
                        Velg delstrekning {card.code}:
                      </label>
                      <select
                        id={`segment-select-${card.code}`}
                        value={card.selectedIndex}
                        onChange={(e) => card.onSelectIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
                      >
                        {E16_RV7_SEGMENTS.map((s, idx) => (
                          <option key={s.km} value={idx}>
                            Km {s.km.toFixed(1)} — {s.label} ({s.road})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 4-Metric Grid for this Segment */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block">Maks køprosent</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                          {card.data.maxCong} %
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Topp kl. {String(card.data.peakHr).padStart(2, '0')}:00
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Timer med kø &ge; 50 %</span>
                        <span className="text-base font-bold font-mono tabular-nums text-amber-700 mt-0.5 block">
                          {card.data.severeHoursCount} t/døgn
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Døgnsnitt: {card.data.avgCong} %
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Hastighet i rushtopp</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                          {card.data.effectivePeakSpeed} km/t
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Fri flyt: {card.data.raw.freeFlowSpeedKmh} km/t
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block">ÅDT i perioden</span>
                        <span className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                          {card.data.adjustedAadt.toLocaleString('nb-NO')}
                        </span>
                        <span className="text-[11px] text-slate-500">kjøretøy/døgn</span>
                      </div>
                    </div>

                    {/* 24-Hour Color Strip for this Segment */}
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <div className="text-[11px] font-medium text-slate-600 mb-1.5">
                        Døgnprofil kl. 00–23 (Inrix fargeskala):
                      </div>
                      <div className="grid grid-cols-24 gap-0.5">
                        {card.data.hours.map((cong, hr) => {
                          const cell = getInrixCellColor(cong);
                          return (
                            <button
                              key={hr}
                              onClick={() => setSelectedHour(hr)}
                              style={{ backgroundColor: cell.bg }}
                              className={`h-5 rounded-[1px] cursor-pointer ${
                                selectedHour === hr ? 'ring-2 ring-slate-950 z-10' : ''
                              }`}
                              title={`Strekning ${card.code} kl. ${String(hr).padStart(
                                2,
                                '0'
                              )}:00 — Kø: ${cong} %`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 24-Hour Side-by-Side Curve & Hourly Delta Table */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Døgnsammenligning (Kl. 00:00–23:00) — Strekning A mot Strekning B
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Klikk på en klokketime i grafen for å se nøyaktig forskjell i køprosent mellom de to valgte strekningene.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                  <span className="w-3 h-3 rounded-xs bg-slate-900 inline-block" />
                  A: Km {segmentComparisonData.segA.raw.km.toFixed(1)}{' '}
                  {segmentComparisonData.segA.raw.label.split(' ')[0]}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-sky-800">
                  <span className="w-3 h-3 rounded-xs bg-sky-600 inline-block" />
                  B: Km {segmentComparisonData.segB.raw.km.toFixed(1)}{' '}
                  {segmentComparisonData.segB.raw.label.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <svg
                viewBox="0 0 760 220"
                className="w-full h-56 overflow-visible"
                role="img"
                aria-label="Døgnprofil for køprosent mellom Strekning A og Strekning B"
              >
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 185 - (val / 110) * 155;
                  return (
                    <g key={val}>
                      <line
                        x1={44}
                        y1={y}
                        x2={735}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray={val === 0 ? undefined : '4 4'}
                        strokeWidth={1}
                      />
                      <text
                        x={36}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-500 text-[10px] font-mono"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {Array.from({ length: 24 }, (_, hr) => {
                  const x = 55 + hr * 29.2;
                  const isSel = hr === selectedHour;
                  return (
                    <g
                      key={hr}
                      className="cursor-pointer"
                      onClick={() => setSelectedHour(hr)}
                    >
                      {isSel && (
                        <line
                          x1={x}
                          y1={20}
                          x2={x}
                          y2={185}
                          stroke="#94a3b8"
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                        />
                      )}
                      <text
                        x={x}
                        y={204}
                        textAnchor="middle"
                        className={`text-[10px] font-mono ${
                          isSel ? 'fill-slate-950 font-bold' : 'fill-slate-500'
                        }`}
                      >
                        {String(hr).padStart(2, '0')}
                      </text>
                    </g>
                  );
                })}

                {/* Strekning A Line */}
                <polyline
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  points={segmentComparisonData.segA.hours
                    .map((val, hr) => {
                      const x = 55 + hr * 29.2;
                      const y = 185 - (val / 110) * 155;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Strekning B Line */}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  points={segmentComparisonData.segB.hours
                    .map((val, hr) => {
                      const x = 55 + hr * 29.2;
                      const y = 185 - (val / 110) * 155;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {Array.from({ length: 24 }, (_, hr) => {
                  const x = 55 + hr * 29.2;
                  const valA = segmentComparisonData.segA.hours[hr] || 0;
                  const valB = segmentComparisonData.segB.hours[hr] || 0;
                  const yA = 185 - (valA / 110) * 155;
                  const yB = 185 - (valB / 110) * 155;
                  return (
                    <g
                      key={`hr-pt-${hr}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedHour(hr)}
                    >
                      <circle cx={x} cy={yA} r={3.5} fill="#0f172a" stroke="#ffffff" strokeWidth={1.2}>
                        <title>{`Strekning A kl. ${String(hr).padStart(2, '0')}:00: ${valA} %`}</title>
                      </circle>
                      <circle cx={x} cy={yB} r={3.5} fill="#0284c7" stroke="#ffffff" strokeWidth={1.2}>
                        <title>{`Strekning B kl. ${String(hr).padStart(2, '0')}:00: ${valB} %`}</title>
                      </circle>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Hour Readout Strip for Strekning A vs Strekning B */}
            {(() => {
              const congA = segmentComparisonData.segA.hours[selectedHour] || 0;
              const congB = segmentComparisonData.segB.hours[selectedHour] || 0;
              const diff = congB - congA;
              return (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 rounded-lg p-3.5 bg-white text-xs">
                  <div>
                    <span className="text-slate-500">
                      Strekning A kl. {String(selectedHour).padStart(2, '0')}:00 ({segmentComparisonData.segA.raw.label})
                    </span>
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {congA} % kø
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">
                      Strekning B kl. {String(selectedHour).padStart(2, '0')}:00 ({segmentComparisonData.segB.raw.label})
                    </span>
                    <div className="text-lg font-bold font-mono tabular-nums text-sky-800 mt-0.5">
                      {congB} % kø
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Forskjell (Strekning B minus Strekning A)</span>
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-800 mt-0.5">
                      {diff > 0 ? `+${diff}` : diff} prosentpoeng
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        </div>
      )}
    </div>
  );
};
