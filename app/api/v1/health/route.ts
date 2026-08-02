import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/holidays';

export async function GET() {
  return NextResponse.json(successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString()
  }));
}
