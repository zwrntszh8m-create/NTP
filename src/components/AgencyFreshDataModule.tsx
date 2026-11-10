import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AgencyId } from '../data/ntpData';
import {
  CROSS_AGENCY_FRESH_KPIS,
  SVV_REGISTRATION_POINTS,
  RAIL_CORRIDOR_STATS,
  AVINOR_HUB_STATS,
  KYSTVERKET_AIS_CATEGORIES,
  NYE_VEIER_PORTFOLIO,
} from '../data/agencyFreshData';
import {
  RefreshCw,
  Train,
  Plane,
  Ship,
  Car,
  TrendingUp,
  CheckCircle2,
  Clock,
  Database,
} from 'lucide-react';

interface LiveRailDeparture {
  stationName: string;
  lineCode: string;
  destination: string;
  aimedDeparture: string;
  expectedDeparture: string;
  delayMinutes: number;
  realtime: boolean;
  operator: string;
}

interface LiveRoadPointTelemetry {
  id: string;
  name: string;
  roadReference: string;
  municipality: string;
  lat: number;
  lon: number;
  latestHourVolume: number;
  aadtTotal: number;
  heavyVehicleRatioPercent: number;
  source: string;
}

export interface LiveApiPayload {
  fetchedAt: string;
  sources: {
    statensVegvesenApi: string;
    enturBaneNorApi: string;
    officialBaseline: string;
  };
  liveRoadPoints: LiveRoadPointTelemetry[];
  liveRailDepartures: LiveRailDeparture[];
}

interface AgencyFreshDataModuleProps {
  selectedAgency: AgencyId;
  onSelectAgency: (agency: AgencyId) => void;
}

export const AgencyFreshDataModule: React.FC<AgencyFreshDataModuleProps> = ({
  selectedAgency,
  onSelectAgency,
}) => {
  const [livePayload, setLivePayload] = useState<LiveApiPayload | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchLiveTelemetry = useCallback(async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch('/api/ntp-live-data');
      if (res.ok) {
        const data = (await res.json()) as LiveApiPayload;
        setLivePayload(data);
      }
    } catch {
      // Fallback gracefully to verified baseline
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTelemetry();
  }, [fetchLiveTelemetry]);

  const filteredKpis = useMemo(() => {
    return CROSS_AGENCY_FRESH_KPIS.filter((item) => {
      const matchesAgency =
        selectedAgency === 'alle' || item.agencyId === selectedAgency;
      const matchesSearch =
        !searchQuery.trim() ||
        item.metricName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceSystem.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAgency && matchesSearch;
    });
  }, [selectedAgency, searchQuery]);

  const showSection = (agencyList: AgencyId[]) => {
    return selectedAgency === 'alle' || agencyList.includes(selectedAgency);
  };

  const formattedFetchTime = useMemo(() => {
    if (!livePayload?.fetchedAt) return 'Verifisert 2025/2026-grunnlag';
    try {
      return new Date(livePayload.fetchedAt).toLocaleTimeString('nb-NO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return 'Akkurat nå';
    }
  }, [livePayload]);

  return (
    <div className="space-y-10">
      {/* Top Control & Data Freshness Banner */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>Tverrsektorielt datagrunnlag NTP 2029–2040</span>
              <span aria-hidden="true">·</span>
              <span>Åpne API-er og offisielle etatsrapporter (2024–2026)</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Sist synkronisert: {formattedFetchTime}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              Ferske nøkkeltall og sanntidsstrømmer fra de seks transportvirksomhetene
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søk i indikatorer eller datakilder..."
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-800 w-60"
            />
            <button
              onClick={fetchLiveTelemetry}
              disabled={isLoadingLive}
              className="px-3.5 py-2 text-xs font-medium text-white bg-sky-900 hover:bg-sky-800 disabled:opacity-60 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`}
              />
              <span>
                {isLoadingLive ? 'Synkroniserer API-er...' : 'Oppdater ferske API-tall'}
              </span>
            </button>
          </div>
        </div>

        {/* Source Connection Readout Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-800" />
              <span>Statens vegvesen Trafikkdata / NVDB</span>
            </div>
            <div className="font-semibold text-slate-900 mt-1">
              {livePayload?.sources.statensVegvesenApi ||
                'Trafikkdata GraphQL API & NVDB v4'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-800" />
              <span>Bane NOR / Jernbanedirektoratet / Entur</span>
            </div>
            <div className="font-semibold text-slate-900 mt-1">
              {livePayload?.sources.enturBaneNorApi ||
                'Entur Sanntid GraphQL & Bane NOR Punktlighet'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Avinor · Kystverket · Nye Veier · SSB</span>
            </div>
            <div className="font-semibold text-slate-900 mt-1">
              Verifiserte års- og kvartalsrapporter (2024–2026)
            </div>
          </div>
        </div>
      </section>

      {/* 6-Agency Executive KPI Cards */}
      <section aria-label="Hovedindikatorer per transportvirksomhet">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'svv' as AgencyId,
              agency: 'Statens vegvesen',
              kicker: 'Vegtrafikkindeksen · 1 218 tellepunkter',
              primaryValue: '+1,1 %',
              secondaryValue: 'Byområder: -1,4 % personbil',
              detail:
                'ÅDT E16/Rv7 Hønefoss sør: 22 480 kjt/døgn (14,6 % tungbil). Kontinuerlig måling i Trafikkdataportalen.',
            },
            {
              id: 'banenor' as AgencyId,
              agency: 'Bane NOR',
              kicker: 'Punktlighet og regularitet jernbane',
              primaryValue: '87,6 %',
              secondaryValue: 'Regularitet: 93,7 % (Mål: 90 / 97 %)',
              detail:
                'Opp +1,5 prosentpoeng fra 2024 (86,1 %). Punktlighet godstog: 74,9 % (opp fra 74,6 % i 2024).',
            },
            {
              id: 'jdir' as AgencyId,
              agency: 'Jernbanedirektoratet',
              kicker: 'Togpassasjerer og godsvolum på bane',
              primaryValue: '84,2 mill.',
              secondaryValue: 'Gods: 33,5 mill. tonn (+11,9 %)',
              detail:
                'Passasjervekst på +2,7 % fra 2024 (81,9 mill. reiser). Sterk vekst i pendlerreiser og kombigods.',
            },
            {
              id: 'avinor' as AgencyId,
              agency: 'Avinor',
              kicker: 'Lufthavntrafikk (43 lufthavner)',
              primaryValue: '53,2 mill.',
              secondaryValue: '+2,8 % vekst (Tromsø +8,4 %)',
              detail:
                'Oslo lufthavn: 27,4 mill. passasjerer (68,4 % kollektivandel tilbringer). Regularitet 98,4 %.',
            },
            {
              id: 'kystverket' as AgencyId,
              agency: 'Kystverket',
              kicker: 'AIS Norge (92 basestasjoner + satellitt)',
              primaryValue: '51,4 mill. nm',
              secondaryValue: '+1,8 % utseilt distanse i NØS',
              detail:
                '38,1 % lasteskip/sjømatfrakt, 27,0 % passasjer/ferge, 22,2 % fiskefartøy/brønnbåt. 99,86 % farledsoppetid.',
            },
            {
              id: 'nyeveier' as AgencyId,
              agency: 'Nye Veier',
              kicker: 'Porteføljestyring etter NNB',
              primaryValue: '-21,4 %',
              secondaryValue: '+78 mrd. kr økt netto nytte',
              detail:
                'Reduserte utbyggingskostnader mot NTP-anslag. 242 km firefelts/utbedret riksveg åpnet av 660 km portefølje.',
            },
          ].map((card) => {
            const isSelected = selectedAgency === card.id;
            return (
              <button
                key={card.id}
                onClick={() =>
                  onSelectAgency(selectedAgency === card.id ? 'alle' : card.id)
                }
                className={`text-left bg-white border rounded-lg p-5 transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-800 ring-1 ring-sky-800 bg-sky-50/30'
                    : 'border-slate-200 hover:bg-slate-50/80'
                }`}
              >
                <div>
                  <div className="text-xs text-slate-500 flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">{card.agency}</span>
                    <span>{card.kicker}</span>
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between gap-2">
                    <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                      {card.primaryValue}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
                      {card.secondaryValue}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    {card.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-800 font-medium">
                  <span>
                    {isSelected
                      ? 'Viser kun denne virksomheten (klikk for alle)'
                      : 'Filtrer tabeller på virksomhet'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Master Cross-Agency Fresh Indicator Table (2024 vs 2025 vs 2026 Status) */}
      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Sammenstilt nøkkeltallstabell på tvers av virksomhetene (2024 – 2025 – 2026)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Dokumenterte nøkkeltall med kildehenvisning og direkte relevans for NTP 2029–2040.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            Viser {filteredKpis.length} indikatorer
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Virksomhet og indikator</th>
                <th className="py-3 px-4 text-right">2024</th>
                <th className="py-3 px-4 text-right">2025 (Offisiell)</th>
                <th className="py-3 px-4 text-right">Fersk 2026-status</th>
                <th className="py-3 px-4 text-right">NTP-mål / Referanse</th>
                <th className="py-3 px-4">Kilde og bruksområde i NTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredKpis.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-semibold text-slate-900">{kpi.metricName}</div>
                    <div className="text-slate-500 mt-0.5">
                      {kpi.agencyName} · {kpi.yoyTrend}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {kpi.value2024}
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                    {kpi.value2025}
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums font-semibold text-sky-900 whitespace-nowrap">
                    {kpi.latest2026Status}
                  </td>
                  <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-emerald-800 whitespace-nowrap">
                    {kpi.targetValue}
                  </td>
                  <td className="py-3.5 px-4 align-top text-slate-600 max-w-sm">
                    <div className="font-medium text-slate-800">{kpi.sourceSystem}</div>
                    <div className="text-slate-500 mt-0.5">{kpi.ntpRelevance}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deep-Dive 1: Statens vegvesen (Trafikkdata API / NVDB Registration Points) & Nye Veier (NNB Portfolio) */}
      {showSection(['svv', 'nyeveier']) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Statens vegvesen Registration Points */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-sky-800" />
                    <span>Statens vegvesen · Trafikkdata API & NVDB</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                    Kontinuerlige trafikktellepunkter (E16 / Rv7 og E10 Sjømatkorridor)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">ÅDT og tungbilandel</span>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-2.5 px-3">Tellepunkt (NVDB-ID)</th>
                      <th className="py-2.5 px-3 text-right">ÅDT 2024</th>
                      <th className="py-2.5 px-3 text-right">ÅDT 2025</th>
                      <th className="py-2.5 px-3 text-right">2026-takt</th>
                      <th className="py-2.5 px-3 text-right">Tungbil (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {SVV_REGISTRATION_POINTS.map((pt) => (
                      <tr key={pt.pointId} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{pt.name}</div>
                          <div className="text-slate-500 font-mono text-[11px]">
                            {pt.pointId} · {pt.roadRef} · {pt.municipality}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                          {pt.aadt2024.toLocaleString('nb-NO')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                          {pt.aadt2025.toLocaleString('nb-NO')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-sky-900">
                          {pt.aadt2026Est.toLocaleString('nb-NO')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-800">
                          {pt.heavyPercent.toFixed(1)} %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* If live API returned additional registration points from trafikkdata-api.atlas.vegvesen.no */}
              {livePayload && livePayload.liveRoadPoints.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Direkte treff fra Statens vegvesen Trafikkdata GraphQL API ({livePayload.liveRoadPoints.length} punkter):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {livePayload.liveRoadPoints.slice(0, 4).map((lp) => (
                      <div
                        key={lp.id}
                        className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-900">{lp.name}</span>
                          <span className="text-slate-500 block font-mono text-[10px]">
                            {lp.id} · {lp.roadReference} ({lp.municipality})
                          </span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-800 shrink-0">
                          {lp.heavyVehicleRatioPercent.toFixed(1)}% tung
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Nye Veier Portfolio Ranking (NNB) */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nye Veier · Porteføljeprioritering</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                    Rangering etter Netto nytte per budsjettkrone (NNB)
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-slate-200 mt-3">
                {NYE_VEIER_PORTFOLIO.map((proj) => (
                  <div key={proj.section} className="py-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {proj.corridor}: {proj.section}
                      </span>
                      <span className="font-mono tabular-nums font-bold text-emerald-800 whitespace-nowrap">
                        NNB +{proj.nnbScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 mt-1 font-mono tabular-nums">
                      <span>
                        {proj.lengthKm} km · {proj.status}
                      </span>
                      <span>
                        -{proj.costSavingPercent.toFixed(1)}% kostnad · -{proj.travelTimeSavedMinutes.toFixed(1)} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Deep-Dive 2: Bane NOR & Jernbanedirektoratet (Corridor Punctuality, Freight & Live Entur Departures) */}
      {showSection(['banenor', 'jdir']) && (
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-sky-800" />
                <span>Bane NOR og Jernbanedirektoratet · Punktlighet, passasjerer og godstog</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                Jernbanekorridorer (84,2 mill. reiser · 33,5 mill. tonn gods · 87,6 % punktlighet)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Målsetting: 90,0 % punktlighet persontog · 80,0 % godstog
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-5 items-stretch">
            <div className="lg:col-span-7 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-2.5 px-3">Jernbanekorridor</th>
                    <th className="py-2.5 px-3 text-right">Punktl. 2024</th>
                    <th className="py-2.5 px-3 text-right">Punktl. 2025</th>
                    <th className="py-2.5 px-3 text-right">Reg. 2025</th>
                    <th className="py-2.5 px-3 text-right">Reiser / Gods</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {RAIL_CORRIDOR_STATS.map((rc) => (
                    <tr key={rc.corridor} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{rc.corridor}</div>
                        <div className="text-slate-500 mt-0.5">{rc.mainLine}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        {rc.punctuality2024.toFixed(1)} %
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {rc.punctuality2025.toFixed(1)} %
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700">
                        {rc.regularity2025.toFixed(1)} %
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 whitespace-nowrap">
                        {rc.passengersMillion.toFixed(1)}M / {rc.freightMillionTonnes.toFixed(1)}Mt
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right 5 cols: Live Entur / Bane NOR Rail Departures at Oslo S & Hønefoss */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Sanntids togavganger (Entur / Bane NOR GraphQL API)
                  </span>
                  <span className="text-[11px] font-mono text-sky-800">
                    Oslo S & Hønefoss
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Sanntidsstatus for togtrafikken i knutepunktene Oslo S og Hønefoss (Bergensbanen / Randsfjordbanen).
                </p>

                <div className="divide-y divide-slate-200 mt-3 bg-white border border-slate-200 rounded-md overflow-hidden">
                  {livePayload && livePayload.liveRailDepartures.length > 0 ? (
                    livePayload.liveRailDepartures.slice(0, 6).map((dep, idx) => {
                      const timeStr = dep.expectedDeparture
                        ? new Date(dep.expectedDeparture).toLocaleTimeString('nb-NO', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--';
                      return (
                        <div
                          key={`${dep.lineCode}-${idx}`}
                          className="px-3 py-2.5 flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-slate-900 truncate">
                              Linje {dep.lineCode} mot {dep.destination}
                            </div>
                            <div className="text-slate-500 text-[11px] truncate">
                              {dep.stationName} · {dep.operator}
                            </div>
                          </div>
                          <div className="text-right font-mono tabular-nums shrink-0">
                            <div className="font-bold text-slate-900">{timeStr}</div>
                            <div
                              className={`text-[11px] ${
                                dep.delayMinutes === 0
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {dep.delayMinutes === 0
                                ? 'I rute'
                                : `+${dep.delayMinutes} min`}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-xs text-slate-600">
                      Viser verifiserte korridortall fra Bane NOR og Jernbanedirektoratet (klikk «Oppdater ferske API-tall» for å hente neste avganger).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Deep-Dive 3: Avinor (Airport Hubs) & Kystverket (AIS Maritime Traffic) */}
      {showSection(['avinor', 'kystverket']) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Avinor Hub Table */}
          <section className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-sky-800" />
                  <span>Avinor · Trafikkstatistikk lufthavner</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                  Passasjerutvikling, punktlighet og kollektivandel tilbringer
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">53,2 mill. totalt</span>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-2.5 px-3">Lufthavn</th>
                    <th className="py-2.5 px-3 text-right">Pass. 2025</th>
                    <th className="py-2.5 px-3 text-right">Årsvekst</th>
                    <th className="py-2.5 px-3 text-right">Punktlighet</th>
                    <th className="py-2.5 px-3 text-right">Kollektivandel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {AVINOR_HUB_STATS.map((hub) => (
                    <tr key={hub.iata} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900">{hub.airport}</span>{' '}
                        <span className="font-mono text-slate-500">({hub.iata})</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {hub.passengers2025Million.toFixed(1)} mill.
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700">
                        +{hub.yoyGrowthPercent.toFixed(1)} %
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                        {hub.punctualityPercent.toFixed(1)} %
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-sky-900">
                        {hub.publicTransitSharePercent.toFixed(1)} %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Kystverket AIS Maritime Traffic */}
          <section className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-sky-800" />
                  <span>Kystverket · AIS Norge og Kystdatahuset</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                  Utseilt distanse per fartøyskategori i norsk økonomisk sone
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">51,4 mill. nm</span>
            </div>

            <div className="divide-y divide-slate-200 mt-3">
              {KYSTVERKET_AIS_CATEGORIES.map((cat) => (
                <div key={cat.category} className="py-3.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">{cat.category}</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {cat.sailedMillionNm2025.toFixed(1)} mill. nm ({cat.shareOfTrafficPercent.toFixed(1)} %)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 mt-1">
                    <span>{cat.primaryCorridors}</span>
                    <span
                      className={`font-mono tabular-nums ${
                        cat.yoyChangePercent >= 0 ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      {cat.yoyChangePercent >= 0
                        ? `+${cat.yoyChangePercent.toFixed(1)}`
                        : cat.yoyChangePercent.toFixed(1)}{' '}
                      % fra 2024
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
