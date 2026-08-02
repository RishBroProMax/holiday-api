import { NextRequest, NextResponse } from 'next/server';
import { getHolidayByDate, isValidDate, errorResponse } from '@/lib/holidays';

export async function GET(request: NextRequest, { params }: { params: { date: string } }) {
  const date = params.date;

  if (!isValidDate(date)) {
    return NextResponse.json(
      errorResponse(400, 'Invalid date format. Use YYYY-MM-DD (e.g., 2025-12-25).'),
      { status: 400 }
    );
  }

  const holidays = getHolidayByDate(date);
  const isHoliday = holidays.length > 0;

  return NextResponse.json({
    success: true,
    isHoliday,
    count: holidays.length,
    data: holidays,
    meta: {
      apiVersion: '2.0.0',
      queriedDate: date
    }
  });
}
