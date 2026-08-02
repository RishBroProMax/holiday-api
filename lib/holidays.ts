import holidayData from '../data/holidays.json';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  type: string;
  category: string;
  isPublicHoliday: boolean;
  isBankHoliday: boolean;
  description: string;
}

export const VALID_TYPES = ['buddhist', 'hindu', 'islamic', 'christian', 'national', 'international', 'multi'];
export const VALID_CATEGORIES = ['public_and_bank', 'public', 'bank', 'observance'];
export const SUPPORTED_YEARS = Array.from(new Set(holidayData.holidays.map((h: any) => h.year))).sort((a, b) => a - b);

export function getAllHolidays(filters: {
  year?: string | number;
  month?: string | number;
  type?: string;
  category?: string;
  public?: string | boolean;
  bank?: string | boolean;
} = {}): Holiday[] {
  let results: Holiday[] = [...holidayData.holidays] as Holiday[];

  if (filters.year) {
    const year = parseInt(String(filters.year));
    results = results.filter(h => h.year === year);
  }

  if (filters.month) {
    const month = parseInt(String(filters.month));
    results = results.filter(h => h.month === month);
  }

  if (filters.type) {
    const type = filters.type.toLowerCase();
    results = results.filter(h => h.type === type);
  }

  if (filters.category) {
    const category = filters.category.toLowerCase();
    results = results.filter(h => h.category === category);
  }

  if (filters.public === 'true' || filters.public === true) {
    results = results.filter(h => h.isPublicHoliday);
  }

  if (filters.bank === 'true' || filters.bank === true) {
    results = results.filter(h => h.isBankHoliday);
  }

  return results;
}

export function getHolidaysByYear(year: string | number): Holiday[] {
  const y = parseInt(String(year));
  return (holidayData.holidays as Holiday[]).filter(h => h.year === y);
}

export function getHolidaysByMonth(year: string | number, month: string | number): Holiday[] {
  const y = parseInt(String(year));
  const m = parseInt(String(month));
  return (holidayData.holidays as Holiday[]).filter(h => h.year === y && h.month === m);
}

export function getHolidayByDate(dateStr: string): Holiday[] {
  return (holidayData.holidays as Holiday[]).filter(h => h.date === dateStr);
}

export function getUpcomingHoliday(onlyPublic: boolean = false): Holiday | null {
  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  const todayStr = sriLankaTime.toISOString().split('T')[0];

  let candidates = (holidayData.holidays as Holiday[]).filter(h => h.date >= todayStr);
  if (onlyPublic) {
    candidates = candidates.filter(h => h.isPublicHoliday);
  }
  candidates.sort((a, b) => a.date.localeCompare(b.date));

  return candidates.length > 0 ? candidates[0] : null;
}

export function getTodayHoliday(): Holiday[] {
  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  const todayStr = sriLankaTime.toISOString().split('T')[0];

  return getHolidayByDate(todayStr);
}

export function getHolidaysByType(type: string): Holiday[] {
  return (holidayData.holidays as Holiday[]).filter(h => h.type === type.toLowerCase());
}

export function isValidYear(year: string | number): boolean {
  const y = parseInt(String(year));
  return SUPPORTED_YEARS.includes(y);
}

export function isValidMonth(month: string | number): boolean {
  const m = parseInt(String(month));
  return m >= 1 && m <= 12;
}

export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidType(type: string): boolean {
  return VALID_TYPES.includes(type.toLowerCase());
}

export function getMetadata() {
  return holidayData.meta;
}

export function successResponse(data: any, meta: Record<string, any> = {}) {
  const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
  return {
    success: true,
    count,
    data,
    meta: {
      apiVersion: '2.5.0',
      timezone: 'Asia/Colombo',
      ...meta
    }
  };
}

export function errorResponse(code: number, message: string) {
  return {
    success: false,
    error: {
      code,
      message
    }
  };
}
