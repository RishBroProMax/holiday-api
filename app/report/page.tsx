'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bug, Send, CheckCircle2, AlertTriangle, Loader2, Package, History, ArrowLeft, Discord, Shield } from 'lucide-react';

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('API Endpoint Issue');
  const [reporterEmail, setReporterEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide a title and detailed description.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/v1/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          reporterEmail,
          pageUrl: typeof window !== 'undefined' ? window.location.href : 'Web'
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setReporterEmail('');
      } else {
        setErrorMsg(data.error || 'Failed to submit bug report.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-[#F3F4F6] selection:bg-rose-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-rose-600/10 rounded-full blur-[170px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="border-b border-[#141B28] backdrop-blur-xl bg-[#06080E]/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Sri Lankan Holiday API Logo"
                className="w-8 h-8 object-contain rounded-lg border border-rose-500/30 bg-[#0F1623] p-0.5 shadow-md"
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-rose-400 transition">
                  Sri Lankan Holiday API
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                  Bug Report Center
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#0F1623] border border-[#1F2B3E] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Bug className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Report an API Bug or Data Issue
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Encountered an issue with our REST API, NPM Module, or Holiday Dates? Let us know below! Reports are sent directly to our developer Discord webhook.
                </p>
              </div>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Report Successfully Sent to Discord!</h2>
                <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                  Thank you for contributing! Your bug report has been received on our developer Discord server and will be reviewed shortly.
                </p>
                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-[#06080E] border border-[#1F2B3E] hover:border-gray-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                  >
                    Submit Another Report
                  </button>
                  <Link
                    href="/"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg"
                  >
                    Return Home
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Issue Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                    >
                      <option value="API Endpoint Issue">REST API Endpoint Issue / Error</option>
                      <option value="NPM Module SDK Bug">Node.js NPM Module SDK Bug</option>
                      <option value="Holiday Date Error">Incorrect Holiday Date / Data Error</option>
                      <option value="Web UI Bug">Website Dashboard / UI Bug</option>
                      <option value="Feature Request">Feature Request / Enhancement</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Your Contact Info (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Email or Discord Tag (e.g. user#1234)"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Bug Title / Short Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GET /api/v2/holidays returns 500 when limit > 100"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Detailed Description / Steps to Reproduce *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Please include relevant dates, code snippets, request URLs, or error messages..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50 resize-none font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Webhook Security Active
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending to Discord...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Bug Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
