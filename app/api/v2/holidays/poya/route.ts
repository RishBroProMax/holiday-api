import { NextRequest, NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const yearStr = searchParams.get('year');
  const monthStr = searchParams.get('month');

  // Filter Buddhist Poya days
  let poyas = holidaysList.filter(h =>
    h.type === 'buddhist' || h.name.toLowerCase().includes('poya')
  );

  if (yearStr) {
    const y = parseInt(yearStr, 10);
    if (!isNaN(y)) poyas = poyas.filter(h => h.year === y);
  }

  if (monthStr) {
    const m = parseInt(monthStr, 10);
    if (!isNaN(m)) poyas = poyas.filter(h => h.month === m);
  }

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    count: poyas.length,
    data: poyas,
    meta: {
      timezone: 'Asia/Colombo',
      year: yearStr ? parseInt(yearStr, 10) : 'all',
      month: monthStr ? parseInt(monthStr, 10) : 'all'
    }
  });
}
