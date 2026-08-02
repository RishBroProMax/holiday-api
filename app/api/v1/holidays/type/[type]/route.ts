import { NextRequest, NextResponse } from 'next/server';
import { getHolidaysByType, isValidType, VALID_TYPES, successResponse, errorResponse } from '@/lib/holidays';

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  const type = params.type;

  if (!isValidType(type)) {
    return NextResponse.json(
      errorResponse(400, `Invalid type "${type}". Supported types: ${VALID_TYPES.join(', ')}`),
      { status: 400 }
    );
  }

  const holidays = getHolidaysByType(type);
  return NextResponse.json(successResponse(holidays, { type: type.toLowerCase() }));
}
