'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  Terminal,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Globe,
  Code2,
  Play,
  Layers,
  RefreshCw,
  ExternalLink,
  Github,
  BookOpen,
  History,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
  Cpu
} from 'lucide-react';
import {
  getAllHolidays,
  getHolidaysByYear,
  getHolidaysByMonth,
  getHolidayByDate,
  getTodayHoliday,
  getUpcomingHolidays,
  getUpcomingHoliday,
  getPoyaDays,
  getNextPoyaDay,
  getHolidaysByType,
  isHoliday,
  isPublicHoliday,
  isBankHoliday,
  isPoyaDay,
  searchHolidays,
  getMetadata
} from '../../src/index';

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export default function NpmModulePage() {
  const [copiedInstall, setCopiedInstall] = useState<boolean>(false);
  const [selectedPm, setSelectedPm] = useState<PackageManager>('npm');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Interactive Demo State
  const [activeDemo, setActiveDemo] = useState<string>('getUpcomingHoliday');
  const [demoParam, setDemoParam] = useState<string>('');
  const [demoResult, setDemoResult] = useState<any>(null);
  const [demoExecTime, setDemoExecTime] = useState<number | null>(null);

  const installCmds: Record<PackageManager, string> = {
    npm: 'npm install sri-lankan-holiday-api',
    yarn: 'yarn add sri-lankan-holiday-api',
    pnpm: 'pnpm add sri-lankan-holiday-api',
    bun: 'bun add sri-lankan-holiday-api',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleRunDemo = () => {
    const start = performance.now();
    let res: any = null;

    try {
      switch (activeDemo) {
        case 'getUpcomingHoliday':
          res = getUpcomingHoliday();
          break;
        case 'getTodayHoliday':
          res = getTodayHoliday();
          break;
        case 'getNextPoyaDay':
          res = getNextPoyaDay();
          break;
        case 'getHolidaysByYear':
          res = getHolidaysByYear(demoParam || 2026);
          break;
        case 'getHolidaysByMonth':
          res = getHolidaysByMonth(2026, demoParam || 4);
          break;
        case 'getPoyaDays':
          res = getPoyaDays(demoParam || 2026);
          break;
        case 'isPublicHoliday':
          res = isPublicHoliday(demoParam || '2026-04-13');
          break;
        case 'searchHolidays':
          res = searchHolidays(demoParam || 'Sinhala');
          break;
        case 'getMetadata':
          res = getMetadata();
          break;
        default:
          res = getAllHolidays({ year: 2026 });
      }
    } catch (err: any) {
      res = { error: err.message };
    }

    const end = performance.now();
    setDemoResult(res);
    setDemoExecTime(Number((end - start).toFixed(2)));
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[180px]" />
        <div className="absolute top-96 -right-40 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10">
        {/* Header / Navbar */}
        <header className="border-b border-[#1A2333] backdrop-blur-xl bg-[#06080E]/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-lg border border-amber-400/20 bg-[#0F1623] p-1 group-hover:border-amber-400 transition"
              />
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                  Sri Lankan Holiday API
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Official Node.js SDK
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
              <Link href="/npm-module" className="text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                NPM Package
              </Link>
              <Link href="/changelog" className="text-gray-400 hover:text-white transition">
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
              aria-label="Toggle Navigation"
            >
              {mobileDrawerOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileDrawerOpen && (
            <div className="md:hidden bg-[#0F1623] border-b border-[#1A2333] p-6 space-y-4 text-sm font-semibold">
              <Link href="/" onClick={() => setMobileDrawerOpen(false)} className="block text-gray-300 hover:text-white">
                Home
              </Link>
              <Link href="/docs" onClick={() => setMobileDrawerOpen(false)} className="block text-gray-300 hover:text-white">
                Docs
              </Link>
              <Link href="/npm-module" onClick={() => setMobileDrawerOpen(false)} className="block text-amber-400 font-bold">
                NPM Package (/npm-module)
              </Link>
              <Link href="/changelog" onClick={() => setMobileDrawerOpen(false)} className="block text-gray-300 hover:text-white">
                Changelog (/changelog)
              </Link>
              <a
                href="https://github.com/RishBroProMax/holiday-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white pt-2"
              >
                <Github className="w-4 h-4 text-amber-400" />
                GitHub Repository
              </a>
            </div>
          )}
        </header>

        {/* Hero Announcement Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold font-mono"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>NPM Package v3.0.0 Published</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-emerald-400">100% Offline Ready</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Zero-Dependency Node.js Module for <br />
              <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 bg-clip-text text-transparent">
                Sri Lankan Holiday Data
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Never worry about API server downtime or domain changes! Access 858+ hand-verified Sri Lankan public holidays, bank holidays, and Poya days (2024–2045) directly in Node.js, Next.js, Express & TypeScript with <strong className="text-white">zero external network dependencies</strong>.
            </motion.p>

            {/* Quick Install Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto bg-[#0C121E] border border-[#1E2A3E] p-4 rounded-2xl shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#1A2536] pb-2 text-xs font-mono text-gray-400">
                <div className="flex gap-2">
                  {(['npm', 'yarn', 'pnpm', 'bun'] as PackageManager[]).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setSelectedPm(pm)}
                      className={`px-3 py-1 rounded-lg transition font-bold uppercase ${
                        selectedPm === pm
                          ? 'bg-amber-400 text-black shadow-md'
                          : 'bg-[#151F30] text-gray-400 hover:text-white'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
                <span className="hidden sm:inline text-amber-400/80 font-semibold">Latest Release v3.0.0</span>
              </div>

              <div className="flex items-center justify-between gap-4 font-mono text-sm sm:text-base bg-[#06080E] p-3.5 rounded-xl border border-[#1A2536] text-emerald-400 overflow-x-auto">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{installCmds[selectedPm]}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(installCmds[selectedPm])}
                  className="bg-[#151F30] hover:bg-amber-400 hover:text-black text-gray-200 px-3.5 py-1.5 rounded-lg border border-[#25354E] transition flex items-center gap-2 text-xs font-sans shrink-0"
                >
                  {copiedInstall ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why Use the <span className="text-amber-400">sri-lankan-holiday-api</span> Node Module?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Designed for reliability, speed, and resilience against external server downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0C121E] border border-[#1A2536] p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Offline Ready</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bundles all 858+ holiday entries directly inside the package JS. Works seamlessly in offline environments, Docker containers, AWS Lambda, or serverless functions without network calls.
              </p>
            </div>

            <div className="bg-[#0C121E] border border-[#1A2536] p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Dependencies</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pure, lightweight JavaScript/TypeScript with <strong className="text-white">0 external npm dependencies</strong>. Ultra-tiny bundle footprint under 45KB with instant microsecond execution.
              </p>
            </div>

            <div className="bg-[#0C121E] border border-[#1A2536] p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Full TypeScript Support</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Includes strict TypeScript interfaces (<code className="text-amber-300">Holiday</code>, <code className="text-amber-300">FilterOptions</code>, <code className="text-amber-300">ClientOptions</code>) with full IDE autocomplete and type checking out of the box.
              </p>
            </div>

            <div className="bg-[#0C121E] border border-[#1A2536] p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Hybrid Remote API Client</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Need live updates? Use the optional <code className="text-amber-300">SriLankanHolidayAPI</code> client class to query live REST endpoints while automatically falling back to embedded data if connection drops.
              </p>
            </div>

            <div className="bg-[#0C121E] border border-[#1A2536] p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-rose-400/10 border border-rose-400/30 flex items-center justify-center text-rose-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Poya Day & Gazette Verified</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Contains hand-researched official Sri Lanka Gazette dates (2024–2030) and astronomical Full Moon Poya algorithms up to 2045.
              </p>
            </div>

            <div className="bg-[#0C121E] border border-[#1A2536] p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">CommonJS & ES Modules</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dual CJS (<code className="text-amber-300">require()</code>) and ESM (<code className="text-amber-300">import</code>) builds. Compatible with Node.js, Next.js, Express, Bun, Deno, Vite, and React Native.
              </p>
            </div>
          </div>
        </section>

        {/* Live Interactive Code Playground / Sandbox */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#0C121E] border border-[#1A2536] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2536] pb-6">
              <div>
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-amber-400" /> Live Interactive Sandbox
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Test Module Methods Live in Browser
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunDemo}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Execute Method</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2">Select Exported Method:</label>
                  <select
                    value={activeDemo}
                    onChange={(e) => {
                      setActiveDemo(e.target.value);
                      setDemoParam('');
                    }}
                    className="w-full bg-[#06080E] border border-[#1A2536] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 font-mono text-sm"
                  >
                    <option value="getUpcomingHoliday">getUpcomingHoliday() - Next Holiday</option>
                    <option value="getTodayHoliday">getTodayHoliday() - Today's Holiday</option>
                    <option value="getNextPoyaDay">getNextPoyaDay() - Next Poya + Countdown</option>
                    <option value="getHolidaysByYear">getHolidaysByYear(year)</option>
                    <option value="getHolidaysByMonth">getHolidaysByMonth(year, month)</option>
                    <option value="getPoyaDays">getPoyaDays(year)</option>
                    <option value="isPublicHoliday">isPublicHoliday(dateStr)</option>
                    <option value="searchHolidays">searchHolidays(query)</option>
                    <option value="getMetadata">getMetadata() - Dataset Metadata</option>
                  </select>
                </div>

                {/* Optional Parameter Input */}
                {['getHolidaysByYear', 'getHolidaysByMonth', 'getPoyaDays', 'isPublicHoliday', 'searchHolidays'].includes(activeDemo) && (
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">
                      {activeDemo === 'getHolidaysByYear' && 'Year Parameter (e.g. 2026):'}
                      {activeDemo === 'getHolidaysByMonth' && 'Month (1-12):'}
                      {activeDemo === 'getPoyaDays' && 'Year Parameter (e.g. 2026):'}
                      {activeDemo === 'isPublicHoliday' && 'Date String (YYYY-MM-DD):'}
                      {activeDemo === 'searchHolidays' && 'Search Query (e.g. Sinhala, Poya, Wesak):'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        activeDemo === 'isPublicHoliday' ? '2026-04-13' :
                        activeDemo === 'searchHolidays' ? 'Sinhala' : '2026'
                      }
                      value={demoParam}
                      onChange={(e) => setDemoParam(e.target.value)}
                      className="w-full bg-[#06080E] border border-[#1A2536] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 font-mono text-sm"
                    />
                  </div>
                )}

                <div className="bg-[#06080E] border border-[#1A2536] p-4 rounded-xl space-y-2 text-xs font-mono text-gray-400">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-emerald-400">sri-lankan-holiday-api Node Module</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network status:</span>
                    <span className="text-amber-400">0 Network Requests (Offline)</span>
                  </div>
                  {demoExecTime !== null && (
                    <div className="flex justify-between pt-1 border-t border-[#1A2536]">
                      <span>Execution Time:</span>
                      <span className="text-amber-300 font-bold">{demoExecTime} ms</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Result Preview Column */}
              <div className="lg:col-span-7 bg-[#06080E] border border-[#1A2536] rounded-2xl p-4 font-mono text-xs overflow-hidden flex flex-col h-[320px]">
                <div className="flex justify-between items-center pb-2 border-b border-[#1A2536] text-gray-400 shrink-0">
                  <span className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    Output JSON Response
                  </span>
                  {demoResult && (
                    <span className="text-emerald-400">
                      {Array.isArray(demoResult) ? `${demoResult.length} items returned` : '1 object returned'}
                    </span>
                  )}
                </div>
                <div className="overflow-auto flex-1 pt-3 text-emerald-400 custom-scrollbar">
                  <pre>{demoResult ? JSON.stringify(demoResult, null, 2) : '// Click "Execute Method" above to view live evaluation results'}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Code Examples Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Integration Code Snippets
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Ready-to-use examples for modern JavaScript & TypeScript environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ES Modules Example */}
            <div className="bg-[#0C121E] border border-[#1A2536] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A2536] pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  ES Modules / TypeScript
                </h3>
                <span className="text-xs font-mono text-gray-400">import syntax</span>
              </div>
              <pre className="bg-[#06080E] p-4 rounded-xl border border-[#1A2536] font-mono text-xs text-amber-200 overflow-x-auto">
{`import { 
  getUpcomingHoliday, 
  getNextPoyaDay, 
  isPublicHoliday 
} from 'sri-lankan-holiday-api';

// 1. Get immediate next holiday
const upcoming = getUpcomingHoliday();
console.log('Next Holiday:', upcoming.name, upcoming.date);

// 2. Get next Full Moon Poya Day + Days Countdown
const poya = getNextPoyaDay();
console.log(\`Next Poya in \${poya.daysUntil} days: \${poya.name}\`);

// 3. Check if today is a Public Holiday
const isTodayPublic = isPublicHoliday('2026-04-13');
console.log('April 13 Public Holiday?', isTodayPublic); // true`}
              </pre>
            </div>

            {/* CommonJS Example */}
            <div className="bg-[#0C121E] border border-[#1A2536] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A2536] pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  CommonJS (Node.js)
                </h3>
                <span className="text-xs font-mono text-gray-400">require() syntax</span>
              </div>
              <pre className="bg-[#06080E] p-4 rounded-xl border border-[#1A2536] font-mono text-xs text-emerald-200 overflow-x-auto">
{`const { 
  getHolidaysByYear, 
  searchHolidays 
} = require('sri-lankan-holiday-api');

// 1. Get all 2026 Sri Lankan holidays
const holidays2026 = getHolidaysByYear(2026);
console.log(\`Found \${holidays2026.length} holidays for 2026\`);

// 2. Search holidays by keyword
const vesakHolidays = searchHolidays('Vesak');
console.log('Vesak dates:', vesakHolidays.map(h => h.date));`}
              </pre>
            </div>

            {/* Express.js Middleware Example */}
            <div className="bg-[#0C121E] border border-[#1A2536] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A2536] pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  Express.js Holiday Checker Middleware
                </h3>
                <span className="text-xs font-mono text-gray-400">Backend Server</span>
              </div>
              <pre className="bg-[#06080E] p-4 rounded-xl border border-[#1A2536] font-mono text-xs text-blue-200 overflow-x-auto">
{`const express = require('express');
const { isPublicHoliday, getTodayHoliday } = require('sri-lankan-holiday-api');

const app = express();

// Middleware: Check if bank processing is open today
app.use((req, res, next) => {
  const todayStr = new Date().toISOString().split('T')[0];
  if (isPublicHoliday(todayStr)) {
    console.log('Notice: Today is a Sri Lankan Public Holiday');
  }
  next();
});

app.get('/status', (req, res) => {
  res.json({
    todayHolidays: getTodayHoliday()
  });
});`}
              </pre>
            </div>

            {/* Hybrid Remote API Client Example */}
            <div className="bg-[#0C121E] border border-[#1A2536] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A2536] pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  Hybrid Remote API Client with Fallback
                </h3>
                <span className="text-xs font-mono text-gray-400">SriLankanHolidayAPI</span>
              </div>
              <pre className="bg-[#06080E] p-4 rounded-xl border border-[#1A2536] font-mono text-xs text-purple-200 overflow-x-auto">
{`import { SriLankanHolidayAPI } from 'sri-lankan-holiday-api';

// Create API client (queries remote domain, falls back to embedded data if server down!)
const client = new SriLankanHolidayAPI({
  baseUrl: 'https://holiday.imrishmika.dev',
  useOfflineFallback: true, // Auto fallback to local data if network fails
  timeout: 4000
});

async function main() {
  const holidays = await client.getAllHolidays({ year: 2026 });
  console.log('2026 Holidays:', holidays.length);
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Complete API Function Reference Table */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#0C121E] border border-[#1A2536] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#1A2536] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Complete Exported API Reference
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                All synchronous & asynchronous functions exported by <code className="text-amber-400 font-mono">sri-lankan-holiday-api</code>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#1A2536] text-gray-400 font-mono text-xs uppercase bg-[#06080E]/60">
                    <th className="py-3 px-4">Exported Function</th>
                    <th className="py-3 px-4">Parameters</th>
                    <th className="py-3 px-4">Return Type</th>
                    <th className="py-3 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2536] font-mono text-xs">
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getAllHolidays(filters?)</td>
                    <td className="py-3 px-4 text-gray-300">FilterOptions</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get all holidays matching optional year, month, type, religion, category filters.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getHolidaysByYear(year)</td>
                    <td className="py-3 px-4 text-gray-300">number | string</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get all holidays for a specific calendar year (2024–2045).</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getHolidaysByMonth(year, month)</td>
                    <td className="py-3 px-4 text-gray-300">year, month (1-12)</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get holidays occurring in a given month.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getHolidayByDate(dateStr)</td>
                    <td className="py-3 px-4 text-gray-300">string ("YYYY-MM-DD")</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Find holiday records for an exact calendar date.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getTodayHoliday()</td>
                    <td className="py-3 px-4 text-gray-300">none</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get today's holiday(s) in Sri Lanka timezone (Asia/Colombo).</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getUpcomingHoliday(publicOnly?)</td>
                    <td className="py-3 px-4 text-gray-300">boolean</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday | null</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get the immediate next upcoming holiday from today.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getNextPoyaDay()</td>
                    <td className="py-3 px-4 text-gray-300">none</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday & &#123; daysUntil &#125;</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get the next Full Moon Poya Day with calculated countdown days.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">getPoyaDays(year?)</td>
                    <td className="py-3 px-4 text-gray-300">number | string</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Get all Full Moon Poya days for a year.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">isPublicHoliday(dateStr)</td>
                    <td className="py-3 px-4 text-gray-300">string ("YYYY-MM-DD")</td>
                    <td className="py-3 px-4 text-emerald-400">boolean</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Returns true if the given date is a official public holiday.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">isBankHoliday(dateStr)</td>
                    <td className="py-3 px-4 text-gray-300">string ("YYYY-MM-DD")</td>
                    <td className="py-3 px-4 text-emerald-400">boolean</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Returns true if the given date is a commercial bank holiday.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">searchHolidays(query)</td>
                    <td className="py-3 px-4 text-gray-300">string</td>
                    <td className="py-3 px-4 text-emerald-400">Holiday[]</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Full-text search matching name, description, date or tradition type.</td>
                  </tr>
                  <tr className="hover:bg-[#06080E]/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-bold">SriLankanHolidayAPI</td>
                    <td className="py-3 px-4 text-gray-300">ClientOptions</td>
                    <td className="py-3 px-4 text-purple-400">class instance</td>
                    <td className="py-3 px-4 text-gray-400 font-sans">Async client class for remote API calls with offline fallback.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Publishing & Vercel Instructions Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 font-mono text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <span>Vercel Hosting & NPM Publishing Guide</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              How Vercel and NPM Publishing Work Together
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-4xl">
              1. <strong>Vercel Build Integration</strong>: When Vercel builds your web project, it runs <code className="text-amber-300 font-mono">npm run build</code>. We have configured <code className="text-amber-300 font-mono">package.json</code> so that Vercel automatically builds both the Node module files in <code className="text-amber-300 font-mono">dist/</code> and the Next.js web application.
              <br /><br />
              2. <strong>Publishing to NPM Registry</strong>: To publish or update the package on the official NPM Registry, simply run <code className="text-emerald-300 font-mono">npm publish</code> in your local terminal (or via GitHub Action). Only the compiled <code className="text-amber-300 font-mono">dist/</code> directory, <code className="text-amber-300 font-mono">README.md</code>, and <code className="text-amber-300 font-mono">LICENSE</code> will be uploaded to npm—keeping your published module ultra-clean and lightweight!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1A2333] bg-[#06080E] py-12 text-xs font-mono text-gray-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span>Sri Lankan Holiday API Node Module v3.0.0 • Released under MIT License</span>
            </div>
            <div className="flex items-center gap-6 text-gray-300 font-sans font-semibold">
              <Link href="/" className="hover:text-amber-400 transition">Home</Link>
              <Link href="/docs" className="hover:text-amber-400 transition">Docs</Link>
              <Link href="/npm-module" className="text-amber-400">NPM Package</Link>
              <Link href="/changelog" className="hover:text-amber-400 transition">Changelog</Link>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
