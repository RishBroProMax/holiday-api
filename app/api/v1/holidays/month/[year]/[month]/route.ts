import { NextRequest, NextResponse } from 'next/server';
import {
  getHolidaysByMonth,
  isValidYear,
  isValidMonth,
  SUPPORTED_YEARS,
  successResponse,
  errorResponse
} from '@/lib/holidays';

export async function GET(request: NextRequest, { params }: { params: { year: string; month: string } }) {
  const { year, month } = params;

  if (!isValidYear(year)) {
    return NextResponse.json(
      errorResponse(400, `Invalid year "${year}". Supported years: ${SUPPORTED_YEARS[0]} to ${SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]}.`),
      { status: 400 }
    );
  }

  if (!isValidMonth(month)) {
    return NextResponse.json(
      errorResponse(400, 'Invalid month. Must be between 1 and 12.'),
      { status: 400 }
    );
  }

  const holidays = getHolidaysByMonth(year, month);
  return NextResponse.json(successResponse(holidays, { year: parseInt(year), month: parseInt(month) }));
}
