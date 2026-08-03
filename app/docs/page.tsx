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
  Info
} from 'lucide-react';

interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointDoc {
  id: string;
  category: 'getting-started' | 'core' | 'exports' | 'health';
  categoryLabel: string;
  method: 'GET';
  path: string;
  title: string;
  description: string;
  params?: EndpointParam[];
  exampleUrl: string;
  responseExample: object;
  errorExamples?: { status: number; title: string; payload: object }[];
}

const docsEndpoints: EndpointDoc[] = [
  {
    id: 'overview',
    category: 'getting-started',
    categoryLabel: 'Getting Started',
    method: 'GET',
    path: '/api',
    title: 'API Quick Start & Base Endpoint',
    description: 'The root API endpoint returns complete API directory metadata, version information, base URLs, and active endpoint references.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api',
    responseExample: {
      name: 'Sri Lankan Holiday API',
      version: '2.5.0',
      description: 'A free, open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024–2045.',
      website: 'https://holiday.imrishmika.dev',
      documentation: 'https://holiday.imrishmika.dev/docs',
      github: 'https://github.com/RishBroProMax/holiday-api',
      endpoints: {
        allHolidays: '/api/v1/holidays',
        upcoming: '/api/v1/holidays/upcoming',
        today: '/api/v1/holidays/today',
        export: '/api/v1/holidays/export',
        types: '/api/v1/holidays/types',
        health: '/api/v1/health',
        telemetryStats: '/api/v1/holidays/stats'
      }
    }
  },
  {
    id: 'holidays-list',
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays',
    title: 'List All Holidays with Filtering',
    description: 'Retrieve cataloged Sri Lankan public, bank, and Poya holidays across 2024–2045 (858+ total holidays). Supports filtering by year, month, holiday type, category, or public/bank flags.',
    params: [
      { name: 'year', type: 'integer', required: false, description: 'Target year between 2024 and 2045. Example: 2026' },
      { name: 'month', type: 'integer', required: false, description: 'Target month number (1 to 12). Example: 4' },
      { name: 'type', type: 'string', required: false, description: 'Filter by holiday religion/type: buddhist, hindu, islamic, christian, national, international.' },
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
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays/upcoming',
    title: 'Get Next Upcoming Holiday',
    description: 'Returns the single next upcoming Sri Lankan public holiday relative to the current time in Sri Lanka (Asia/Colombo timezone, UTC+5:30), complete with a daysUntil countdown integer.',
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
        daysUntil: 23,
        checkedDate: '2026-08-03'
      }
    }
  },
  {
    id: 'today',
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays/today',
    title: 'Check Today Holiday Status',
    description: 'Checks if today (in Asia/Colombo timezone) is an official Sri Lankan public or bank holiday.',
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
        checkedDate: '2026-08-03'
      }
    }
  },
  {
    id: 'year',
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays/year/:year',
    title: 'Get Holidays by Specific Year',
    description: 'Returns all cataloged Sri Lankan holidays for any specific year between 2024 and 2045.',
    params: [
      { name: 'year', type: 'path integer', required: true, description: 'Target calendar year (e.g. 2026)' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/year/2026',
    responseExample: {
      success: true,
      year: 2026,
      count: 26,
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
    id: 'month',
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays/month/:year/:month',
    title: 'Get Holidays by Year & Month',
    description: 'Fetch holidays falling within a specific month of a specific target year.',
    params: [
      { name: 'year', type: 'path integer', required: true, description: 'Target year (2024 to 2045)' },
      { name: 'month', type: 'path integer', required: true, description: 'Target month number (1 to 12)' }
    ],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/month/2026/4',
    responseExample: {
      success: true,
      year: 2026,
      month: 4,
      count: 3,
      data: [
        {
          id: '2026-04-13-day-prior-to-sinhala-and-tamil-new-year-day',
          name: 'Day prior to Sinhala & Tamil New Year Day',
          date: '2026-04-13',
          year: 2026,
          month: 4,
          day: 13,
          dayOfWeek: 'Monday',
          type: 'national',
          category: 'public_and_bank',
          isPublicHoliday: true,
          isBankHoliday: true
        }
      ]
    }
  },
  {
    id: 'date',
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays/date/:date',
    title: 'Check Specific Date Status',
    description: 'Query whether any given YYYY-MM-DD date is a Sri Lankan public holiday or Poya day.',
    params: [
      { name: 'date', type: 'path string', required: true, description: 'Date string in YYYY-MM-DD format (e.g. 2026-04-14)' }
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
    id: 'types',
    category: 'core',
    categoryLabel: 'Core API Endpoints',
    method: 'GET',
    path: '/api/v1/holidays/types',
    title: 'List Available Holiday Types',
    description: 'Returns a list of all holiday religion and observance type categories supported in the system.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/types',
    responseExample: {
      success: true,
      count: 6,
      data: [
        { id: 'buddhist', name: 'Buddhist (Full Moon Poya Days)', description: 'Astronomically calculated Poya observances' },
        { id: 'hindu', name: 'Hindu Festivals', description: 'Deepavali, Thai Pongal, Maha Shivaratri' },
        { id: 'islamic', name: 'Islamic Observances', description: 'Milad-Un-Nabi, Id-Ul-Fitr, Id-Ul-Alha' },
        { id: 'christian', name: 'Christian Observances', description: 'Good Friday, Christmas Day' },
        { id: 'national', name: 'National Holidays', description: 'Independence Day, New Year' },
        { id: 'international', name: 'International Observances', description: 'May Day (Labor Day)' }
      ]
    }
  },
  {
    id: 'export',
    category: 'exports',
    categoryLabel: 'Data Exports',
    method: 'GET',
    path: '/api/v1/holidays/export',
    title: 'Download Full Dataset (JSON / CSV)',
    description: 'Export all 858+ Sri Lankan public holidays for offline mobile apps, Excel spreadsheets, or database seeding.',
    params: [
      { name: 'format', type: 'query string', required: false, description: 'Export format: json or csv. Default: json.' }
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
    category: 'health',
    categoryLabel: 'Telemetry & Diagnostics',
    method: 'GET',
    path: '/api/v1/health',
    title: 'API System Diagnostics & Health Check',
    description: 'Comprehensive system diagnostics endpoint returning dataset integrity, active memory stats, uptime, rate limiter status, and telemetry status.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/health',
    responseExample: {
      status: 'healthy',
      statusCode: 200,
      timestamp: '2026-08-03T07:00:00.000Z',
      version: '2.5.0',
      service: 'Sri Lankan Holiday API',
      uptime: {
        seconds: 3600,
        formatted: '1h 0m 0s'
      },
      checks: {
        dataset: {
          status: 'healthy',
          totalHolidaysCount: 858,
          yearCoverage: '2024–2045 (22 Years)',
          timezone: 'Asia/Colombo'
        },
        telemetry: {
          status: 'healthy',
          activeSessions: 24,
          totalRequestsServed: 14350
        },
        rateLimiter: {
          status: 'healthy',
          limit: '60 requests / minute',
          protection: 'Active Edge Sliding Window'
        },
        systemMemory: {
          heapUsedMB: 18.5,
          heapTotalMB: 42.1,
          rssMB: 64.2
        }
      }
    }
  },
  {
    id: 'stats',
    category: 'health',
    categoryLabel: 'Telemetry & Diagnostics',
    method: 'GET',
    path: '/api/v1/holidays/stats',
    title: 'Real-Time API Telemetry Stats',
    description: 'Fetch live system metrics including active connected user sessions, total requests served, and uptime.',
    params: [],
    exampleUrl: 'https://holiday.imrishmika.dev/api/v1/holidays/stats',
    responseExample: {
      success: true,
      data: {
        totalRequestsServed: 14352,
        activeUsers: 24,
        uptimeSeconds: 3612,
        status: 'operational',
        timestamp: '2026-08-03T07:00:12.000Z'
      }
    }
  }
];

export default function NativeDocsPage() {
  const [activeEndpointId, setActiveEndpointId] = useState<string>('holidays-list');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Live Test Playground inside Docs
  const [playgroundOutput, setPlaygroundOutput] = useState<string | null>(null);
  const [playgroundStatus, setPlaygroundStatus] = useState<string | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);

  type CodeTab = 'curl' | 'fetch' | 'nextjs' | 'python';
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('fetch');

  const activeDoc = docsEndpoints.find(e => e.id === activeEndpointId) || docsEndpoints[0];

  // Filtered Endpoints for Sidebar
  const filteredEndpoints = docsEndpoints.filter(e => {
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
    <div className="min-h-screen bg-[#0B0E14] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[170px]" />
        <div className="absolute top-96 -right-40 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[170px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="border-b border-[#1F293D] backdrop-blur-xl bg-[#0B0E14]/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-lg border border-amber-400/20 bg-[#121824] p-1"
              />
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                  Sri Lankan Holiday API
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Documentation • v2.5.0
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
                className="flex items-center gap-2 bg-[#121824] border border-[#1F293D] hover:border-amber-400/50 text-white px-4 py-2 rounded-xl transition"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#121824] border border-[#1F293D] text-gray-300"
              aria-label="Toggle Docs Navigation"
            >
              {mobileDrawerOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </header>

        {/* Main Portal Workspace */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Banner */}
          <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Official Developer API Reference Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
                Next.js API Documentation
              </h1>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
                Complete REST API specification covering 858+ Sri Lankan public, bank, and Poya holidays (2024–2045). Free, open-source, zero authentication, CORS enabled with sliding-window DDoS protection.
              </p>

              <div className="flex flex-wrap gap-3 text-xs font-mono">
                <span className="bg-[#07090E] border border-[#1F293D] px-3.5 py-2 rounded-xl text-emerald-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> https://holiday.imrishmika.dev
                </span>
                <span className="bg-[#07090E] border border-[#1F293D] px-3.5 py-2 rounded-xl text-amber-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Rate Limit: 60 req / min
                </span>
                <span className="bg-[#07090E] border border-[#1F293D] px-3.5 py-2 rounded-xl text-cyan-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Auth: Public (None)
                </span>
              </div>
            </div>
          </div>

          {/* Docs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className={`lg:col-span-4 ${mobileDrawerOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-5 shadow-xl sticky top-28 space-y-4">
                {/* Search Sidebar Filter */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-[#07090E] border border-[#1F293D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Endpoint Items List */}
                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
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
                          : 'bg-[#07090E] border-[#1F293D] text-gray-400 hover:text-white hover:border-gray-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs text-white font-semibold truncate max-w-[170px] sm:max-w-[200px]">
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
                  className="bg-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8"
                >
                  {/* Endpoint Header Badge & Path */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono font-extrabold uppercase px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {activeDoc.method}
                      </span>
                      <span className="font-mono text-lg sm:text-2xl font-extrabold text-white tracking-tight">
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

                    <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs sm:text-sm">
                      <span className="text-amber-400 truncate w-full sm:w-auto">{activeDoc.exampleUrl}</span>
                      <button
                        onClick={() => testEndpointLive(activeDoc.exampleUrl)}
                        disabled={playgroundLoading}
                        className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>{playgroundLoading ? 'Testing...' : 'Test Live'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Response Box if Tested */}
                  {playgroundOutput && (
                    <div className="bg-[#07090E] border border-amber-500/30 rounded-2xl p-4 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F293D] text-xs font-mono">
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

                    <div className="flex gap-2 mb-3 border-b border-[#1F293D] pb-3 overflow-x-auto">
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
                              : 'bg-[#07090E] text-gray-400 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4">
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

                    <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4">
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
        <footer className="border-t border-[#1F293D] mt-24 py-10 bg-[#0B0E14]">
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
