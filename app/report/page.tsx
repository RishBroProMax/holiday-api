'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bug, Lightbulb, Send, CheckCircle2, AlertTriangle, Loader2, ArrowLeft, Shield } from 'lucide-react';

export default function ReportPage() {
  const [reportType, setReportType] = useState<'bug' | 'idea'>('bug');
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
      setErrorMsg('Please fill in both the summary and description fields.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/v1/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
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
        setErrorMsg(data.error || 'Failed to submit feedback.');
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
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[170px] transition-colors ${reportType === 'bug' ? 'bg-rose-600/10' : 'bg-amber-500/10'}`} />
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="border-b border-[#141B28] backdrop-blur-xl bg-[#06080E]/80 sticky top-0 z-50">
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
                  Feedback & Bug Hub
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
            {/* Type Switcher */}
            <div className="flex bg-[#06080E] p-1.5 rounded-2xl border border-[#1F2B3E] mb-8 text-xs font-bold">
              <button
                type="button"
                onClick={() => setReportType('bug')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${reportType === 'bug' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                <Bug className="w-4 h-4" />
                <span>Report a Bug</span>
              </button>
              <button
                type="button"
                onClick={() => setReportType('idea')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition ${reportType === 'idea' ? 'bg-amber-400 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Suggest New Idea</span>
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${reportType === 'bug' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                {reportType === 'bug' ? <Bug className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {reportType === 'bug' ? 'Report an API Bug or Data Issue' : 'Suggest a Feature or New Idea'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Submissions are instantly dispatched to our developer Discord channel via webhook for rapid review!
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
                <h2 className="text-2xl font-extrabold text-white">
                  {reportType === 'bug' ? 'Bug Report Dispatched to Discord!' : 'Feature Idea Dispatched to Discord!'}
                </h2>
                <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                  Thank you! Your feedback helps make the Sri Lankan Holiday API better for everyone.
                </p>
                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-[#06080E] border border-[#1F2B3E] hover:border-gray-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                  >
                    Submit Another Response
                  </button>
                  <Link
                    href="/"
                    className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg"
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
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="API Endpoint Issue">REST API Endpoint</option>
                      <option value="NPM Module SDK">Node.js NPM Module SDK</option>
                      <option value="Holiday Date Data">Holiday Date / Calendar Data</option>
                      <option value="Web Dashboard UI">Website UI / Dashboard</option>
                      <option value="New Feature Idea">New Feature Idea</option>
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
                      className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    {reportType === 'bug' ? 'Bug Summary / Title *' : 'Idea Title / Feature Summary *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={reportType === 'bug' ? 'e.g. GET /api/v2/holidays returns 500 when limit > 100' : 'e.g. Add webhook push notifications for upcoming holidays'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    {reportType === 'bug' ? 'Detailed Description / Steps to Reproduce *' : 'Explain Your Idea / Why it helps developers *'}
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder={reportType === 'bug' ? 'Please include relevant dates, code snippets, request URLs, or error messages...' : 'Describe how this feature should work and why it would be helpful...'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Discord Notification Engine Active
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-xl disabled:opacity-50 ${reportType === 'bug' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-400 hover:bg-amber-500 text-black'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending to Discord...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{reportType === 'bug' ? 'Submit Bug Report' : 'Submit Feature Idea'}</span>
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
