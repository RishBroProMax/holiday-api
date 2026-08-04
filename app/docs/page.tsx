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
  FileSpreadsheet,
  Activity,
  Server,
  Play,
  CheckSquare,
  Menu,
  X,
  Lock,
  Cpu,
  Info,
  Sliders,
  Flame,
  Package
} from 'lucide-react';

interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointDoc {
  id: string;
  version: 'v1' | 'v2';
  categoryLabel: string;
  method: 'GET';
  path: string;
  title: string;
  description: string;
  params?: EndpointParam[];
  exampleUrl: string;
  responseExample: object;
}

const docsEndpoints: EndpointDoc[] = [
  {
    id: 'v2-holidays-list',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays',
    title: 'Advanced Holidays Query (v2 / v3 Beta)',
    description: 'API v2 / v3 Beta endpoint featuring full-text search, multi-field filtering, sorting (date_asc, date_desc, name_asc), Poya flag, and page-based pagination.',
    params: [
      { name: 'search', type: 'query string', required: false, description: 'Full-text search keyword (matches name, description, date)' },
      { name: 'year', type: 'integer', required: false, description: 'Filter by year (2024 to 2045)' },
      { name: 'month', type: 'integer', required: false, description: 'Filter by month number (1 to 12)' },
      { name: 'type', type: 'string', required: false, description: 'Filter by holiday type: buddhist, hindu, islamic, christian, national, international' },
      { name: 'isPoya', type: 'boolean', required: false, description: 'Set to true to filter only Full Moon Poya days' },
      { name: 'sort', type: 'string', required: false, description: 'Sort direction: date_asc, date_desc, name_asc, name_desc. Default: date_asc' },
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination. Default: 1' },
      { name: 'limit', type: 'integer', required: false, description: 'Results per page (1 to 200). Default: 50' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays?search=poya&sort=date_asc&limit=10',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      pagination: {
        total: 12,
        page: 1,
        limit: 10,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false
      },
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
      ],
      meta: {
        timezone: 'Asia/Colombo',
        filtersApplied: {
          search: 'poya',
          sort: 'date_asc'
        }
      }
    }
  },
  {
    id: 'v2-upcoming',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays/upcoming',
    title: 'Multi-Upcoming Holidays (v2 / v3 Beta)',
    description: 'Fetch the next N upcoming holidays from today in Asia/Colombo timezone using the limit parameter.',
    params: [
      { name: 'limit', type: 'integer', required: false, description: 'Number of upcoming holidays to return (1 to 20). Default: 1' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays/upcoming?limit=3',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      count: 3,
      data: [
        {
          id: '2026-08-26-milad-un-nabi-holy-prophet-s-birthday',
          name: "Milad-Un-Nabi (Holy Prophet's Birthday)",
          date: '2026-08-26',
          daysUntil: 23
        },
        {
          id: '2026-09-25-binara-full-moon-poya-day',
          name: 'Binara Full Moon Poya Day',
          date: '2026-09-25',
          daysUntil: 53
        }
      ],
      meta: {
        timezone: 'Asia/Colombo',
        limitRequested: 3
      }
    }
  },
  {
    id: 'v2-search',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays/search',
    title: 'Full-Text Search Endpoint (v2 / v3 Beta)',
    description: 'Dedicated search endpoint querying holiday names, descriptions, and date strings.',
    params: [
      { name: 'q', type: 'query string', required: true, description: 'Search term query string (e.g. poya, new year, april)' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays/search?q=poya',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      query: 'poya',
      count: 264,
      data: [
        {
          id: '2026-01-03-duruthu-full-moon-poya-day',
          name: 'Duruthu Full Moon Poya Day',
          date: '2026-01-03',
          type: 'buddhist'
        }
      ]
    }
  },
  {
    id: 'v2-poyas',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays/poya',
    title: 'Sri Lanka Poya Days Catalog (v2 / v3 Beta)',
    description: 'Fetch Sri Lanka Full Moon Poya days specifically, with optional year and month filters.',
    params: [
      { name: 'year', type: 'integer', required: false, description: 'Filter Poya days by year (e.g. 2026)' },
      { name: 'month', type: 'integer', required: false, description: 'Filter Poya days by month number (1 to 12)' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays/poya?year=2026',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      count: 13,
      data: [
        {
          id: '2026-08-27-nikini-full-moon-poya-day',
          name: 'Nikini Full Moon Poya Day',
          date: '2026-08-27',
          year: 2026,
          month: 8,
          day: 27,
          dayOfWeek: 'Thursday',
          type: 'buddhist'
        }
      ]
    }
  },
  {
    id: 'v2-next-poya',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays/next-poya',
    title: 'Next Full Moon Poya Day (v2 / v3 Beta)',
    description: 'Fetch the immediate next Full Moon Poya Day in Sri Lanka timezone relative to today, including a live daysUntil countdown integer.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays/next-poya',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      data: {
        id: '2026-08-27-nikini-full-moon-poya-day',
        name: 'Nikini Full Moon Poya Day',
        date: '2026-08-27',
        daysUntil: 24
      }
    }
  },
  {
    id: 'v2-religion',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays/religion/[religion]',
    title: 'Filter by Religion (v2 / v3 Beta)',
    description: 'Filter Sri Lanka holidays by religious tradition: buddhist, hindu, islamic, christian, or national.',
    params: [
      { name: 'religion', type: 'path string', required: true, description: 'Target religion: buddhist, hindu, islamic, christian, national' },
      { name: 'year', type: 'query integer', required: false, description: 'Optional year filter' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays/religion/buddhist?year=2026',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      religion: 'buddhist',
      count: 14,
      data: [
        {
          id: '2026-08-27-nikini-full-moon-poya-day',
          name: 'Nikini Full Moon Poya Day',
          date: '2026-08-27',
          type: 'buddhist'
        }
      ]
    }
  },
  {
    id: 'v2-stats',
    version: 'v2',
    categoryLabel: 'API v2 (3.0 Beta)',
    method: 'GET',
    path: '/api/v2/holidays/stats',
    title: 'Dataset Analytics & System Telemetry (v2 / v3 Beta)',
    description: 'Retrieve overall dataset distribution statistics broken down by religion, Poya counts, public vs bank flags, and live connected user telemetry.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v2/holidays/stats',
    responseExample: {
      success: true,
      apiVersion: '3.0.0-beta',
      data: {
        dataset: {
          totalHolidays: 858,
          yearCoverage: '2024–2045',
          totalYears: 22,
          publicHolidaysCount: 572,
          bankHolidaysCount: 572,
          poyaDaysCount: 264,
          breakdownByType: {
            buddhist: 264,
            national: 132,
            hindu: 154,
            islamic: 154,
            christian: 88,
            international: 66
          }
        },
        telemetry: {
          totalRequestsServed: 14360,
          activeUsers: 24,
          status: 'operational'
        }
      }
    }
  },
  {
    id: 'v1-holidays-list',
    version: 'v1',
    categoryLabel: 'API v1 (Legacy Stable)',
    method: 'GET',
    path: '/api/v1/holidays',
    title: 'List All Holidays (v1 Stable)',
    description: 'Retrieve cataloged Sri Lankan public, bank, and Poya holidays across 2024–2045 with basic filters.',
    params: [
      { name: 'year', type: 'integer', required: false, description: 'Target year between 2024 and 2045' },
      { name: 'month', type: 'integer', required: false, description: 'Target month number (1 to 12)' },
      { name: 'type', type: 'string', required: false, description: 'Filter by holiday type: buddhist, hindu, islamic, christian, national' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays?year=2026',
    responseExample: {
      success: true,
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
    id: 'v1-upcoming',
    version: 'v1',
    categoryLabel: 'API v1 (Legacy Stable)',
    method: 'GET',
    path: '/api/v1/holidays/upcoming',
    title: 'Next Single Holiday (v1 Stable)',
    description: 'Returns the single next upcoming holiday relative to current time in Sri Lanka with countdown integer.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/upcoming',
    responseExample: {
      success: true,
      count: 1,
      data: {
        id: '2026-08-26-milad-un-nabi-holy-prophet-s-birthday',
        name: "Milad-Un-Nabi (Holy Prophet's Birthday)",
        date: '2026-08-26',
        daysUntil: 23
      }
    }
  },
  {
    id: 'v1-today',
    version: 'v1',
    categoryLabel: 'API v1 (Legacy Stable)',
    method: 'GET',
    path: '/api/v1/holidays/today',
    title: 'Check Today Status (v1 Stable)',
    description: 'Checks if today (in Asia/Colombo timezone) is an official Sri Lankan holiday.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/today',
    responseExample: {
      success: true,
      isHolidayToday: false,
      count: 0,
      data: []
    }
  },
  {
    id: 'export',
    version: 'v1',
    categoryLabel: 'Data Exports',
    method: 'GET',
    path: '/api/v1/holidays/export',
    title: 'Download Full Dataset (JSON / CSV)',
    description: 'Export all 858+ Sri Lankan public holidays for offline mobile apps, Excel spreadsheets, or database seeding.',
    params: [
      { name: 'format', type: 'query string', required: false, description: 'Export format: json or csv. Default: json' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/export?format=csv',
    responseExample: {
      format: 'csv',
      totalRecords: 858,
      downloadUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/export?format=csv'
    }
  },
  {
    id: 'health',
    version: 'v1',
    categoryLabel: 'Telemetry & Diagnostics',
    method: 'GET',
    path: '/api/v1/health',
    title: 'API System Health & Diagnostics',
    description: 'Comprehensive system health check returning dataset integrity, active memory stats, uptime, rate limiter status, and telemetry status.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/health',
    responseExample: {
      status: 'healthy',
      statusCode: 200,
      timestamp: '2026-08-03T07:00:00.000Z',
      version: '2.5.0',
      uptime: { seconds: 3600, formatted: '1h 0m 0s' },
      checks: {
        dataset: { status: 'healthy', totalHolidaysCount: 858 },
        telemetry: { activeSessions: 24, totalRequestsServed: 14360 }
      }
    }
  }
];

export default function NativeDocsPage() {
  const [activeEndpointId, setActiveEndpointId] = useState<string>('v2-holidays-list');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [versionFilter, setVersionFilter] = useState<'all' | 'v2' | 'v1'>('all');

  // Live Test Playground inside Docs
  const [playgroundOutput, setPlaygroundOutput] = useState<string | null>(null);
  const [playgroundStatus, setPlaygroundStatus] = useState<string | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);

  type CodeTab = 'curl' | 'fetch' | 'nextjs' | 'python';
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('fetch');

  const activeDoc = docsEndpoints.find(e => e.id === activeEndpointId) || docsEndpoints[0];

  // Filtered Endpoints for Sidebar
  const filteredEndpoints = docsEndpoints.filter(e => {
    const matchVersion = versionFilter === 'all' ? true : e.version === versionFilter;
    if (!matchVersion) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return e.title.toLowerCase().includes(q) ||
           e.path.toLowerCase().includes(q) ||
           e.description.toLowerCase().includes(q);
  });

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Run live test right inside docs
  const testEndpointLive = async (url: string) => {
    setPlaygroundLoading(true);
    setPlaygroundOutput('Sending HTTP request...');
    try {
      const res = await fetch(url);
      const data = await res.json();
      setPlaygroundStatus(`HTTP ${res.status} ${res.statusText}`);
      setPlaygroundOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setPlaygroundStatus('HTTP ERROR');
      setPlaygroundOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const getCodeForTab = () => {
    const url = activeDoc.exampleUrl;
    switch (activeCodeTab) {
      case 'curl':
        return `curl -X GET "${url}" -H "Accept: application/json"`;
      case 'fetch':
        return `fetch("${url}")
  .then(res => res.json())
  .then(data => console.log(data));`;
      case 'nextjs':
        return `// Next.js 14+ (App Router Server Component)
async function getSriLankanHolidays() {
  const res = await fetch("${url}", { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}`;
      case 'python':
        return `import requests

res = requests.get("${url}")
print(res.json())`;
    }
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[170px]" />
        <div className="absolute top-96 -right-40 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[170px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="border-b border-[#1A2333] backdrop-blur-xl bg-[#06080E]/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-lg border border-amber-400/20 bg-[#0F1623] p-1"
              />
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                  Sri Lankan Holiday API
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Documentation • v3.0.0 Beta (v2 Active)
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-4 text-xs sm:text-sm font-semibold">
              <Link href="/" className="text-gray-400 hover:text-white transition px-3 py-2">
                ← Back to Home
              </Link>
              <a
                href="https://github.com/RishBroProMax/holiday-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#0F1623] border border-[#1A2333] hover:border-amber-400/50 text-white px-4 py-2 rounded-xl transition"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0F1623] border border-[#1A2333] text-gray-300"
              aria-label="Toggle Docs Navigation"
            >
              {mobileDrawerOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </header>

        {/* Main Portal Workspace */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Banner */}
          <div className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Release Candidate: API v2 & v3.0.0-Beta Endpoints Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
                Next.js API Documentation Portal
              </h1>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
                Complete REST specification for 858+ Sri Lankan public, bank, and Poya holidays (2024–2045). Free, open-source, zero authentication required, with built-in CORS and edge rate limiting.
              </p>

              <div className="flex flex-wrap gap-3 text-xs font-mono">
                <span className="bg-[#06080E] border border-[#1A2333] px-3.5 py-2 rounded-xl text-emerald-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> https://holiday.imrishmika.dev
                </span>
                <span className="bg-[#06080E] border border-[#1A2333] px-3.5 py-2 rounded-xl text-amber-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Rate Limit: 60 req / min
                </span>
                <span className="bg-[#06080E] border border-[#1A2333] px-3.5 py-2 rounded-xl text-rose-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Version: v2 & v3-Beta Active
                </span>
              </div>
            </div>
          </div>

          {/* Docs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className={`lg:col-span-4 ${mobileDrawerOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-5 shadow-xl sticky top-28 space-y-4">
                
                {/* Version Selector Tabs */}
                <div className="flex bg-[#06080E] p-1 rounded-xl border border-[#1A2333] text-xs font-mono">
                  <button
                    onClick={() => setVersionFilter('all')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${versionFilter === 'all' ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setVersionFilter('v2')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${versionFilter === 'v2' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    v2 (v3 Beta)
                  </button>
                  <button
                    onClick={() => setVersionFilter('v1')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${versionFilter === 'v1' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    v1 (Stable)
                  </button>
                </div>

                {/* Search Sidebar Filter */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1A2333] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Endpoint Items List */}
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredEndpoints.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => {
                        setActiveEndpointId(ep.id);
                        setMobileDrawerOpen(false);
                        setPlaygroundOutput(null);
                        setPlaygroundStatus(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between group ${
                        activeEndpointId === ep.id
                          ? 'bg-amber-500/10 border-amber-400/60 text-white shadow-md'
                          : 'bg-[#06080E] border-[#1A2333] text-gray-400 hover:text-white hover:border-gray-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded ${ep.version === 'v2' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                            {ep.method} {ep.version}
                          </span>
                          <span className="font-mono text-xs text-white font-semibold truncate max-w-[150px]">
                            {ep.path}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-amber-300 transition">
                          {ep.title}
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeEndpointId === ep.id ? 'rotate-90 text-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Endpoint Content Viewer */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDoc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8"
                >
                  {/* Endpoint Header Badge & Path */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {activeDoc.method}
                      </span>
                      <span className={`text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-xl ${activeDoc.version === 'v2' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        {activeDoc.version === 'v2' ? 'API v2 / v3 Beta' : 'API v1 Stable'}
                      </span>
                      <span className="font-mono text-base sm:text-2xl font-extrabold text-white tracking-tight">
                        {activeDoc.path}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">{activeDoc.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{activeDoc.description}</p>
                  </div>

                  {/* Request URL Box + Interactive Live Test Button */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Example Request URL</h3>
                      <button
                        onClick={() => copyText(activeDoc.exampleUrl, 'url')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs font-semibold transition"
                      >
                        {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'url' ? 'Copied!' : 'Copy URL'}</span>
                      </button>
                    </div>

                    <div className="bg-[#06080E] border border-[#1A2333] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs sm:text-sm">
                      <span className="text-amber-400 truncate w-full sm:w-auto">{activeDoc.exampleUrl}</span>
                      <button
                        onClick={() => testEndpointLive(activeDoc.exampleUrl)}
                        disabled={playgroundLoading}
                        className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition shrink-0 shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>{playgroundLoading ? 'Testing...' : 'Test Live'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Response Box if Tested */}
                  {playgroundOutput && (
                    <div className="bg-[#06080E] border border-amber-500/30 rounded-2xl p-4 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A2333] text-xs font-mono">
                        <span className="text-amber-400 font-bold flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Live Test Output
                        </span>
                        <span className="text-emerald-400 font-bold">{playgroundStatus}</span>
                      </div>
                      <pre className="font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto max-h-[300px]">
                        {playgroundOutput}
                      </pre>
                    </div>
                  )}

                  {/* Parameters Table */}
                  {activeDoc.params && activeDoc.params.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Parameters Specification</h3>
                      <div className="overflow-x-auto border border-[#1A2333] rounded-2xl">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-[#06080E] text-gray-400 border-b border-[#1A2333] font-mono">
                            <tr>
                              <th className="p-3.5 font-bold">Parameter</th>
                              <th className="p-3.5 font-bold">Type</th>
                              <th className="p-3.5 font-bold">Required</th>
                              <th className="p-3.5 font-bold">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A2333]">
                            {activeDoc.params.map(p => (
                              <tr key={p.name} className="hover:bg-[#121824]/50 transition">
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

                  {/* Code Generator Switcher */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Integration Code Generator</h3>
                      <button
                        onClick={() => copyText(getCodeForTab(), 'code')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs font-semibold transition"
                      >
                        {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'code' ? 'Copied Code!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <div className="flex gap-2 mb-3 border-b border-[#1A2333] pb-3 overflow-x-auto">
                      {[
                        { id: 'fetch', label: 'JS Fetch' },
                        { id: 'nextjs', label: 'Next.js 14+' },
                        { id: 'python', label: 'Python' },
                        { id: 'curl', label: 'cURL' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveCodeTab(t.id as CodeTab)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition ${
                            activeCodeTab === t.id
                              ? 'bg-amber-400 text-black font-bold'
                              : 'bg-[#06080E] text-gray-400 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#06080E] border border-[#1A2333] rounded-2xl p-4">
                      <pre className="font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto leading-relaxed">
                        {getCodeForTab()}
                      </pre>
                    </div>
                  </div>

                  {/* Response Payload Viewer */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span>Expected 200 OK Response Payload</span>
                      </h3>
                      <button
                        onClick={() => copyText(JSON.stringify(activeDoc.responseExample, null, 2), 'response')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-xs font-semibold transition"
                      >
                        {copiedKey === 'response' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'response' ? 'Copied JSON' : 'Copy JSON'}</span>
                      </button>
                    </div>

                    <div className="bg-[#06080E] border border-[#1A2333] rounded-2xl p-4">
                      <pre className="font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto max-h-[350px] leading-relaxed">
                        {JSON.stringify(activeDoc.responseExample, null, 2)}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1A2333] mt-24 py-10 bg-[#06080E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-gray-400 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-semibold text-white">Sri Lankan Holiday API Documentation Portal</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-bold">imrishmika.dev</a></span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub Repo</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
