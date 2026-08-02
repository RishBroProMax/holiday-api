import { NextResponse } from 'next/server';
import { getTodayHoliday } from '@/lib/holidays';

export async function GET() {
  const holidays = getTodayHoliday();
  const isHoliday = holidays.length > 0;

  return NextResponse.json({
    success: true,
    isHoliday,
    count: holidays.length,
    data: holidays,
    meta: {
      apiVersion: '2.0.0',
      timezone: 'Asia/Colombo',
      checkedDate: new Date().toISOString()
    }
  });
}
