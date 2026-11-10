import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import {
  E16_RV7_SEGMENTS,
  MOBILITET_360_CITIES,
  SEAFOOD_CORRIDORS,
  SAGA_ARCGIS_LAYERS,
} from '../data/ntpData';
import { CROSS_AGENCY_FRESH_KPIS } from '../data/agencyFreshData';

interface PdfSourceModalProps {
  isOpen: boolean;
  initialPage: number;
  onSelectPage: (page: number) => void;
  onClose: () => void;
}

const PDF_SLIDE_INDEX = [
  { page: 1, title: 'Forside: Nasjonal transportplan 2029–2040 (Oslo, 5. nov 2026)' },
  { page: 2, title: 'Hvorfor mere datadrevet (7 strategiske hovedgrunner)' },
  { page: 3, title: 'NTP behov (Effekt, Cube, ArcGIS, Inrix, Ad-hoc verktøy)' },
  { page: 4, title: 'Hvor skal vi bruke dynamiske data (Strekninger, Sjømat 46 mrd., RVU, M360)' },
  { page: 5, title: 'Eksempel E16 kryss E16/Rv7 (Inrix Congestion Scan 57,2 km)' },
  { page: 6, title: 'Dataplattform med geo-kapabiliteter (SAGA SKY og ArcGIS)' },
  { page: 7, title: 'Mobilitet 360 – «Pulsen på byen» (Byvekstavtaler og 3-trinnsplan)' },
  { page: 8, title: 'Interimløsning for NTP-analyse og innsikt (6–12 mnd i Sky)' },
  { page: 9, title: 'Hva løses ikke med midlertidig løsning (Deling, Sanntid, Styring)' },
  { page: 10, title: 'Dokumentasjon og rapporter (www.ntpmetode.no)' },
];

export const PdfSourceModal: React.FC<PdfSourceModalProps> = ({
  isOpen,
  initialPage,
  onSelectPage,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const rows: string[] = [
      'Kategori;Enhet_Strekning;Nokkeltall_1;Nokkeltall_2;Kilde_Side',
      ...CROSS_AGENCY_FRESH_KPIS.map(
        (k) =>
          `Etatsdata_${k.agencyName};${k.metricName};2025: ${k.value2025};2026: ${k.latest2026Status};${k.sourceSystem}`
      ),
      ...E16_RV7_SEGMENTS.map(
        (s) =>
          `E16_Rv7_Inrix;Km ${s.km.toFixed(1)} ${s.label};Snitthastighet ${s.avgSpeedKmh} km/t;ÅDT ${s.aadt};PDF side 5`
      ),
      ...MOBILITET_360_CITIES.flatMap((c) =>
        c.modes.map(
          (m) =>
            `Mobilitet_360_${c.city};${m.mode};Andel ${m.sharePercent}%;Årsvekst ${m.yoyChangePercent}%;PDF side 7`
        )
      ),
      ...SEAFOOD_CORRIDORS.map(
        (sc) =>
          `Sjomat_NordNorge;${sc.region};${sc.tonnage} tonn;${sc.exportValueBillionNok} mrd kr;PDF side 4`
      ),
      ...SAGA_ARCGIS_LAYERS.map(
        (l) =>
          `SAGA_SKY_ArcGIS;Lag ${l.number}: ${l.name};${l.maturityLabel};${l.ntpUseCase};PDF side 6`
      ),
    ];

    const blob = new Blob(['\uFEFF' + rows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NTP_2029_2040_Dynamiske_Data_Nokkeltall.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-6xl h-[86vh] flex flex-col overflow-hidden shadow-xl">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-5 h-5 text-sky-800 shrink-0" />
            <div className="truncate">
              <h2 id="pdf-modal-title" className="text-base font-bold text-slate-900 truncate">
                Kildedokument: Nasjonal transportplan 2029–2040 (Side {initialPage} av 10)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksporter datasett (CSV)</span>
            </button>
            <a
              href={`/assets/aistudio/20261105_NTP_data_b39b3038.pdf#page=${initialPage}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-white bg-sky-900 hover:bg-sky-800 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Åpne PDF i ny fane</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 cursor-pointer"
              aria-label="Lukk kildedokument"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Left Slide Index + Right Embedded PDF Viewer */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
          <div className="lg:col-span-4 border-r border-slate-200 overflow-y-auto p-4 bg-slate-50 space-y-1.5">
            <div className="text-xs font-semibold text-slate-500 px-2 pb-2">
              LYSBILDER I PRESENTASJONEN (05.11.2026)
            </div>
            {PDF_SLIDE_INDEX.map((item) => {
              const isSelected = item.page === initialPage;
              return (
                <button
                  key={item.page}
                  onClick={() => onSelectPage(item.page)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-900 text-white font-semibold'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span
                    className={`font-mono tabular-nums shrink-0 ${
                      isSelected ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    s. {String(item.page).padStart(2, '0')}
                  </span>
                  <span className="leading-snug">{item.title}</span>
                </button>
              );
            })}

            <div className="mt-4 pt-4 border-t border-slate-200 px-2 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Ekstern dokumentasjon:</div>
              <div>
                Metodikk og rapporter er publisert på{' '}
                <a
                  href="https://www.ntpmetode.no"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-800 underline font-mono"
                >
                  www.ntpmetode.no
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-100 h-full min-h-[400px]">
            <iframe
              key={initialPage}
              src={`/assets/aistudio/20261105_NTP_data_b39b3038.pdf#page=${initialPage}`}
              title={`NTP 2029-2040 PDF side ${initialPage}`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
