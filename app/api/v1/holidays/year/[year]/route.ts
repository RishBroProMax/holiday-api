import { NextRequest, NextResponse } from 'next/server';
import { getHolidaysByYear, isValidYear, SUPPORTED_YEARS, successResponse, errorResponse } from '@/lib/holidays';

export async function GET(request: NextRequest, { params }: { params: { year: string } }) {
  const year = params.year;

  if (!isValidYear(year)) {
    return NextResponse.json(
      errorResponse(400, `Invalid year "${year}". Supported years: ${SUPPORTED_YEARS[0]} to ${SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]}.`),
      { status: 400 }
    );
  }

  const holidays = getHolidaysByYear(year);
  return NextResponse.json(successResponse(holidays, { year: parseInt(year) }));
}
