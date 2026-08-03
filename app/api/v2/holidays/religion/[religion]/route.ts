import { NextRequest, NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET(
  request: NextRequest,
  { params }: { params: { religion: string } }
) {
  const religionParam = params.religion.toLowerCase();
  const { searchParams } = new URL(request.url);
  const yearStr = searchParams.get('year');

  let filtered = holidaysList.filter(h => h.type.toLowerCase() === religionParam);

  if (yearStr) {
    const y = parseInt(yearStr, 10);
    if (!isNaN(y)) filtered = filtered.filter(h => h.year === y);
  }

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    religion: religionParam,
    count: filtered.length,
    data: filtered,
    meta: {
      timezone: 'Asia/Colombo'
    }
  });
}
