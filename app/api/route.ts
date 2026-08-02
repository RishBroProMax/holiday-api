import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Sri Lankan Holiday API',
    version: '2.5.0',
    description: 'A free, open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024–2045.',
    website: 'https://holiday.imrishmika.dev',
    documentation: 'https://holiday.imrishmika.dev/docs',
    github: 'https://github.com/RishBroProMax/holiday-api',
    endpoints: {
      allHolidays: '/api/v1/holidays',
      upcomingHoliday: '/api/v1/holidays/upcoming',
      todayHoliday: '/api/v1/holidays/today',
      byYear: '/api/v1/holidays/year/:year',
      byMonth: '/api/v1/holidays/month/:year/:month',
      byDate: '/api/v1/holidays/date/:date',
      byType: '/api/v1/holidays/type/:type',
      typesList: '/api/v1/holidays/types',
      metadata: '/api/v1/holidays/meta',
      health: '/api/v1/health'
    }
  });
}
