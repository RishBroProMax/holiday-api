import { NextRequest, NextResponse } from 'next/server';
import {
  getAllHolidays,
  isValidYear,
  isValidMonth,
  isValidType,
  VALID_TYPES,
  VALID_CATEGORIES,
  SUPPORTED_YEARS,
  successResponse,
  errorResponse
} from '@/lib/holidays';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const isPublic = searchParams.get('public');
  const isBank = searchParams.get('bank');

  if (year && !isValidYear(year)) {
    return NextResponse.json(
      errorResponse(400, `Invalid year. Supported years range from ${SUPPORTED_YEARS[0]} to ${SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]}.`),
      { status: 400 }
    );
  }

  if (month && !isValidMonth(month)) {
    return NextResponse.json(
      errorResponse(400, 'Invalid month. Must be between 1 and 12.'),
      { status: 400 }
    );
  }

  if (type && !isValidType(type)) {
    return NextResponse.json(
      errorResponse(400, `Invalid type. Supported types: ${VALID_TYPES.join(', ')}`),
      { status: 400 }
    );
  }

  if (category && !VALID_CATEGORIES.includes(category.toLowerCase())) {
    return NextResponse.json(
      errorResponse(400, `Invalid category. Supported categories: ${VALID_CATEGORIES.join(', ')}`),
      { status: 400 }
    );
  }

  const holidays = getAllHolidays({
    year: year || undefined,
    month: month || undefined,
    type: type || undefined,
    category: category || undefined,
    public: isPublic || undefined,
    bank: isBank || undefined
  });

  const meta: Record<string, any> = {};
  if (year) meta.year = parseInt(year);
  if (month) meta.month = parseInt(month);
  if (type) meta.type = type;
  if (category) meta.category = category;

  return NextResponse.json(successResponse(holidays, meta));
}
