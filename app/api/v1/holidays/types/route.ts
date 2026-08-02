import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/holidays';

export async function GET() {
  const types = [
    { type: 'buddhist', label: 'Buddhist', description: 'Full Moon Poya days (astronomically calculated)' },
    { type: 'hindu', label: 'Hindu', description: 'Hindu festivals including Deepavali, Thai Pongal, and Sivarathri' },
    { type: 'islamic', label: 'Islamic', description: 'Islamic observances including Eid al-Fitr, Eid al-Adha, and Milad-Un-Nabi' },
    { type: 'christian', label: 'Christian', description: 'Christian holidays including Christmas and Good Friday' },
    { type: 'national', label: 'National', description: 'National holidays including Independence Day, May Day, and Sinhala & Tamil New Year' },
    { type: 'international', label: 'International', description: 'International observances like World Environment Day, Women\'s Day' },
    { type: 'multi', label: 'Multi-religious', description: 'Days where multiple holidays coincide' }
  ];

  return NextResponse.json(successResponse(types));
}
