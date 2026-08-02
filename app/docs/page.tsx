'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { swaggerSpec } from '@/lib/swaggerSpec';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      {/* Header Bar */}
      <header className="border-b border-[#1F293D] bg-[#121824] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/favicon.png" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
          <span className="font-bold text-lg text-white">Sri Lankan Holiday API Docs</span>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
            OpenAPI 3.0
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            ← Back to Home
          </Link>
          <a
            href="https://github.com/RishBroProMax/holiday-api"
            target="_blank"
            rel="noreferrer"
            className="bg-[#1F293D] hover:bg-[#2D3B55] text-white px-3.5 py-1.5 rounded-lg text-xs transition"
          >
            GitHub Repo
          </a>
        </div>
      </header>

      {/* Swagger UI Container */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 bg-white my-8 rounded-2xl border border-[#1F293D] shadow-2xl">
        <SwaggerUI spec={swaggerSpec} />
      </main>
    </div>
  );
}
