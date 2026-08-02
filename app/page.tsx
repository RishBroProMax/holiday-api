'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
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
  Download,
  FileSpreadsheet,
  FileJson,
  HelpCircle,
  ChevronDown,
  Globe,
  Grid,
  Check,
  Menu,
  X
} from 'lucide-react';
import holidayData from '../data/holidays.json';

export default function HomePage() {
  // Navigation Menu Mobile Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Playground State
  const [playgroundUrl, setPlaygroundUrl] = useState('/api/v1/holidays/upcoming');
  const [responseJson, setResponseJson] = useState<string>('Loading demo request...');
  const [responseStatus, setResponseStatus] = useState<string>('STATUS: 200 OK');
  const [isStatusOk, setIsStatusOk] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  type FrameworkLang = 'nextjs' | 'react-vite' | 'vue-vite' | 'js-fetch' | 'axios' | 'python' | 'curl' | 'php' | 'go' | 'java' | 'flutter';
  const [activeCodeLang, setActiveCodeLang] = useState<FrameworkLang>('nextjs');

  // Explorer State
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Today & Upcoming Quick Widget
  const [upcomingInfo, setUpcomingInfo] = useState<any>(null);
  
  // Real-time Live Ticking Countdown Timer
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  // FAQ Open State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  // Fetch Upcoming & Initialize Live Countdown
  useEffect(() => {
    const fetchQuickData = async () => {
      try {
        const upRes = await fetch('/api/v1/holidays/upcoming');
        if (upRes.ok) {
          const data = await upRes.json();
          setUpcomingInfo(data);
        }
      } catch (err) {
        console.error('Widget fetch error', err);
      }
    };
    fetchQuickData();
    runPlayground('/api/v1/holidays/upcoming');
  }, []);

  // Countdown timer tick effect
  useEffect(() => {
    if (!upcomingInfo || !upcomingInfo.data) return;
    const targetDateStr = `${upcomingInfo.data.date}T00:00:00+05:30`;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [upcomingInfo]);

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

  // Code Snippets
  const getCodeSnippet = () => {
    const fullUrl = `https://holiday.imrishmika.dev${playgroundUrl}`;
    switch (activeCodeLang) {
      case 'nextjs':
        return `// Next.js 14+ (App Router - Server Component)
import React from 'react';

async function getHolidays() {
  const res = await fetch("${fullUrl}", { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch Sri Lankan holidays');
  return res.json();
}

export default async function HolidayComponent() {
  const data = await getHolidays();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`;

      case 'react-vite':
        return `// React + Vite
import React, { useState, useEffect } from 'react';

export function HolidayWidget() {
  const [holidays, setHolidays] = useState(null);

  useEffect(() => {
    fetch("${fullUrl}")
      .then(res => res.json())
      .then(data => setHolidays(data));
  }, []);

  return <pre>{JSON.stringify(holidays, null, 2)}</pre>;
}`;

      case 'vue-vite':
        return `<!-- Vue 3 + Vite -->
<script setup>
import { ref, onMounted } from 'vue';

const holidays = ref(null);

onMounted(async () => {
  const res = await fetch("${fullUrl}");
  holidays.value = await res.json();
});
</script>

<template>
  <pre>{{ JSON.stringify(holidays, null, 2) }}</pre>
</template>`;

      case 'js-fetch':
        return `// Vanilla JavaScript
fetch("${fullUrl}")
  .then(res => res.json())
  .then(data => console.log(data));`;

      case 'axios':
        return `// Node.js (Axios)
import axios from 'axios';

const { data } = await axios.get("${fullUrl}");
console.log(data);`;

      case 'python':
        return `# Python (requests)
import requests

res = requests.get("${fullUrl}")
print(res.json())`;

      case 'curl':
        return `# cURL
curl -X GET "${fullUrl}" -H "Accept: application/json"`;

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

      case 'java':
        return `// Java 11+
import java.net.URI;
import java.net.http.*;

HttpClient client = HttpClient.newHttpClient();
HttpRequest req = HttpRequest.newBuilder().uri(URI.create("${fullUrl}")).GET().build();
HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
System.out.println(res.body());`;

      case 'flutter':
        return `// Flutter / Dart
import 'package:http/http.dart' as http;
import 'dart:convert';

final res = await http.get(Uri.parse('${fullUrl}'));
final data = jsonDecode(res.body);
print(data);`;
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

  // FAQ Items
  const faqList = [
    {
      q: 'Is the Sri Lankan Holiday API free to use?',
      a: 'Yes, the API is 100% free and open-source under the MIT license. There are no API keys required and no rate limit fees.'
    },
    {
      q: 'How are Full Moon Poya Days calculated?',
      a: 'Poya days are astronomically calculated using the Jean Meeus lunar phase algorithm specifically calibrated for Sri Lanka Standard Time (Asia/Colombo timezone, UTC+5:30).'
    },
    {
      q: 'What years are covered in the dataset?',
      a: 'The API covers 22 complete calendar years from 2024 through 2045, containing over 858 cataloged holidays.'
    },
    {
      q: 'Can I export or download the full dataset for offline use?',
      a: 'Yes! You can download the full 22-year dataset in JSON or CSV format directly using the download buttons on this page or via /api/v1/holidays/export.'
    },
    {
      q: 'How often is the API updated?',
      a: 'The dataset is continuously updated whenever official gazettes are released by the Sri Lankan Ministry of Public Administration.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F3F4F6] selection:bg-amber-400 selection:text-black">
      {/* Background Animated Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-amber-500/10 rounded-full blur-[140px] sm:blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-96 -right-40 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-rose-600/10 rounded-full blur-[140px] sm:blur-[180px]"
        />
      </div>

      <div className="relative z-10">
        {/* Navigation Bar */}
        <header className="border-b border-[#1F293D] backdrop-blur-xl bg-[#0B0E14]/90 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
              <motion.img
                whileHover={{ rotate: 5, scale: 1.05 }}
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-xl shadow-lg border border-amber-400/20 bg-[#121824] p-1"
              />
              <div>
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white block">
                  Sri Lankan Holiday API
                </span>
                <span className="text-[10px] sm:text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  holiday.imrishmika.dev • v2.5.0
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <a href="#playground" className="text-gray-400 hover:text-white transition">Playground</a>
              <a href="#explorer" className="text-gray-400 hover:text-white transition">Calendar Explorer</a>
              <a href="#export" className="text-gray-400 hover:text-white transition">Download Dataset</a>
              <a href="#code" className="text-gray-400 hover:text-white transition">Code Snippets</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a>
              <Link
                href="/docs"
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl transition hover:bg-amber-500/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>API Docs (/docs)</span>
              </Link>
              <a
                href="https://github.com/RishBroProMax/holiday-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#121824] border border-[#1F293D] hover:border-amber-400/50 text-white px-4 py-2 rounded-xl font-semibold transition hover:bg-[#182030]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </nav>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#121824] border border-[#1F293D] text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-b border-[#1F293D] bg-[#0B0E14]/95 px-4 py-6 space-y-4"
              >
                <a
                  href="#playground"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-300 hover:text-amber-400 py-1"
                >
                  ⚡ Live Playground
                </a>
                <a
                  href="#explorer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-300 hover:text-amber-400 py-1"
                >
                  🗓️ Calendar Explorer
                </a>
                <a
                  href="#export"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-300 hover:text-amber-400 py-1"
                >
                  📥 Download Dataset (CSV/JSON)
                </a>
                <a
                  href="#code"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-300 hover:text-amber-400 py-1"
                >
                  💻 Code Integration Snippets
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-300 hover:text-amber-400 py-1"
                >
                  ❓ Frequently Asked Questions
                </a>

                <div className="pt-4 border-t border-[#1F293D] flex flex-col gap-3">
                  <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Interactive Swagger Docs (/docs)</span>
                  </Link>
                  <a
                    href="https://github.com/RishBroProMax/holiday-api"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-3 rounded-xl text-white font-semibold bg-[#121824] border border-[#1F293D] flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repository</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 pt-12 sm:pt-16 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6 shadow-sm max-w-full">
              <img src="/favicon.png" alt="Logo" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              <span className="truncate">Official Open Source Holiday API (2024–2045)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
              The Complete Sri Lankan <br />
              <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 bg-clip-text text-transparent">
                Public, Bank & Poya Holiday API
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed px-2">
              Fast, accurate, production-ready REST API for Sri Lanka. Astronomically calculated Poya days,
              shifting Islamic lunar dates, Hindu festivals, Christian observances & National holidays.
            </p>

            {/* Quick API URL Pill */}
            <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 bg-[#121824] border border-[#1F293D] rounded-full px-4 py-2.5 sm:px-5 sm:py-3 mb-10 text-xs sm:text-sm font-mono text-gray-300 shadow-xl overflow-x-auto">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">https://holiday.imrishmika.dev/api/v1/holidays</span>
              <button
                onClick={copyDomainUrl}
                className="text-amber-400 hover:text-amber-300 text-xs font-sans font-bold flex items-center gap-1 ml-1 sm:ml-2 transition shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/docs"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition"
              >
                <BookOpen className="w-5 h-5" />
                <span>Interactive Swagger Docs (/docs)</span>
              </Link>
              <a
                href="#playground"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#121824] border border-[#1F293D] text-white font-semibold flex items-center justify-center gap-2.5 hover:bg-[#182030] hover:border-amber-400/40 transition"
              >
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Try Live Playground</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Live Ticking Countdown Widget */}
        {upcomingInfo && upcomingInfo.data && (
          <section className="max-w-4xl mx-auto px-4 my-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#121824] border border-[#1F293D] hover:border-amber-400/40 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 p-2.5 shadow-inner shrink-0">
                    <img src="/favicon.png" alt="Logo" className="w-9 h-9 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Next Upcoming Holiday
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white">{upcomingInfo.data.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{upcomingInfo.data.date} ({upcomingInfo.data.dayOfWeek}) • {upcomingInfo.data.type}</div>
                  </div>
                </div>

                {/* Ticking Countdown Boxes */}
                <div className="flex items-center gap-2 sm:gap-3 bg-[#07090E] border border-[#1F293D] rounded-2xl p-3 px-4 sm:px-5">
                  <div className="text-center min-w-[40px]">
                    <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-400">{countdown.days}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-semibold">Days</div>
                  </div>
                  <span className="text-gray-600 font-extrabold">:</span>
                  <div className="text-center min-w-[40px]">
                    <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-semibold">Hours</div>
                  </div>
                  <span className="text-gray-600 font-extrabold">:</span>
                  <div className="text-center min-w-[40px]">
                    <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-semibold">Mins</div>
                  </div>
                  <span className="text-gray-600 font-extrabold">:</span>
                  <div className="text-center min-w-[40px]">
                    <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-semibold">Secs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Stats Grid */}
        <section className="max-w-6xl mx-auto px-4 my-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <motion.div whileHover={{ y: -4 }} className="bg-[#121824] border border-[#1F293D] rounded-2xl p-4 sm:p-6 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 mb-1">858+</div>
              <div className="text-[11px] sm:text-sm text-gray-400 font-medium">Holidays Cataloged</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-[#121824] border border-[#1F293D] rounded-2xl p-4 sm:p-6 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 mb-1">22 Years</div>
              <div className="text-[11px] sm:text-sm text-gray-400 font-medium">Coverage (2024–2045)</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-[#121824] border border-[#1F293D] rounded-2xl p-4 sm:p-6 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-extrabold text-rose-400 mb-1">6 Types</div>
              <div className="text-[11px] sm:text-sm text-gray-400 font-medium">Buddhist, Hindu, Islamic, etc.</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-[#121824] border border-[#1F293D] rounded-2xl p-4 sm:p-6 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400 mb-1">100% Free</div>
              <div className="text-[11px] sm:text-sm text-gray-400 font-medium">MIT Open Source</div>
            </motion.div>
          </div>
        </section>

        {/* Download Dataset Section */}
        <section id="export" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-gradient-to-r from-[#121824] via-[#182030] to-[#121824] border border-[#1F293D] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <Download className="w-4 h-4" /> Offline Data Export
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Download Complete Holiday Dataset</h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                Export all 858+ Sri Lankan public holidays (2024–2045) for offline apps, Excel spreadsheets, or database seeds.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
              <a
                href="/api/v1/holidays/export?format=json"
                download
                className="w-full sm:w-auto bg-[#07090E] border border-[#1F293D] hover:border-amber-400 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <FileJson className="w-4 h-4 text-amber-400" />
                <span>Download JSON</span>
              </a>
              <a
                href="/api/v1/holidays/export?format=csv"
                download
                className="w-full sm:w-auto bg-[#07090E] border border-[#1F293D] hover:border-emerald-400 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Download CSV</span>
              </a>
            </div>
          </div>
        </section>

        {/* Live Interactive Playground */}
        <section id="playground" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  Live API Playground
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">Click any preset endpoint or edit the path to test live responses.</p>
              </div>

              {/* Endpoint Preset Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                    className={`px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-mono transition border ${
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
            <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-[#1F293D] bg-[#07090E] mb-6">
              <div className="flex items-center">
                <span className="bg-emerald-500/20 text-emerald-400 font-bold font-mono px-4 py-3 text-xs sm:text-sm border-b sm:border-b-0 sm:border-r border-[#1F293D] w-full sm:w-auto text-center sm:text-left">
                  GET
                </span>
              </div>
              <input
                type="text"
                value={playgroundUrl}
                onChange={(e) => setPlaygroundUrl(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none"
              />
              <button
                onClick={() => runPlayground()}
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send'}</span>
              </button>
            </div>

            {/* JSON Output Viewer */}
            <div className="bg-[#07090E] border border-[#1F293D] rounded-xl p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F293D]/60 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-2">
                  <img src="/favicon.png" alt="Logo" className="w-4 h-4 object-contain" />
                  Response Payload
                </span>
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 flex items-center justify-center gap-2 sm:gap-3">
              <img src="/favicon.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              Sri Lanka Holiday Calendar Explorer
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto px-2">
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
                className="w-full bg-[#07090E] border border-[#1F293D] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-gray-400 font-medium">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full md:w-auto bg-[#07090E] border border-[#1F293D] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-amber-400 focus:outline-none"
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
                className="w-full md:w-auto bg-[#07090E] border border-[#1F293D] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none capitalize"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHolidays.map((holiday: any) => (
              <motion.div
                key={holiday.id}
                whileHover={{ y: -3 }}
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* Code Integration Snippets Section */}
        <section id="code" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-[#121824] border border-[#1F293D] rounded-3xl p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  Code Integration Snippets & Framework Guides
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">Production ready integration code for Next.js, React, Vue, Vite, Node, Python, Go & more.</p>
              </div>

              {/* One Click Copy Button */}
              <button
                onClick={copyCode}
                className="w-full sm:w-auto bg-[#07090E] border border-[#1F293D] hover:border-amber-400 text-xs font-medium text-gray-200 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                {copiedCode ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedCode ? 'Snippet Copied!' : 'Copy Selected Snippet'}</span>
              </button>
            </div>

            {/* Framework & Language Selector Tabs (Touch Scrollable on Mobile) */}
            <div className="flex overflow-x-auto gap-2 mb-6 border-b border-[#1F293D] pb-4 scrollbar-none">
              {[
                { id: 'nextjs', label: 'Next.js 14+' },
                { id: 'react-vite', label: 'React + Vite' },
                { id: 'vue-vite', label: 'Vue 3 + Vite' },
                { id: 'js-fetch', label: 'JS Fetch' },
                { id: 'axios', label: 'Node Axios' },
                { id: 'python', label: 'Python' },
                { id: 'curl', label: 'cURL' },
                { id: 'php', label: 'PHP' },
                { id: 'go', label: 'Go' },
                { id: 'java', label: 'Java' },
                { id: 'flutter', label: 'Flutter / Dart' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeLang(tab.id as FrameworkLang)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                    activeCodeLang === tab.id
                      ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-md'
                      : 'bg-[#07090E] border-[#1F293D] text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Display Container */}
            <div className="bg-[#07090E] border border-[#1F293D] rounded-2xl p-4 sm:p-5 shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-amber-300 leading-relaxed overflow-x-auto max-h-[450px]">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section for SEO */}
        <section id="faq" className="max-w-4xl mx-auto px-4 my-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">Everything you need to know about the Sri Lankan Holiday API.</p>
          </div>

          <div className="space-y-3.5">
            {faqList.map((faq, index) => (
              <div
                key={index}
                className="bg-[#121824] border border-[#1F293D] rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-white flex items-center justify-between gap-4 text-sm sm:text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-[#1F293D]/60 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1F293D] mt-24 py-10 sm:py-12 bg-[#0B0E14]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-gray-400 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-semibold text-white">Sri Lankan Holiday API</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-bold">imrishmika.dev</a></span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="hover:text-white transition font-medium">imrishmika.dev</a>
              <Link href="/docs" className="text-amber-400 hover:underline font-semibold">Swagger Docs (/docs)</Link>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub Repo</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
