'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Github,
  Globe,
  Shield,
  Sparkles,
  Flame,
  Menu,
  X,
  History,
  CheckCircle2,
  Tag,
  ArrowLeft,
  Calendar,
  Zap,
  Cpu
} from 'lucide-react';

interface ReleaseNote {
  version: string;
  tag: string;
  date: string;
  badge: 'Latest' | 'Stable' | 'Legacy';
  badgeColor: string;
  summary: string;
  changes: {
    category: 'Features' | 'Dataset' | 'Security' | 'Documentation';
    items: string[];
  }[];
}

const changelogData: ReleaseNote[] = [
  {
    version: 'v3.0.0 (Official Node.js Module Launch)',
    tag: 'v3.0.0',
    date: 'August 04, 2026',
    badge: 'Latest',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    summary: 'Official release of the zero-dependency, 100% offline-ready sri-lankan-holiday-api Node.js module on NPM with TypeScript typings, CJS/ESM dual builds, Vercel build pipeline integration, and dedicated /npm-module interactive documentation route.',
    changes: [
      {
        category: 'Features',
        items: [
          'Published official Node.js SDK (sri-lankan-holiday-api) supporting zero-network offline query execution.',
          'Bundled complete 858+ hand-verified Sri Lanka public, bank & Poya holiday dataset (2024–2045) inside the package.',
          'Added dual CommonJS (require) and ES Module (import) exports with full TypeScript declaration types.',
          'Added SriLankanHolidayAPI hybrid client class supporting live remote REST API calls with automatic offline fallback.',
          'Created interactive web documentation route at /npm-module featuring live in-browser method sandbox tester.'
        ]
      },
      {
        category: 'Documentation',
        items: [
          'Launched dedicated NPM Package documentation page at /npm-module with copyable install scripts (npm, yarn, pnpm, bun) & code snippets.',
          'Added NPM Package navigation links across main header navbar, mobile menu drawer, and footer.'
        ]
      }
    ]
  },
  {
    version: 'v3.0.0-Beta (API v2)',
    tag: 'v3.0.0-beta',
    date: 'August 03, 2026',
    badge: 'Stable',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    summary: 'Major release featuring 100% hand-researched Sri Lankan Government Gazette dataset, new API v2 endpoint suite with full-text search, pagination, multi-upcoming limit support, and dataset analytics.',
    changes: [
      {
        category: 'Dataset',
        items: [
          'Replaced procedural formula calculations with 100% hand-researched official Sri Lankan Government Gazette holiday dates (2024–2030).',
          'Verified exact August 27, 2026 Nikini Full Moon Poya Day date and Adhi Nikini Poya alignment.',
          'Validated all Buddhist Poya days, Hindu Tamil festivals, Islamic lunar observances, and Christian holidays.'
        ]
      },
      {
        category: 'Features',
        items: [
          'Added GET /api/v2/holidays with search, multi-field filtering, sorting (date_asc, date_desc), and page-based pagination.',
          'Added GET /api/v2/holidays/poya dedicated endpoint returning official Sri Lanka Full Moon Poya days.',
          'Added GET /api/v2/holidays/next-poya endpoint returning the immediate next Poya day with live daysUntil countdown.',
          'Added GET /api/v2/holidays/religion/[religion] filtering holidays by tradition (buddhist, hindu, islamic, christian, national).',
          'Added GET /api/v2/holidays/upcoming with ?limit=N parameter supporting multi-upcoming holiday queries.',
          'Added GET /api/v2/holidays/search for full-text keyword queries.',
          'Added GET /api/v2/holidays/stats for dataset breakdown analytics and real-time telemetry.'
        ]
      },
      {
        category: 'Documentation',
        items: [
          'Updated /docs portal with v1 vs v2 API version tabs and live endpoint execution test buttons.',
          'Created dedicated API Changelog page (/changelog) tracking version history.'
        ]
      }
    ]
  },
  {
    version: 'v2.5.0',
    tag: 'v2.5.0',
    date: 'August 02, 2026',
    badge: 'Stable',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    summary: 'Security hardening, Edge DDoS sliding-window rate limiting, custom Next.js docs portal, diagnostic health endpoint, and AI Vibe Coder system prompt.',
    changes: [
      {
        category: 'Security',
        items: [
          'Implemented Edge Sliding-Window Rate Limiting (60 requests / min per IP) in middleware.ts.',
          'Added strict HTTP security headers: HSTS, X-Frame-Options, X-Content-Type-Options, XSS-Protection, and CORS.'
        ]
      },
      {
        category: 'Features',
        items: [
          'Built native Next.js documentation portal at /docs replacing external swagger bundles.',
          'Upgraded GET /api/v1/health returning detailed system uptime, memory usage, dataset metrics, and rate limit status.',
          'Added Master AI System Prompt tab for developers using Cursor, ChatGPT, Claude, or Copilot.'
        ]
      }
    ]
  },
  {
    version: 'v2.0.0',
    tag: 'v2.0.0',
    date: 'August 01, 2026',
    badge: 'Legacy',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Extended multi-year dataset coverage to 2045 and added full dataset export tools in JSON and CSV formats.',
    changes: [
      {
        category: 'Features',
        items: [
          'Added GET /api/v1/holidays/export endpoint supporting ?format=json and ?format=csv downloads.',
          'Expanded holiday catalog from 2024 to 2045 (22 years coverage).'
        ]
      }
    ]
  },
  {
    version: 'v1.0.0',
    tag: 'v1.0.0',
    date: 'July 25, 2026',
    badge: 'Legacy',
    badgeColor: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    summary: 'Initial public launch of Sri Lankan Holiday REST API.',
    changes: [
      {
        category: 'Features',
        items: [
          'Launched REST API endpoints for Sri Lankan public, bank, and Poya holidays.',
          'Added filters by year, month, date, and holiday type.'
        ]
      }
    ]
  }
];

export default function ChangelogPage() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[170px]" />
        <div className="absolute top-96 -right-40 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[170px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
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
                  Official API Changelog
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold">
              <Link href="/" className="text-gray-400 hover:text-white transition">
                Home
              </Link>
              <Link href="/docs" className="text-gray-400 hover:text-white transition">
                Docs
              </Link>
              <Link href="/npm-module" className="text-gray-400 hover:text-white transition">
                NPM Package
              </Link>
              <Link href="/changelog" className="text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5">
                Changelog
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
            </nav>

            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="md:hidden p-2 rounded-xl bg-[#0F1623] border border-[#1A2333] text-gray-300"
              aria-label="Toggle Mobile Menu"
            >
              {mobileDrawerOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileDrawerOpen && (
            <div className="md:hidden bg-[#0F1623] border-b border-[#1A2333] p-6 space-y-4 text-sm font-semibold">
              <Link href="/" onClick={() => setMobileDrawerOpen(false)} className="block text-gray-300 hover:text-white">
                Home
              </Link>
              <Link href="/docs" onClick={() => setMobileDrawerOpen(false)} className="block text-gray-300 hover:text-white">
                API Docs (/docs)
              </Link>
              <Link href="/changelog" onClick={() => setMobileDrawerOpen(false)} className="block text-amber-400 font-bold">
                Changelog (/changelog)
              </Link>
              <a
                href="https://github.com/RishBroProMax/holiday-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white bg-[#06080E] border border-[#1A2333] px-4 py-2.5 rounded-xl"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          )}
        </header>

        {/* Main Changelog Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Banner */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4 font-mono">
              <History className="w-4 h-4 text-amber-400" />
              <span>API Release Notes & Version Updates</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              API Release Changelog
            </h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
              Track features, dataset updates, security enhancements, and version releases for the Sri Lankan Holiday API.
            </p>
          </div>

          {/* Timeline List */}
          <div className="space-y-10 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-[#1A2333] hidden sm:block" />

          <div className="space-y-8">
            {changelogData.map((release) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A2333] mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {release.version}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border ${release.badgeColor}`}>
                      {release.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{release.date}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                  {release.summary}
                </p>

                <div className="space-y-6">
                  {release.changes.map((group) => (
                    <div key={group.category}>
                      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{group.category}</span>
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                        {group.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1A2333] mt-24 py-10 bg-[#06080E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-gray-400 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-semibold text-white">Sri Lankan Holiday API</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-bold">imrishmika.dev</a></span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/docs" className="hover:text-white transition">Docs</Link>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub Repo</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
