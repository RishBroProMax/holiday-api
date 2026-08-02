import { NextResponse } from 'next/server';
import { getTelemetryStats } from '@/lib/telemetry';

export async function GET() {
  const stats = getTelemetryStats();
  return NextResponse.json({
    success: true,
    data: stats
  });
}
