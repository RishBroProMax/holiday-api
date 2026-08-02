'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Code,
  Terminal,
  Copy,
  CheckCircle,
  ExternalLink,
  Github,
  Zap,
  Globe,
  Check,
  Shield,
  Layers,
  ChevronRight,
  Search,
  Sparkles,
  ArrowRight,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';

interface EndpointDoc {
  id: string;
  method: 'GET';
  path: string;
  title: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  exampleUrl: string;
  responseExample: object;
}

const endpointsData: EndpointDoc[] = [
  {
    id: 'holidays-list',
    method: 'GET',
    path: '/api/v1/holidays',
    title: 'Get All Holidays with Filters',
    description: 'Retrieve a list of Sri Lankan public, bank, and Poya holidays across 2024–2045. Supports optional filtering by year, month, holiday type, category, or public/bank status.',
    params: [
      { name: 'year', type: 'integer', required: false, description: 'Filter by year (2024 to 2045). Default: current year.' },
      { name: 'month', type: 'integer', required: false, description: 'Filter by month number (1 to 12).' },
      { name: 'type', type: 'string', required: false, description: 'Filter by holiday type: buddhist, hindu, islamic, christian, national, international.' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category: public_and_bank, public_only, bank_only.' },
      { name: 'public', type: 'boolean', required: false, description: 'Set to true to return only public holidays.' },
      { name: 'bank', type: 'boolean', required: false, description: 'Set to true to return only bank holidays.' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays?year=2026&type=buddhist',
    responseExample: {
      success: true,
      count: 12,
      data: [
        {
          id: '2026-01-03-[#01-duruthu-full-moon-poya-day]',
          name: 'Duruthu Full Moon Poya Day',
          date: '2026-01-03',
          year: 2026,
          month: 1,
          day: 3,
          dayOfWeek: 'Saturday',
          type: 'buddhist',
          category: 'public_and_bank',
          isPublicHoliday: true,
          isBankHoliday: true,
          description: 'Commemorates the first visit of Lord Buddha to Sri Lanka.'
        }
      ],
      meta: {
        apiVersion: '2.5.0',
        timezone: 'Asia/Colombo'
      }
    }
  },
  {
    id: 'upcoming',
    method: 'GET',
    path: '/api/v1/holidays/upcoming',
    title: 'Get Next Upcoming Holiday',
    description: 'Returns the single next holiday occurring relative to current time in Sri Lanka (Asia/Colombo timezone), complete with a daysUntil countdown counter.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/upcoming',
    responseExample: {
      success: true,
      count: 1,
      data: {
        id: '2026-08-26-milad-un-nabi-holy-prophet-s-birthday',
        name: "Milad-Un-Nabi (Holy Prophet's Birthday)",
        date: '2026-08-26',
        year: 2026,
        month: 8,
        day: 26,
        dayOfWeek: 'Wednesday',
        type: 'islamic',
        category: 'public_and_bank',
        isPublicHoliday: true,
        isBankHoliday: true,
        description: "Celebrates the birthday of Prophet Muhammad (PBUH)."
      },
      meta: {
        apiVersion: '2.5.0',
        timezone: 'Asia/Colombo',
        daysUntil: 24,
        checkedDate: '2026-08-02'
      }
    }
  },
  {
    id: 'today',
    method: 'GET',
    path: '/api/v1/holidays/today',
    title: 'Check Today Status',
    description: 'Checks if today (in Asia/Colombo timezone) is an official Sri Lankan public holiday or Poya day.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/today',
    responseExample: {
      success: true,
      isHolidayToday: false,
      count: 0,
      data: [],
      meta: {
        apiVersion: '2.5.0',
        timezone: 'Asia/Colombo',
        checkedDate: '2026-08-02'
      }
    }
  },
  {
    id: 'year',
    method: 'GET',
    path: '/api/v1/holidays/year/:year',
    title: 'Get Holidays by Year',
    description: 'Fetches all public and bank holidays for a specific target calendar year between 2024 and 2045.',
    params: [
      { name: 'year', type: 'path integer', required: true, description: 'The target year (e.g. 2026)' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/year/2026',
    responseExample: {
      success: true,
      year: 2026,
      count: 26,
      data: [
        {
          id: '2026-01-03-duruthu-full-moon-poya-day',
          name: 'Duruthu Full Moon Poya Day',
          date: '2026-01-03',
          year: 2026,
          month: 1,
          day: 3,
          dayOfWeek: 'Saturday',
          type: 'buddhist',
          category: 'public_and_bank',
          isPublicHoliday: true,
          isBankHoliday: true
        }
      ]
    }
  },
  {
    id: 'date',
    method: 'GET',
    path: '/api/v1/holidays/date/:date',
    title: 'Check Specific Date Status',
    description: 'Query whether a specific YYYY-MM-DD date is a Sri Lankan holiday.',
    params: [
      { name: 'date', type: 'path string', required: true, description: 'Date in YYYY-MM-DD format (e.g. 2026-04-14)' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/date/2026-04-14',
    responseExample: {
      success: true,
      date: '2026-04-14',
      isHoliday: true,
      count: 1,
      data: [
        {
          id: '2026-04-14-sinhala-and-tamil-new-year-day',
          name: 'Sinhala & Tamil New Year Day',
          date: '2026-04-14',
          year: 2026,
          month: 4,
          day: 14,
          dayOfWeek: 'Tuesday',
          type: 'national',
          category: 'public_and_bank',
          isPublicHoliday: true,
          isBankHoliday: true
        }
      ]
    }
  },
  {
    id: 'export',
    method: 'GET',
    path: '/api/v1/holidays/export',
    title: 'Export Full Dataset (JSON / CSV)',
    description: 'Download the complete 22-year (2024–2045) holiday dataset in JSON or CSV format.',
    params: [
      { name: 'format', type: 'string', required: false, description: 'Export file format: json or csv. Default: json.' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/export?format=csv',
    responseExample: {
      format: 'csv',
      content: 'ID,Name,Date,Year,Month,Day,DayOfWeek,Type,Category,IsPublicHoliday,IsBankHoliday\n...'
    }
  },
  {
    id: 'stats',
    method: 'GET',
    path: '/api/v1/holidays/stats',
    title: 'Real-Time API Telemetry Stats',
    description: 'Fetch live system metrics including active connected user sessions, total requests served, and uptime.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/stats',
    responseExample: {
      success: true,
      data: {
        totalRequestsServed: 14285,
        activeUsers: 24,
        uptimeSeconds: 840,
        status: 'operational',
        timestamp: '2026-08-02T15:10:00.000Z'
      }
    }
  }
];

export default function NativeDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('holidays-list');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const activeDoc = endpointsData.find(e => e.id === activeEndpoint) || endpointsData[0];

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(id);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Background Animated Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px]" />
        <div className="absolute top-96 -right-40 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
        <header className="border-b border-[#1F293D] backdrop-blur-xl bg-[#0B0E14]/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-lg border border-amber-400/20 bg-[#121824] p-1"
              />
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                  Sri Lankan Holiday API
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  API Documentation • v2.5.0
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold">
              <Link href="/" className="text-gray-400 hover:text-white transition px-3 py-2">
                ← Back to Home
              </Link>
              <a
                href="https://github.com/RishBroProMax/holiday-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#121824] border border-[#1F293D] hover:border-amber-400/50 text-white px-4 py-2 rounded-xl transition"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header Hero Banner */}
          <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Interactive Developer API Reference</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                Official REST API Documentation
              </h1>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
                Explore all 858+ Sri Lankan public, bank, and Poya holiday endpoints (2024–2045). Zero authentication required, CORS enabled, with automatic sliding-window rate limiting.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <span className="bg-[#07090E] border border-[#1F293D] px-3.5 py-2 rounded-xl text-emerald-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Base URL: https://holiday.imrishmika.dev
                </span>
                <span className="bg-[#07090E] border border-[#1F293D] px-3.5 py-2 rounded-xl text-amber-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Rate Limit: 60 req / min
                </span>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Endpoint Sidebar + Documentation Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar: Endpoint Selector */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" /> Endpoint Directory
              </h2>

              <div className="space-y-2">
                {endpointsData.map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setActiveEndpoint(ep.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between group ${
                      activeEndpoint === ep.id
                        ? 'bg-amber-500/10 border-amber-400/60 text-white shadow-lg'
                        : 'bg-[#121824] border-[#1F293D] text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs text-white font-semibold">{ep.path}</span>
                      </div>
                      <div className="text-xs font-medium text-gray-400 group-hover:text-amber-300 transition">
                        {ep.title}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeEndpoint === ep.id ? 'rotate-90 text-amber-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel: Detailed Active Endpoint Specs */}
            <div className="lg:col-span-8">
              <motion.div
                key={activeDoc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8"
              >
                {/* Title & Endpoint Badge */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {activeDoc.method}
                    </span>
                    <span className="font-mono text-base sm:text-xl font-bold text-white tracking-tight">
                      {activeDoc.path}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">{activeDoc.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{activeDoc.description}</p>
                </div>

                {/* Example Endpoint Call Box */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Example Request URL</span>
                    <button
                      onClick={() => copyText(activeDoc.exampleUrl, 'url')}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs transition"
                    >
                      {copiedPath === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPath === 'url' ? 'Copied!' : 'Copy URL'}</span>
                    </button>
                  </h3>
                  <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4 font-mono text-xs sm:text-sm text-amber-400 overflow-x-auto">
                    {activeDoc.exampleUrl}
                  </div>
                </div>

                {/* Query & Path Parameters Table */}
                {activeDoc.params && activeDoc.params.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Parameters</h3>
                    <div className="overflow-x-auto border border-[#1F293D] rounded-2xl">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#07090E] text-gray-400 border-b border-[#1F293D] font-mono">
                          <tr>
                            <th className="p-3.5 font-bold">Parameter</th>
                            <th className="p-3.5 font-bold">Type</th>
                            <th className="p-3.5 font-bold">Required</th>
                            <th className="p-3.5 font-bold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F293D]">
                          {activeDoc.params.map(p => (
                            <tr key={p.name} className="hover:bg-[#182030]/50 transition">
                              <td className="p-3.5 font-mono text-amber-400 font-bold">{p.name}</td>
                              <td className="p-3.5 font-mono text-cyan-400">{p.type}</td>
                              <td className="p-3.5">
                                {p.required ? (
                                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Required</span>
                                ) : (
                                  <span className="text-gray-500 text-xs">Optional</span>
                                )}
                              </td>
                              <td className="p-3.5 text-gray-300">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response Payload Viewer */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Example Response (200 OK)</span>
                    <button
                      onClick={() => copyText(JSON.stringify(activeDoc.responseExample, null, 2), 'response')}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs transition"
                    >
                      {copiedPath === 'response' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPath === 'response' ? 'Copied JSON' : 'Copy JSON'}</span>
                    </button>
                  </h3>
                  <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4 overflow-hidden">
                    <pre className="font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto max-h-[350px] leading-relaxed">
                      {JSON.stringify(activeDoc.responseExample, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Quick cURL Code Snippet */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>cURL Command</span>
                    <button
                      onClick={() => copyText(`curl -X GET "${activeDoc.exampleUrl}"`, 'curl')}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs transition"
                    >
                      {copiedPath === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPath === 'curl' ? 'Copied cURL' : 'Copy cURL'}</span>
                    </button>
                  </h3>
                  <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
                    curl -X GET "{activeDoc.exampleUrl}"
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1F293D] mt-24 py-10 bg-[#0B0E14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-gray-400 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-semibold text-white">Sri Lankan Holiday API</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-bold">imrishmika.dev</a></span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
