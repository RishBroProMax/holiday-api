import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Sri Lankan Holiday API',
    version: '3.0.0-beta (v2 active)',
    description: 'A free, open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024–2030.',
    website: 'https://holiday.imrishmika.dev',
    documentation: 'https://holiday.imrishmika.dev/docs',
    changelog: 'https://holiday.imrishmika.dev/changelog',
    github: 'https://github.com/RishBroProMax/holiday-api',
    versions: {
      v1: {
        status: 'stable',
        base: '/api/v1/holidays'
      },
      v2: {
        status: '3.0.0-beta',
        base: '/api/v2/holidays',
        features: ['Advanced Search', 'Pagination', 'Multi-Upcoming Limit', 'Poya Dedicated Endpoint', 'Next Poya Countdown']
      }
    },
    endpoints: {
      v1_allHolidays: '/api/v1/holidays',
      v1_upcoming: '/api/v1/holidays/upcoming',
      v1_today: '/api/v1/holidays/today',
      v2_allHolidays: '/api/v2/holidays',
      v2_poyas: '/api/v2/holidays/poya',
      v2_nextPoya: '/api/v2/holidays/next-poya',
      v2_upcomingMulti: '/api/v2/holidays/upcoming?limit=5',
      v2_search: '/api/v2/holidays/search?q=poya',
      v2_religion: '/api/v2/holidays/religion/buddhist',
      v2_stats: '/api/v2/holidays/stats',
      export: '/api/v1/holidays/export',
      health: '/api/v1/health'
    }
  });
}
