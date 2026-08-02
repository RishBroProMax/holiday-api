import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingHoliday, errorResponse } from '@/lib/holidays';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get('publicOnly') === 'true';
  const holiday = getUpcomingHoliday(publicOnly);

  if (!holiday) {
    return NextResponse.json(
      errorResponse(404, 'No upcoming holidays found in the dataset.'),
      { status: 404 }
    );
  }

  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  const todayStr = sriLankaTime.toISOString().split('T')[0];

  const today = new Date(todayStr);
  const holidayDate = new Date(holiday.date);
  const diffTime = holidayDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return NextResponse.json({
    success: true,
    count: 1,
    data: holiday,
    meta: {
      apiVersion: '2.5.0',
      timezone: 'Asia/Colombo',
      daysUntil,
      checkedDate: todayStr
    }
  });
}
