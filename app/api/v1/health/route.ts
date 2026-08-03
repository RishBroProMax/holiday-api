import { NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';
import { getTelemetryStats } from '@/lib/telemetry';

const startTime = Date.now();

export async function GET() {
  const now = Date.now();
  const uptimeSeconds = Math.floor((now - startTime) / 1000);
  
  // Format uptime to human readable string
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

  // Memory Usage Diagnostics
  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;
  const memoryStats = memoryUsage ? {
    heapUsedMB: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
    heapTotalMB: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
    rssMB: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100
  } : null;

  const holidaysList = (holidayData as any).holidays || [];
  const telemetry = getTelemetryStats();

  return NextResponse.json({
    status: 'healthy',
    statusCode: 200,
    timestamp: new Date().toISOString(),
    version: '2.5.0',
    service: 'Sri Lankan Holiday API',
    uptime: {
      seconds: uptimeSeconds,
      formatted: uptimeFormatted
    },
    checks: {
      dataset: {
        status: 'healthy',
        totalHolidaysCount: holidaysList.length,
        yearCoverage: '2024–2045 (22 Years)',
        timezone: 'Asia/Colombo'
      },
      telemetry: {
        status: 'healthy',
        activeSessions: telemetry.activeUsers,
        totalRequestsServed: telemetry.totalRequestsServed
      },
      rateLimiter: {
        status: 'healthy',
        limit: '60 requests / minute',
        protection: 'Active Edge Sliding Window'
      },
      systemMemory: memoryStats
    }
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
