/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NTP_AGENCIES, AgencyId } from './data/ntpData';
import { StrategicOverviewModule } from './components/StrategicOverviewModule';
import { AgencyFreshDataModule } from './components/AgencyFreshDataModule';
import { CorridorInrixModule } from './components/CorridorInrixModule';
import { MobilityAndFreightModule } from './components/MobilityAndFreightModule';
import { PdfSourceModal } from './components/PdfSourceModal';
import { FileText, RotateCcw } from 'lucide-react';

type ActiveTab = 'oversikt' | 'etatsdata' | 'e16-inrix' | 'mobilitet-gods';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('oversikt');
  const [selectedAgency, setSelectedAgency] = useState<AgencyId>('alle');
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [pdfPage, setPdfPage] = useState<number>(1);

  const handleOpenPdfPage = (page: number) => {
    setPdfPage(page);
    setPdfModalOpen(true);
  };

  const activeAgencyObj =
    NTP_AGENCIES.find((a) => a.id === selectedAgency) || NTP_AGENCIES[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#oversikt"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('oversikt');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            NTP 2029–2040 Datadashboard
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Hovednavigasjon"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#oversikt"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('oversikt');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'oversikt'
                  ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-sky-800'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Strategisk oversikt
            </a>
            <a
              href="#etatsdata"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('etatsdata');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'etatsdata'
                  ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-sky-800'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Etatsdata (6 etater)
            </a>
            <a
              href="#e16-inrix"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('e16-inrix');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'e16-inrix'
                  ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-sky-800'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              E16 / Rv7 Inrix-analyse
            </a>
            <a
              href="#mobilitet-gods"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('mobilitet-gods');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'mobilitet-gods'
                  ? 'text-slate-950 font-semibold underline underline-offset-8 decoration-2 decoration-sky-800'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Mobilitet 360 og sjømat
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenPdfPage(1)}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kildedokument og CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Context Header & Interactive Agency Filter Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                <span>Nasjonal transportplan 2029–2040</span>
                <span aria-hidden="true">·</span>
                <span>Veien mot bruk av mere dynamiske data / sensordata</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">Oslo, 5. november 2026</span>
                <span aria-hidden="true">·</span>
                <span>Workshop-grunnlag (29.09.2026)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
                {activeTab === 'oversikt' &&
                  'Strategisk status, modellkalibrering (RTM/NTM) og effektmåling'}
                {activeTab === 'etatsdata' &&
                  'Ferske nøkkeltall og åpne sanntidsdata fra de seks transportvirksomhetene'}
                {activeTab === 'e16-inrix' &&
                  'Dynamiske strekningsdata: E16 og Rv7 Sokna – Sollihøgda (57,2 km)'}
                {activeTab === 'mobilitet-gods' &&
                  'Mobilitet 360 («Pulsen på byen») og nordnorske sjømatkorridorer'}
              </h1>
            </div>

            {/* Mobile Tab Switcher (visible below md breakpoint) */}
            <div className="flex md:hidden flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start">
              {[
                { id: 'oversikt', label: 'Oversikt' },
                { id: 'etatsdata', label: '6 Etater' },
                { id: 'e16-inrix', label: 'E16/Rv7' },
                { id: 'mobilitet-gods', label: 'M360 & Gods' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as ActiveTab)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 6 NTP Transport Agencies Filter Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500 mr-1 whitespace-nowrap">
                Transportvirksomhet:
              </span>
              {NTP_AGENCIES.map((agency) => {
                const isSelected = selectedAgency === agency.id;
                return (
                  <button
                    key={agency.id}
                    onClick={() => setSelectedAgency(agency.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {agency.shortName}
                  </button>
                );
              })}
            </div>

            {selectedAgency !== 'alle' && (
              <button
                onClick={() => setSelectedAgency('alle')}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Nullstill filter</span>
              </button>
            )}
          </div>

          {/* Active Agency Context Readout */}
          {selectedAgency !== 'alle' && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900">{activeAgencyObj.name}:</strong>{' '}
                {activeAgencyObj.role}
              </div>
              <div className="font-mono text-slate-500">
                Primærkilder: {activeAgencyObj.primaryDataSources.join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 1440px Dashboard Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8">
        {activeTab === 'oversikt' && (
          <StrategicOverviewModule
            selectedAgency={selectedAgency}
            onNavigateTab={setActiveTab}
            onOpenPdfPage={handleOpenPdfPage}
          />
        )}

        {activeTab === 'etatsdata' && (
          <AgencyFreshDataModule
            selectedAgency={selectedAgency}
            onSelectAgency={setSelectedAgency}
          />
        )}

        {activeTab === 'e16-inrix' && (
          <CorridorInrixModule onOpenPdfPage={handleOpenPdfPage} />
        )}

        {activeTab === 'mobilitet-gods' && (
          <MobilityAndFreightModule onOpenPdfPage={handleOpenPdfPage} />
        )}
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">
              Nasjonal transportplan 2029–2040
            </span>
            <span aria-hidden="true">·</span>
            <span>Avinor</span>
            <span aria-hidden="true">·</span>
            <span>Bane NOR</span>
            <span aria-hidden="true">·</span>
            <span>Jernbanedirektoratet</span>
            <span aria-hidden="true">·</span>
            <span>Kystverket</span>
            <span aria-hidden="true">·</span>
            <span>Nye Veier</span>
            <span aria-hidden="true">·</span>
            <span>Statens vegvesen</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenPdfPage(10)}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Se dokumentasjonsreferanse (PDF s. 10)
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.ntpmetode.no"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 font-mono"
            >
              www.ntpmetode.no
            </a>
          </div>
        </div>
      </footer>

      {/* Embedded PDF Source & CSV Export Modal */}
      <PdfSourceModal
        isOpen={pdfModalOpen}
        initialPage={pdfPage}
        onSelectPage={setPdfPage}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
}
