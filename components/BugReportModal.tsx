'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Lightbulb, X, Send, CheckCircle2, AlertTriangle, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'bug' | 'idea';
}

export default function BugReportModal({ isOpen, onClose, defaultType = 'bug' }: BugReportModalProps) {
  const [reportType, setReportType] = useState<'bug' | 'idea'>(defaultType);
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
        setErrorMsg(data.error || 'Failed to send submission.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#0F1623] border border-[#1F2B3E] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle Glow Background */}
          <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-colors ${reportType === 'bug' ? 'bg-rose-500/10' : 'bg-amber-500/10'}`} />

          {/* Close Button */}
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#06080E] border border-[#1A2333] text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                {reportType === 'bug' ? 'Bug Report Dispatched!' : 'New Idea Dispatched!'}
              </h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                Thank you! Your submission has been delivered directly to our developer Discord channel in real-time.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div>
              {/* Type Switcher Tabs */}
              <div className="flex bg-[#06080E] p-1 rounded-2xl border border-[#1F2B3E] mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setReportType('bug')}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${reportType === 'bug' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  <Bug className="w-4 h-4" />
                  <span>Report a Bug</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('idea')}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${reportType === 'idea' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Suggest New Idea</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${reportType === 'bug' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                  {reportType === 'bug' ? <Bug className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {reportType === 'bug' ? 'Report an API Bug or Data Error' : 'Share a Feature Request or New Idea'}
                  </h2>
                  <p className="text-xs text-gray-400">Directly alerts our developer Discord channel in real-time</p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="API Endpoint Issue">REST API Endpoint Issue / Feature</option>
                    <option value="NPM Module SDK">Node.js NPM Module SDK</option>
                    <option value="Holiday Date Data">Holiday Date / Calendar Data</option>
                    <option value="Web Dashboard UI">Website UI / Dashboard</option>
                    <option value="New Feature Idea">New Feature Idea</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    {reportType === 'bug' ? 'Bug Summary / Title *' : 'Idea Title / Feature Summary *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={reportType === 'bug' ? 'e.g. isWorkingDay returns incorrect date for April 13' : 'e.g. Add multi-language support (Sinhala/Tamil) to NPM Module'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    {reportType === 'bug' ? 'Detailed Description / Steps to Reproduce *' : 'Explain Your Idea / Why it helps users *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={reportType === 'bug' ? 'Describe what happened, expected behavior, or code snippet used...' : 'Describe how this feature should work and why it would be valuable...'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Contact Email or Discord Handle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="you@example.com or discord_handle"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="w-full bg-[#06080E] border border-[#1F2B3E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg disabled:opacity-50 ${reportType === 'bug' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-400 hover:bg-amber-500 text-black'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending to Discord...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{reportType === 'bug' ? 'Submit Bug Report' : 'Submit Idea'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
