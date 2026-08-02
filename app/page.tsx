'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Code,
  Terminal,
  Search,
  ExternalLink,
  Github,
  CheckCircle,
  Copy,
  Sparkles,
  Zap,
  BookOpen,
  Send,
  Clock,
  Layers,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Info,
  Globe
} from 'lucide-react';
import holidayData from '../data/holidays.json';

export default function HomePage() {
  // Playground State
  const [playgroundUrl, setPlaygroundUrl] = useState('/api/v1/holidays/upcoming');
  const [responseJson, setResponseJson] = useState<string>('Loading demo request...');
  const [responseStatus, setResponseStatus] = useState<string>('STATUS: 200 OK');
  const [isStatusOk, setIsStatusOk] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeCodeLang, setActiveCodeLang] = useState<'js' | 'python' | 'curl' | 'php' | 'go'>('js');

  // Explorer State
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Today & Upcoming Quick Widget
  const [todayInfo, setTodayInfo] = useState<any>(null);
  const [upcomingInfo, setUpcomingInfo] = useState<any>(null);

  const holidaysList = (holidayData as any).holidays || [];

  // Filtered Holidays for Explorer
  const filteredHolidays = holidaysList.filter((h: any) => {
    const matchYear = h.year === selectedYear;
    const matchType = selectedType === 'all' ? true : h.type === selectedType;
    const matchSearch = searchQuery === '' ? true :
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.date.includes(searchQuery);
    return matchYear && matchType && matchSearch;
  });

  // Fetch Today & Upcoming on Mount
  useEffect(() => {
    const fetchQuickData = async () => {
      try {
        const [upRes, todayRes] = await Promise.all([
          fetch('/api/v1/holidays/upcoming'),
          fetch('/api/v1/holidays/today')
        ]);
        if (upRes.ok) setUpcomingInfo(await upRes.json());
        if (todayRes.ok) setTodayInfo(await todayRes.json());
      } catch (err) {
        console.error('Widget fetch error', err);
      }
    };
    fetchQuickData();
    runPlayground('/api/v1/holidays/upcoming');
  }, []);

  // Execute Playground Request
  const runPlayground = async (endpointPath?: string) => {
    const targetPath = endpointPath || playgroundUrl;
    setLoading(true);
    setResponseJson('Sending HTTP request...');

    try {
      const res = await fetch(targetPath);
      const data = await res.json();
      setResponseStatus(`HTTP ${res.status} ${res.statusText}`);
      setIsStatusOk(res.ok);
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseStatus('HTTP ERROR');
      setIsStatusOk(false);
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (path: string) => {
    setPlaygroundUrl(path);
    runPlayground(path);
  };

  // Code Generator Snippets
  const getCodeSnippet = () => {
    const fullUrl = `https://holiday.imrishmika.dev${playgroundUrl}`;
    switch (activeCodeLang) {
      case 'curl':
        return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;
      case 'js':
        return `// JavaScript / Node.js (fetch)
const response = await fetch("${fullUrl}");
const data = await response.json();
console.log(data);`;
      case 'python':
        return `# Python (requests)
import requests

response = requests.get("${fullUrl}")
data = response.json()
print(data)`;
      case 'php':
        return `<?php
// PHP
$json = file_get_contents("${fullUrl}");
$data = json_decode($json, true);
print_r($data);
?>`;
      case 'go':
        return `// Go
package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    resp, _ := http.Get("${fullUrl}")
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyDomainUrl = () => {
    navigator.clipboard.writeText('https://holiday.imrishmika.dev/api/v1/holidays');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-80 -right-40 w-[700px] h-[700px] bg-rose-600/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
        <header className="border-b border-[#1F293D] backdrop-blur-md bg-[#0B0E14]/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110 rounded-lg shadow-md"
              />
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  Sri Lankan Holiday API
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  holiday.imrishmika.dev • v2.0.0
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#playground" className="text-gray-400 hover:text-white transition">Playground</a>
              <a href="#explorer" className="text-gray-400 hover:text-white transition">Calendar Explorer</a>
              <a href="#code" className="text-gray-400 hover:text-white transition">Code Snippets</a>
              <Link
                href="/docs"
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-lg transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>API Docs (/docs)</span>
              </Link>
              <a
                href="https://github.com/RishBroProMax/holiday-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#121824] border border-[#1F293D] hover:border-amber-400/50 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6">
            <img src="/favicon.png" alt="Logo" className="w-5 h-5 object-contain" />
            <span>Open Source • 22-Year Coverage (2024–2045)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            The Complete Sri Lankan <br />
            <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 bg-clip-text text-transparent">
              Public, Bank & Poya Holiday API
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Free, fast, developer-friendly REST API for Sri Lanka holiday data. Astronomically calculated Poya days,
            shifting Islamic lunar festivals, Hindu celebrations, Christian observances, and National holidays.
          </p>

          {/* Quick API URL Pill */}
          <div className="inline-flex items-center gap-3 bg-[#121824] border border-[#1F293D] rounded-full px-5 py-2.5 mb-10 text-xs sm:text-sm font-mono text-gray-300 shadow-inner">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>https://holiday.imrishmika.dev/api/v1/holidays</span>
            <button
              onClick={copyDomainUrl}
              className="text-amber-400 hover:text-amber-300 text-xs font-sans font-bold flex items-center gap-1 ml-2 transition"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition"
            >
              <BookOpen className="w-5 h-5" />
              <span>Interactive Swagger Docs (/docs)</span>
            </Link>
            <a
              href="#playground"
              className="px-6 py-3.5 rounded-xl bg-[#121824] border border-[#1F293D] text-white font-semibold flex items-center gap-2 hover:bg-[#182030] transition"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Try Live Playground</span>
            </a>
          </div>
        </section>

        {/* Live Holiday Status Widget Bar */}
        {upcomingInfo && upcomingInfo.data && (
          <section className="max-w-4xl mx-auto px-4 my-8">
            <div className="bg-[#121824] border border-[#1F293D] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 p-2">
                  <img src="/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Next Upcoming Holiday</div>
                  <div className="text-lg font-bold text-white">{upcomingInfo.data.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{upcomingInfo.data.date} ({upcomingInfo.data.dayOfWeek})</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold font-mono">
                  {upcomingInfo.meta?.daysUntil === 0 ? 'Today 🎉' : `In ${upcomingInfo.meta?.daysUntil} days`}
                </span>
                <span className="text-xs text-gray-500 font-mono">Asia/Colombo</span>
              </div>
            </div>
          </section>
        )}

        {/* Stats Grid */}
        <section className="max-w-6xl mx-auto px-4 my-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#121824] border border-[#1F293D] rounded-2xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1">858+</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Holidays Cataloged</div>
            </div>
            <div className="bg-[#121824] border border-[#1F293D] rounded-2xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">22 Years</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Coverage (2024–2045)</div>
            </div>
            <div className="bg-[#121824] border border-[#1F293D] rounded-2xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 mb-1">6 Types</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Buddhist, Hindu, Islamic, etc.</div>
            </div>
            <div className="bg-[#121824] border border-[#1F293D] rounded-2xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mb-1">100% Free</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">MIT Open Source</div>
            </div>
          </div>
        </section>

        {/* Live Interactive Playground */}
        <section id="playground" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-amber-400" />
                  Live API Playground
                </h2>
                <p className="text-sm text-gray-400">Click any preset endpoint or edit the path to test responses live.</p>
              </div>

              {/* Endpoint Preset Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '/upcoming', path: '/api/v1/holidays/upcoming' },
                  { label: '/today', path: '/api/v1/holidays/today' },
                  { label: '/year/2026', path: '/api/v1/holidays/year/2026' },
                  { label: '/type/buddhist', path: '/api/v1/holidays/type/buddhist' },
                  { label: '/meta', path: '/api/v1/holidays/meta' },
                  { label: '/api', path: '/api' },
                ].map(chip => (
                  <button
                    key={chip.path}
                    onClick={() => handleChipClick(chip.path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                      playgroundUrl === chip.path
                        ? 'bg-amber-500/10 border-amber-400 text-amber-400 font-bold'
                        : 'bg-[#07090E] border-[#1F293D] text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input Bar */}
            <div className="flex rounded-xl overflow-hidden border border-[#1F293D] bg-[#07090E] mb-6">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold font-mono px-4 py-3 text-sm flex items-center border-r border-[#1F293D]">
                GET
              </span>
              <input
                type="text"
                value={playgroundUrl}
                onChange={(e) => setPlaygroundUrl(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-sm font-mono text-white focus:outline-none"
              />
              <button
                onClick={() => runPlayground()}
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 text-sm flex items-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send'}</span>
              </button>
            </div>

            {/* JSON Output Viewer */}
            <div className="bg-[#07090E] border border-[#1F293D] rounded-xl p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F293D]/60 text-xs font-mono text-gray-400">
                <span>Response Payload</span>
                <span className={isStatusOk ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {responseStatus}
                </span>
              </div>
              <pre className="font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto max-h-[380px] leading-relaxed">
                {responseJson}
              </pre>
            </div>
          </div>
        </section>

        {/* Searchable Calendar Explorer */}
        <section id="explorer" className="max-w-6xl mx-auto px-4 my-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              🗓️ Sri Lanka Holiday Calendar Explorer
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Search and filter through the complete dataset of 850+ Sri Lankan public holidays from 2024 to 2045.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="bg-[#121824] border border-[#1F293D] rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search holiday name, description, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#07090E] border border-[#1F293D] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-gray-400 font-medium">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-[#07090E] border border-[#1F293D] rounded-xl px-3 py-2 text-sm font-semibold text-amber-400 focus:outline-none"
              >
                {Array.from({ length: 22 }, (_, i) => 2024 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Type Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-gray-400 font-medium">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#07090E] border border-[#1F293D] rounded-xl px-3 py-2 text-sm text-white focus:outline-none capitalize"
              >
                <option value="all">All Types</option>
                <option value="buddhist">Buddhist (Poya)</option>
                <option value="hindu">Hindu</option>
                <option value="islamic">Islamic</option>
                <option value="christian">Christian</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-xs text-gray-400 mb-4 px-2 flex items-center justify-between">
            <span>Showing <strong>{filteredHolidays.length}</strong> holidays for {selectedYear}</span>
            {filteredHolidays.length === 0 && <span className="text-rose-400">No holidays found for filters</span>}
          </div>

          {/* Holiday Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHolidays.map((holiday: any) => (
              <div
                key={holiday.id}
                className="bg-[#121824] border border-[#1F293D] hover:border-amber-400/40 rounded-2xl p-5 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                      holiday.type === 'buddhist' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      holiday.type === 'hindu' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      holiday.type === 'islamic' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      holiday.type === 'christian' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {holiday.type}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {holiday.dayOfWeek}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition">
                    {holiday.name}
                  </h3>
                  <div className="text-amber-400 font-mono text-sm font-semibold mb-2">
                    {holiday.date}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {holiday.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1F293D]/60 flex items-center justify-between text-[11px] text-gray-500">
                  <span>{holiday.isPublicHoliday ? 'Public & Bank Holiday' : 'Observance'}</span>
                  <span className="font-mono">{holiday.id}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Snippets Section */}
        <section id="code" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Code className="w-6 h-6 text-amber-400" />
                  Code Integration Snippets
                </h2>
                <p className="text-sm text-gray-400">Integrate the Sri Lankan Holiday API in your preferred language.</p>
              </div>

              {/* Language Switcher */}
              <div className="flex gap-2">
                {(['js', 'python', 'curl', 'php', 'go'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition border ${
                      activeCodeLang === lang
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-[#07090E] border-[#1F293D] text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="relative bg-[#07090E] border border-[#1F293D] rounded-xl p-4">
              <button
                onClick={copyCode}
                className="absolute top-4 right-4 bg-[#121824] border border-[#1F293D] hover:border-amber-400 text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                {copiedCode ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre className="font-mono text-xs sm:text-sm text-amber-300 leading-relaxed overflow-x-auto pr-24">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1F293D] mt-24 py-12 bg-[#0B0E14]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain" />
              <span>Sri Lankan Holiday API</span>
              <span>•</span>
              <span>Created by <a href="https://github.com/RishBroProMax" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">RishBroProMax</a></span>
            </div>

            <div className="flex items-center gap-6">
              <a href="https://holiday.imrishmika.dev" className="hover:text-white transition">holiday.imrishmika.dev</a>
              <Link href="/docs" className="text-amber-400 hover:underline font-semibold">Swagger Docs (/docs)</Link>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub Repo</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
