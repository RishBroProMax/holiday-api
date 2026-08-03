import { NextRequest, NextResponse } from 'next/server';
import holidayData from '@/data/holidays.json';

const holidaysList: any[] = (holidayData as any).holidays || [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Filters
  const search = searchParams.get('search') || searchParams.get('q') || '';
  const yearStr = searchParams.get('year');
  const monthStr = searchParams.get('month');
  const typeStr = searchParams.get('type');
  const categoryStr = searchParams.get('category');
  const isPublicStr = searchParams.get('isPublicHoliday') || searchParams.get('public');
  const isBankStr = searchParams.get('isBankHoliday') || searchParams.get('bank');
  const isPoyaStr = searchParams.get('isPoya') || searchParams.get('poya');

  // Pagination & Sorting
  const sort = searchParams.get('sort') || 'date_asc';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

  let results = [...holidaysList];

  // Apply Search Filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q) ||
      h.date.includes(q) ||
      h.type.toLowerCase().includes(q) ||
      h.dayOfWeek.toLowerCase().includes(q)
    );
  }

  // Apply Year Filter
  if (yearStr) {
    const y = parseInt(yearStr, 10);
    if (!isNaN(y)) results = results.filter(h => h.year === y);
  }

  // Apply Month Filter
  if (monthStr) {
    const m = parseInt(monthStr, 10);
    if (!isNaN(m)) results = results.filter(h => h.month === m);
  }

  // Apply Type Filter
  if (typeStr && typeStr !== 'all') {
    results = results.filter(h => h.type.toLowerCase() === typeStr.toLowerCase());
  }

  // Apply Category Filter
  if (categoryStr && categoryStr !== 'all') {
    results = results.filter(h => h.category.toLowerCase() === categoryStr.toLowerCase());
  }

  // Apply Public Holiday Filter
  if (isPublicStr !== null) {
    const isPublic = isPublicStr === 'true' || isPublicStr === '1';
    results = results.filter(h => h.isPublicHoliday === isPublic);
  }

  // Apply Bank Holiday Filter
  if (isBankStr !== null) {
    const isBank = isBankStr === 'true' || isBankStr === '1';
    results = results.filter(h => h.isBankHoliday === isBank);
  }

  // Apply Poya Filter
  if (isPoyaStr !== null) {
    const isPoya = isPoyaStr === 'true' || isPoyaStr === '1';
    results = results.filter(h =>
      isPoya
        ? (h.type === 'buddhist' || h.name.toLowerCase().includes('poya'))
        : (h.type !== 'buddhist' && !h.name.toLowerCase().includes('poya'))
    );
  }

  // Apply Sorting
  results.sort((a, b) => {
    if (sort === 'date_desc') return b.date.localeCompare(a.date);
    if (sort === 'name_asc') return a.name.localeCompare(b.name);
    if (sort === 'name_desc') return b.name.localeCompare(a.name);
    return a.date.localeCompare(b.date); // default: date_asc
  });

  // Apply Pagination
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = results.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    apiVersion: '3.0.0-beta',
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: paginatedData,
    meta: {
      timezone: 'Asia/Colombo',
      filtersApplied: {
        search: search || null,
        year: yearStr ? parseInt(yearStr, 10) : null,
        month: monthStr ? parseInt(monthStr, 10) : null,
        type: typeStr || null,
        category: categoryStr || null,
        sort,
      }
    }
  });
}
