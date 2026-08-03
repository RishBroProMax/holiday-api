import { NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';
import { getTelemetryStats } from '@/lib/telemetry';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET() {
  const telemetry = getTelemetryStats();

  const typeCounts: Record<string, number> = {};
  let publicCount = 0;
  let bankCount = 0;
  let poyaCount = 0;

  holidaysList.forEach(h => {
    typeCounts[h.type] = (typeCounts[h.type] || 0) + 1;
    if (h.isPublicHoliday) publicCount++;
    if (h.isBankHoliday) bankCount++;
    if (h.type === 'buddhist' || h.name.toLowerCase().includes('poya')) poyaCount++;
  });

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    data: {
      dataset: {
        totalHolidays: holidaysList.length,
        yearCoverage: '2024–2045',
        totalYears: 22,
        publicHolidaysCount: publicCount,
        bankHolidaysCount: bankCount,
        poyaDaysCount: poyaCount,
        breakdownByType: typeCounts
      },
      telemetry
    }
  });
}
