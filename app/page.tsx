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
  List,
  Check,
  Menu,
  X,
  Users,
  Activity,
  Server,
  Bot,
  ShieldCheck,
  Cpu,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  History,
  Bug,
  Package
} from 'lucide-react';
import BugReportModal from '../components/BugReportModal';
import holidayData from '../data/holidays.json';

export default function HomePage() {
  // Navigation Menu Mobile Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  // View Mode for Explorer (Grid vs List)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Playground State
  const [playgroundUrl, setPlaygroundUrl] = useState('/api/v1/holidays/upcoming');
  const [responseJson, setResponseJson] = useState<string>('Loading demo request...');
  const [responseStatus, setResponseStatus] = useState<string>('STATUS: 200 OK');
  const [isStatusOk, setIsStatusOk] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  type FrameworkLang = 'ai-prompt' | 'nextjs' | 'react-vite' | 'vue-vite' | 'js-fetch' | 'axios' | 'python' | 'curl' | 'php' | 'go' | 'java' | 'flutter';
  const [activeCodeLang, setActiveCodeLang] = useState<FrameworkLang>('ai-prompt');

  // Explorer State
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Theme Mode (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('holiday_api_theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('holiday_api_theme', next);
  };

  // Today & Upcoming Quick Widget
  const [upcomingInfo, setUpcomingInfo] = useState<any>(null);

  // Real-Time Telemetry Stats State
  const [telemetry, setTelemetry] = useState<{ totalRequestsServed: number; activeUsers: number; status: string }>({
    totalRequestsServed: 14280,
    activeUsers: 24,
    status: 'operational'
  });

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
    const matchMonth = selectedMonth === 'all' ? true : h.month === Number(selectedMonth);
    const matchType = selectedType === 'all' ? true : h.type === selectedType;
    const matchSearch = searchQuery === '' ? true :
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.date.includes(searchQuery);
    return matchYear && matchMonth && matchType && matchSearch;
  });

  // Fetch Telemetry & Upcoming Data
  useEffect(() => {
    const fetchTelemetryAndQuickData = async () => {
      try {
        const [upRes, statsRes] = await Promise.all([
          fetch('/api/v1/holidays/upcoming'),
          fetch('/api/v1/holidays/stats')
        ]);
        if (upRes.ok) setUpcomingInfo(await upRes.json());
        if (statsRes.ok) {
          const stats = await statsRes.json();
          if (stats.data) setTelemetry(stats.data);
        }
      } catch (err) {
        console.error('Fetch error', err);
      }
    };

    fetchTelemetryAndQuickData();
    runPlayground('/api/v1/holidays/upcoming');

    // Poll live telemetry every 4 seconds for real-time request & active user ticks
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/v1/holidays/stats');
        if (res.ok) {
          const stats = await res.json();
          if (stats.data) setTelemetry(stats.data);
        }
      } catch (e) {
        // silent fail
      }
    }, 4000);

    return () => clearInterval(interval);
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

      // Trigger telemetry refresh to increment total served requests
      fetch('/api/v1/holidays/stats')
        .then(r => r.json())
        .then(s => { if (s.data) setTelemetry(s.data); })
        .catch(() => { });
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
      case 'ai-prompt':
        return `🤖 MASTER AI SYSTEM PROMPT FOR VIBE CODERS (ChatGPT / Claude / Gemini ):

"You are an expert full-stack engineer. Build a Sri Lankan public holiday feature for this app using the official Sri Lankan Holiday API.

API Base URL: https://holiday.imrishmika.dev/api/v1/holidays

API Key: None required (Free Open Source REST API)

Requirements:
1. Fetch the next upcoming holiday using GET https://holiday.imrishmika.dev/api/v1/holidays/upcoming
2. Display a live ticking countdown widget to the next Sri Lankan holiday in Asia/Colombo timezone (UTC+5:30).
3. Check if today is a public holiday using GET https://holiday.imrishmika.dev/api/v1/holidays/today
4. Allow searching & filtering holidays by year (2024-2045) and type (buddhist, hindu, islamic, christian, national).
5. Implement graceful error handling, fallback states, and revalidate cache every hour.
6. Style using Tailwind CSS with glassmorphic cards and badges for public/bank status."`;

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
      a: 'Yes! The API is 100% free and open-source under the MIT license. No API keys or credit cards required.'
    },
    {
      q: 'How are Full Moon Poya Days calculated?',
      a: 'Poya days are astronomically calculated using the Jean Meeus lunar phase algorithm calibrated for Sri Lanka Standard Time (Asia/Colombo, UTC+5:30).'
    },
    {
      q: 'What years are covered in the dataset?',
      a: 'The API covers 22 complete calendar years from 2024 through 2045, containing over 858 cataloged holidays.'
    },
    {
      q: 'Can I export or download the full dataset for offline use?',
      a: 'Yes! Export all 858+ holidays in JSON or CSV format using the download buttons on this page or via /api/v1/holidays/export.'
    },
    {
      q: 'How often is the API updated?',
      a: 'The dataset is continuously updated whenever official gazettes are issued by the Sri Lankan Ministry of Public Administration.'
    }
  ];

  const monthNames = [
    { num: 'all', label: 'All Months' },
    { num: 1, label: 'Jan' },
    { num: 2, label: 'Feb' },
    { num: 3, label: 'Mar' },
    { num: 4, label: 'Apr' },
    { num: 5, label: 'May' },
    { num: 6, label: 'Jun' },
    { num: 7, label: 'Jul' },
    { num: 8, label: 'Aug' },
    { num: 9, label: 'Sep' },
    { num: 10, label: 'Oct' },
    { num: 11, label: 'Nov' },
    { num: 12, label: 'Dec' },
  ];

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F3F4F6] selection:bg-amber-400 selection:text-black relative overflow-x-hidden font-sans">

      {/* 🌟 Dynamic Ambient Background Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15], x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] bg-amber-500/15 rounded-full blur-[160px] sm:blur-[200px]"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.22, 0.12], y: [-30, 30, -30] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-96 -right-40 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-rose-600/12 rounded-full blur-[160px] sm:blur-[200px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-10 left-1/3 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-emerald-500/10 rounded-full blur-[180px]"
        />
      </div>

      <div className="relative z-10">

        {/* 🇱🇰 Sri Lankan Heritage Glowing Accent Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-[#8D153A] via-[#FFBE29] to-[#007A3D]" />

        {/* 📌 Header Navigation */}
        <header className="border-b border-[#141B28] backdrop-blur-xl bg-[#06080E]/80 sticky top-0 z-50 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-8 h-8 object-contain rounded-lg border border-amber-400/30 bg-[#0F1623] p-0.5 shadow-md"
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-amber-400 transition">
                  Sri Lankan Holiday API
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  v3.0.0
                </span>
              </div>
            </Link>

            {/* Compact Minimal Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wide">
              <a href="#explorer" className="text-gray-400 hover:text-white transition">
                Calendar
              </a>
              <Link href="/npm-module" className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>NPM Module</span>
              </Link>
              <Link href="/docs" className="text-gray-400 hover:text-amber-400 transition flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Docs</span>
              </Link>
              <Link href="/changelog" className="text-gray-400 hover:text-rose-400 transition flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-rose-400" />
                <span>Changelog</span>
              </Link>
              <button
                onClick={() => setIsBugModalOpen(true)}
                className="text-gray-400 hover:text-rose-400 transition flex items-center gap-1.5 font-semibold text-xs"
              >
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                <span>Report Bug</span>
              </button>

              <div className="h-4 w-px bg-[#1F293D] mx-1" />

              {/* Action Buttons Group */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg bg-[#0F1623] border border-[#1A2536] text-amber-400 hover:text-amber-300 hover:border-amber-400/40 transition"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                <a
                  href="https://github.com/RishBroProMax/holiday-api"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-[#0F1623] border border-[#1A2536] hover:border-amber-400/40 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <Github className="w-3.5 h-3.5 text-gray-300" />
                  <span>GitHub</span>
                </a>
              </div>
            </nav>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0F1623] border border-[#1A2333] text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-b border-[#1A2333] bg-[#06080E]/95 px-5 py-6 space-y-4 shadow-2xl backdrop-blur-2xl"
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

                <div className="pt-4 border-t border-[#1A2333] flex flex-col gap-3">
                  <Link
                    href="/npm-module"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>NPM Package (/npm-module)</span>
                  </Link>
                  <Link
                    href="/docs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>API Documentation (/docs)</span>
                  </Link>
                  <Link
                    href="/changelog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 flex items-center justify-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    <span>API Changelog (/changelog)</span>
                  </Link>
                  <a
                    href="https://github.com/RishBroProMax/holiday-api"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-3 rounded-xl text-white font-semibold bg-[#0F1623] border border-[#1A2333] flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repository</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* 🚀 Hero Section */}
        <section className="max-w-6xl mx-auto px-4 pt-12 sm:pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Hero Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 border border-amber-400/30 text-amber-400 text-xs font-semibold mb-8 shadow-lg backdrop-blur-md max-w-full">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="truncate">Official Sri Lankan Public Holiday Engine (2024–2045)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white mb-6">
              The Complete Sri Lankan <br />
              <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
                Public, Bank & Poya Holiday API
              </span>
            </h1>

            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal px-2">
              Ultra-fast, accurate, developer-first REST API. Astronomically computed Full Moon Poya days,
              lunar Islamic dates, Hindu festivals, Christian observances & National holidays.
            </p>

            {/* API Endpoint Pill */}
            <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 bg-[#0F1623]/90 border border-amber-400/30 rounded-full px-5 py-3 mb-10 text-xs sm:text-sm font-mono text-gray-200 shadow-2xl backdrop-blur-xl hover:border-amber-400 transition group overflow-x-auto">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                GET
              </span>
              <span className="text-gray-400">|</span>
              <span className="truncate text-amber-300 font-semibold">https://holiday.imrishmika.dev/api/v1/holidays</span>
              <button
                onClick={copyDomainUrl}
                className="text-amber-400 hover:text-white text-xs font-sans font-bold flex items-center gap-1 ml-2 bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/30 px-3 py-1 rounded-full transition shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] transition"
              >
                <BookOpen className="w-5 h-5" />
                <span>Interactive API Docs (/docs)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#playground"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0F1623] border border-[#1A2333] hover:border-amber-400/50 text-white font-bold flex items-center justify-center gap-2.5 hover:bg-[#151F30] hover:scale-[1.02] transition shadow-lg"
              >
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Try Live Playground</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* 📊 Real-Time API Telemetry Bar */}
        <section className="max-w-5xl mx-auto px-4 my-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-[#0F1623] via-[#141E2E] to-[#0F1623] border border-[#1A2333] hover:border-amber-400/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute inset-0" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 block relative" />
              </div>
              <div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Live System Status</div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  Global Edge Status: <span className="text-emerald-400 font-mono font-bold text-xs uppercase">100% Operational</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-center sm:text-right">
              {/* Active Users */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 font-medium">Active Sessions</div>
                  <div className="text-sm font-black font-mono text-cyan-400">{telemetry.activeUsers} Connected</div>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-[#1A2333]" />

              {/* Total Requests Served */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 font-medium">Requests Served</div>
                  <div className="text-sm font-black font-mono text-amber-400">{telemetry.totalRequestsServed.toLocaleString()} Req</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ⏱️ Live Ticking Countdown Widget */}
        {upcomingInfo && upcomingInfo.data && (
          <section className="max-w-4xl mx-auto px-4 my-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-[#0F1623] via-[#141E2E] to-[#0F1623] border border-amber-400/30 hover:border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 p-2 shadow-inner shrink-0">
                    <img src="/favicon.png" alt="Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Next Upcoming Sri Lankan Holiday
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{upcomingInfo.data.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1 flex items-center justify-center sm:justify-start gap-2">
                      <span>{upcomingInfo.data.date} ({upcomingInfo.data.dayOfWeek})</span>
                      <span>•</span>
                      <span className="capitalize text-amber-300 font-semibold">{upcomingInfo.data.type}</span>
                    </div>
                  </div>
                </div>

                {/* Ticking Countdown Digit Boxes */}
                <div className="flex items-center gap-2 sm:gap-3 bg-[#06080E]/90 border border-[#1A2333] rounded-2xl p-3 px-5 shadow-inner">
                  <div className="text-center min-w-[44px]">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">{countdown.days}</div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Days</div>
                  </div>
                  <span className="text-gray-600 font-extrabold text-lg">:</span>
                  <div className="text-center min-w-[44px]">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Hours</div>
                  </div>
                  <span className="text-gray-600 font-extrabold text-lg">:</span>
                  <div className="text-center min-w-[44px]">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-wider">Mins</div>
                  </div>
                  <span className="text-gray-600 font-extrabold text-lg">:</span>
                  <div className="text-center min-w-[44px]">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-wider">Secs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* 🌟 Interactive Feature Bento Grid */}
        <section className="max-w-6xl mx-auto px-4 my-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <Cpu className="w-4 h-4" />
              <span>Built for High Availability & Scale</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Engineered for Developers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento 1: Astronomical Engine */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#0F1623] border border-[#1A2333] hover:border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <Moon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Astronomical Poya Engine</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Full Moon Poya dates calculated using the Jean Meeus astronomical lunar phase algorithm calibrated specifically for Asia/Colombo (UTC+5:30).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1A2333] text-xs text-amber-400 font-mono font-semibold">
                Jean Meeus Algorithm • 2024–2045
              </div>
            </motion.div>

            {/* Bento 2: Multi-Religious Coverage */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#0F1623] border border-[#1A2333] hover:border-rose-400/40 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Multi-Religious Coverage</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Full multi-cultural support covering Buddhist Poyas, Hindu festivals (Deepavali, Thai Pongal), Islamic lunar observances, Christian holidays & National events.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1A2333] text-xs text-rose-400 font-mono font-semibold">
                Buddhist • Hindu • Islamic • Christian
              </div>
            </motion.div>

            {/* Bento 3: Edge CDN & Security */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#0F1623] border border-[#1A2333] hover:border-emerald-400/40 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Edge CDN & DDoS Security</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Hosted on Vercel Serverless Edge CDN with built-in sliding window rate limiting (60 req/min) and HTTP security headers (HSTS, X-Frame-Options).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1A2333] text-xs text-emerald-400 font-mono font-semibold">
                60 req/min Limit • CORS Enabled
              </div>
            </motion.div>
          </div>
        </section>

        {/* 📥 Download Dataset Section */}
        <section id="export" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-gradient-to-r from-[#0F1623] via-[#151F30] to-[#0F1623] border border-amber-400/20 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <Download className="w-4 h-4" /> Offline Data Export
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Download Complete Holiday Dataset</h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
                Export all 858+ Sri Lankan public holidays (2024–2045) for offline mobile apps, Excel spreadsheets, or database seeds.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3.5 w-full md:w-auto">
              <a
                href="/api/v1/holidays/export?format=json"
                download
                className="w-full sm:w-auto bg-[#06080E] border border-amber-400/40 hover:border-amber-400 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2.5 transition shadow-lg hover:scale-105"
              >
                <FileJson className="w-4 h-4 text-amber-400" />
                <span>Download JSON</span>
              </a>
              <a
                href="/api/v1/holidays/export?format=csv"
                download
                className="w-full sm:w-auto bg-[#06080E] border border-emerald-400/40 hover:border-emerald-400 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2.5 transition shadow-lg hover:scale-105"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Download CSV</span>
              </a>
            </div>
          </div>
        </section>

        {/* ⚡ Live Interactive Playground */}
        <section id="playground" className="max-w-6xl mx-auto px-4 my-16">
          <div className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  Live API Playground
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">Click any preset endpoint or edit the path to test live responses in real-time.</p>
              </div>

              {/* Endpoint Preset Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '/upcoming', path: '/api/v1/holidays/upcoming' },
                  { label: '/today', path: '/api/v1/holidays/today' },
                  { label: '/year/2026', path: '/api/v1/holidays/year/2026' },
                  { label: '/type/buddhist', path: '/api/v1/holidays/type/buddhist' },
                  { label: '/meta', path: '/api/v1/holidays/meta' },
                  { label: '/stats', path: '/api/v1/holidays/stats' },
                  { label: '/health', path: '/api/v1/health' },
                ].map(chip => (
                  <button
                    key={chip.path}
                    onClick={() => handleChipClick(chip.path)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${playgroundUrl === chip.path
                        ? 'bg-amber-500/10 border-amber-400 text-amber-400 font-bold shadow-md'
                        : 'bg-[#06080E] border-[#1A2333] text-gray-400 hover:text-white hover:border-gray-600'
                      }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input Bar */}
            <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-[#1A2333] bg-[#06080E] mb-6 shadow-inner">
              <div className="flex items-center">
                <span className="bg-emerald-500/20 text-emerald-400 font-bold font-mono px-4 py-3 text-xs sm:text-sm border-b sm:border-b-0 sm:border-r border-[#1A2333] w-full sm:w-auto text-center sm:text-left">
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
                className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-7 py-3 text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            {/* JSON Output Viewer with Terminal Header */}
            <div className="bg-[#06080E] border border-[#1A2333] rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0B101A] px-4 py-3 border-b border-[#1A2333] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-gray-400 ml-2">response.json</span>
                </div>
                <span className={isStatusOk ? 'text-emerald-400 font-mono font-bold text-xs' : 'text-rose-400 font-mono font-bold text-xs'}>
                  {responseStatus}
                </span>
              </div>
              <pre className="p-4 font-mono text-xs sm:text-sm text-amber-300/90 overflow-x-auto max-h-[400px] leading-relaxed">
                {responseJson}
              </pre>
            </div>
          </div>
        </section>

        {/* 🗓️ Searchable Calendar Explorer */}
        <section id="explorer" className="max-w-6xl mx-auto px-4 my-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 flex items-center justify-center gap-3">
              <img src="/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
              Sri Lanka Holiday Calendar Explorer
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto px-2">
              Browse, filter, and search through 858+ cataloged Sri Lankan holidays across 2024 to 2045.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-5 mb-6 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search holiday name, description, date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#06080E] border border-[#1A2333] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              {/* Year Selector */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-400 font-medium">Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full md:w-auto bg-[#06080E] border border-[#1A2333] rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-amber-400 focus:outline-none"
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
                  className="w-full md:w-auto bg-[#06080E] border border-[#1A2333] rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none capitalize"
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

              {/* View Mode Toggle Button */}
              <div className="flex items-center gap-1 bg-[#06080E] border border-[#1A2333] p-1 rounded-2xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition ${viewMode === 'grid' ? 'bg-amber-400 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition ${viewMode === 'list' ? 'bg-amber-400 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Month Filter Bar */}
            <div className="flex overflow-x-auto gap-1.5 pb-1 pt-1 scrollbar-none border-t border-[#1A2333] pt-3">
              {monthNames.map(m => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMonth(m.num as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${selectedMonth === m.num
                      ? 'bg-amber-400 text-black font-bold shadow-md'
                      : 'bg-[#06080E] text-gray-400 hover:text-white hover:bg-[#121824]'
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-xs text-gray-400 mb-4 px-2 flex items-center justify-between">
            <span>Showing <strong>{filteredHolidays.length}</strong> holidays for {selectedYear}</span>
            {filteredHolidays.length === 0 && <span className="text-rose-400 font-semibold">No holidays found for selected filters</span>}
          </div>

          {/* Holiday Cards Grid or List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHolidays.map((holiday: any) => (
                <motion.div
                  key={holiday.id}
                  whileHover={{ y: -4 }}
                  className="bg-[#0F1623] border border-[#1A2333] hover:border-amber-400/40 rounded-3xl p-6 transition group flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full border ${holiday.type === 'buddhist' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          holiday.type === 'hindu' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                            holiday.type === 'islamic' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              holiday.type === 'christian' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                                'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                        {holiday.type}
                      </span>
                      <span className="text-xs text-gray-400 font-mono font-medium">
                        {holiday.dayOfWeek}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition">
                      {holiday.name}
                    </h3>
                    <div className="text-amber-400 font-mono text-sm font-extrabold mb-2">
                      {holiday.date}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {holiday.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1A2333] flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span>{holiday.isPublicHoliday ? 'Public & Bank Holiday' : 'Observance'}</span>
                    <span className="truncate max-w-[120px]">{holiday.id}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHolidays.map((holiday: any) => (
                <div key={holiday.id} className="bg-[#0F1623] border border-[#1A2333] hover:border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px] bg-[#06080E] p-2.5 rounded-xl border border-[#1A2333]">
                      <div className="text-amber-400 font-mono font-black text-sm">{holiday.date.split('-')[2]}</div>
                      <div className="text-[10px] text-gray-400 font-mono uppercase">{holiday.dayOfWeek.slice(0, 3)}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{holiday.name}</h4>
                      <p className="text-xs text-gray-400">{holiday.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-amber-300 font-mono font-bold">{holiday.type}</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      {holiday.isPublicHoliday ? 'Public' : 'Observance'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 💻 Code Integration Snippets Section */}
        <section id="code" className="max-w-6xl mx-auto px-4 my-20">
          <div className="bg-[#0F1623] border border-[#1A2333] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Code className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  Code Integration Snippets & AI Vibe Coder Prompt
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">Copy integration code for Next.js, React, Vue, Python, or copy our Master AI System Prompt to vibe code with AI!</p>
              </div>

              {/* One Click Copy Button */}
              <button
                onClick={copyCode}
                className="w-full sm:w-auto bg-[#06080E] border border-[#1A2333] hover:border-amber-400 text-xs font-semibold text-gray-200 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition shadow-md"
              >
                {copiedCode ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedCode ? 'Snippet Copied!' : 'Copy Selected Snippet'}</span>
              </button>
            </div>

            {/* Framework & Language Selector Tabs (Touch Scrollable on Mobile) */}
            <div className="flex overflow-x-auto gap-2 mb-6 border-b border-[#1A2333] pb-4 scrollbar-none">
              {[
                { id: 'ai-prompt', label: '🤖 AI System Prompt (Vibe Coders)', highlight: true },
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
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition border ${activeCodeLang === tab.id
                      ? tab.highlight
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-black border-transparent font-black shadow-lg'
                        : 'bg-amber-400 text-black border-amber-400 font-bold shadow-md'
                      : tab.highlight
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20 font-bold'
                        : 'bg-[#06080E] border-[#1A2333] text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Display Container */}
            <div className="bg-[#06080E] border border-[#1A2333] rounded-2xl p-5 shadow-inner">
              <pre className="font-mono text-xs sm:text-sm text-amber-300/90 leading-relaxed overflow-x-auto max-h-[450px]">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>
        </section>

        {/* ❓ FAQ Accordion Section for SEO */}
        <section id="faq" className="max-w-4xl mx-auto px-4 my-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
              <HelpCircle className="w-7 h-7 text-amber-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">Everything you need to know about the Sri Lankan Holiday API.</p>
          </div>

          <div className="space-y-4">
            {faqList.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0F1623] border border-[#1A2333] rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 text-sm sm:text-base focus:outline-none"
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
                      className="px-5 pb-5 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-[#1A2333] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* 📌 Footer */}
        <footer className="border-t border-[#1A2333] mt-24 py-12 bg-[#06080E]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-gray-400 text-center md:text-left">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="Logo" className="w-7 h-7 object-contain rounded-lg" />
              <span className="font-bold text-white">Sri Lankan Holiday API</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-extrabold">imrishmika.dev</a></span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="https://imrishmika.dev" target="_blank" rel="noreferrer" className="hover:text-white transition font-medium">imrishmika.dev</a>
              <Link href="/docs" className="text-amber-400 hover:underline font-bold">API Docs (/docs)</Link>
              <button onClick={() => setIsBugModalOpen(true)} className="text-rose-400 hover:underline font-bold flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" /> Report Bug
              </button>
              <a href="https://github.com/RishBroProMax/holiday-api" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub Repo</a>
            </div>
          </div>
        </footer>

        {/* Bug Report Modal */}
        <BugReportModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} />
      </div>
    </div>
  );
}
