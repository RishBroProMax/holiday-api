import { NextRequest, NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit') || '1';
  const limit = Math.min(20, Math.max(1, parseInt(limitParam, 10)));

  // Get current date string in Asia/Colombo timezone (UTC+5:30)
  const colomboDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
  const todayTime = new Date(`${colomboDateStr}T00:00:00+05:30`).getTime();

  // Filter future holidays
  const upcomingHolidays = holidaysList.filter(h => {
    const hTime = new Date(`${h.date}T00:00:00+05:30`).getTime();
    return hTime >= todayTime;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const selectedUpcoming = upcomingHolidays.slice(0, limit).map(h => {
    const hTime = new Date(`${h.date}T00:00:00+05:30`).getTime();
    const daysUntil = Math.ceil((hTime - todayTime) / (1000 * 60 * 60 * 24));
    return {
      ...h,
      daysUntil
    };
  });

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    count: selectedUpcoming.length,
    data: limit === 1 ? (selectedUpcoming[0] || null) : selectedUpcoming,
    meta: {
      timezone: 'Asia/Colombo',
      checkedDate: colomboDateStr,
      limitRequested: limit
    }
  });
}
