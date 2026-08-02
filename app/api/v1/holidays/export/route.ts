import { NextRequest, NextResponse } from 'next/server';
import { getAllHolidays } from '@/lib/holidays';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const year = searchParams.get('year') || undefined;

  const holidays = getAllHolidays({ year });

  if (format === 'csv') {
    // Generate CSV string
    const headers = ['id', 'name', 'date', 'year', 'month', 'day', 'dayOfWeek', 'type', 'category', 'isPublicHoliday', 'isBankHoliday', 'description'];
    const rows = holidays.map(h => [
      `"${h.id}"`,
      `"${h.name.replace(/"/g, '""')}"`,
      `"${h.date}"`,
      h.year,
      h.month,
      h.day,
      `"${h.dayOfWeek}"`,
      `"${h.type}"`,
      `"${h.category}"`,
      h.isPublicHoliday,
      h.isBankHoliday,
      `"${h.description.replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="sri_lankan_holidays_${year || '2024-2045'}.csv"`
      }
    });
  }

  // Default JSON export
  return new NextResponse(JSON.stringify(holidays, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="sri_lankan_holidays_${year || '2024-2045'}.json"`
    }
  });
}
