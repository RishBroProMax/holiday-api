import { NextResponse } from 'next/server';
import { getMetadata, successResponse } from '@/lib/holidays';

export async function GET() {
  return NextResponse.json(successResponse(getMetadata()));
}
