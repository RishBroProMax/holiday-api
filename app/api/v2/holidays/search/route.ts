import { NextRequest, NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || searchParams.get('query') || '').trim().toLowerCase();

  if (!q) {
    return NextResponse.json({
      success: false,
      error: {
        code: 400,
        message: 'Search query parameter ?q= is required.'
      }
    }, { status: 400 });
  }

  const results = holidaysList.filter(h =>
    h.name.toLowerCase().includes(q) ||
    h.description.toLowerCase().includes(q) ||
    h.date.includes(q) ||
    h.type.toLowerCase().includes(q) ||
    h.dayOfWeek.toLowerCase().includes(q)
  );

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    query: q,
    count: results.length,
    data: results,
    meta: {
      timezone: 'Asia/Colombo'
    }
  });
}
