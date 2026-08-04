import { holidayData } from './holidaysData';

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

export interface FilterOptions {
  year?: number | string;
  month?: number | string;
  type?: string;
  category?: string;
  publicOnly?: boolean;
  bankOnly?: boolean;
  religion?: string;
  query?: string;
}

export interface ClientOptions {
  baseUrl?: string;
  useOfflineFallback?: boolean;
  timeout?: number;
}

export const VALID_TYPES = ['buddhist', 'hindu', 'islamic', 'christian', 'national', 'international', 'multi'];
export const VALID_CATEGORIES = ['public_and_bank', 'public', 'bank', 'observance'];
export const SUPPORTED_YEARS = Array.from(new Set(holidayData.holidays.map((h: any) => h.year))).sort((a, b) => a - b);

/**
 * Get all Sri Lankan holidays matching optional filters
 */
export function getAllHolidays(filters: FilterOptions = {}): Holiday[] {
  let results: Holiday[] = [...holidayData.holidays] as Holiday[];

  if (filters.year !== undefined && filters.year !== null && filters.year !== '') {
    const year = parseInt(String(filters.year), 10);
    if (!isNaN(year)) {
      results = results.filter(h => h.year === year);
    }
  }

  if (filters.month !== undefined && filters.month !== null && filters.month !== '') {
    const month = parseInt(String(filters.month), 10);
    if (!isNaN(month)) {
      results = results.filter(h => h.month === month);
    }
  }

  if (filters.type) {
    const type = filters.type.toLowerCase();
    results = results.filter(h => h.type.toLowerCase() === type);
  }

  if (filters.religion) {
    const religion = filters.religion.toLowerCase();
    results = results.filter(h => h.type.toLowerCase() === religion);
  }

  if (filters.category) {
    const category = filters.category.toLowerCase();
    results = results.filter(h => h.category.toLowerCase() === category);
  }

  if (filters.publicOnly) {
    results = results.filter(h => h.isPublicHoliday);
  }

  if (filters.bankOnly) {
    results = results.filter(h => h.isBankHoliday);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    results = results.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q) ||
      h.date.includes(q) ||
      h.type.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Get all holidays for a specific year
 */
export function getHolidaysByYear(year: number | string): Holiday[] {
  return getAllHolidays({ year });
}

/**
 * Get all holidays for a specific month in a given year
 */
export function getHolidaysByMonth(year: number | string, month: number | string): Holiday[] {
  return getAllHolidays({ year, month });
}

/**
 * Get holidays on a specific date (YYYY-MM-DD)
 */
export function getHolidayByDate(dateStr: string): Holiday[] {
  const formatted = dateStr.trim();
  return (holidayData.holidays as Holiday[]).filter(h => h.date === formatted);
}

/**
 * Check if a given date string (YYYY-MM-DD) is any holiday
 */
export function isHoliday(dateStr: string): boolean {
  return getHolidayByDate(dateStr).length > 0;
}

/**
 * Check if a given date string (YYYY-MM-DD) is a Public Holiday
 */
export function isPublicHoliday(dateStr: string): boolean {
  return getHolidayByDate(dateStr).some(h => h.isPublicHoliday);
}

/**
 * Check if a given date string (YYYY-MM-DD) is a Bank Holiday
 */
export function isBankHoliday(dateStr: string): boolean {
  return getHolidayByDate(dateStr).some(h => h.isBankHoliday);
}

/**
 * Check if a given date string (YYYY-MM-DD) is a Poya Day
 */
export function isPoyaDay(dateStr: string): boolean {
  return getHolidayByDate(dateStr).some(h => h.name.toLowerCase().includes('poya'));
}

/**
 * Helper to get today's date in Asia/Colombo timezone (YYYY-MM-DD)
 */
function getSriLankaTodayString(): string {
  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  return sriLankaTime.toISOString().split('T')[0];
}

/**
 * Get today's holiday(s) in Sri Lanka
 */
export function getTodayHoliday(): Holiday[] {
  return getHolidayByDate(getSriLankaTodayString());
}

/**
 * Get upcoming holidays from today in Sri Lanka
 */
export function getUpcomingHolidays(options: { limit?: number; publicOnly?: boolean } = {}): Holiday[] {
  const todayStr = getSriLankaTodayString();
  let candidates = (holidayData.holidays as Holiday[]).filter(h => h.date >= todayStr);

  if (options.publicOnly) {
    candidates = candidates.filter(h => h.isPublicHoliday);
  }

  candidates.sort((a, b) => a.date.localeCompare(b.date));

  if (options.limit && options.limit > 0) {
    return candidates.slice(0, options.limit);
  }

  return candidates;
}

/**
 * Get the immediate next upcoming holiday
 */
export function getUpcomingHoliday(publicOnly: boolean = false): Holiday | null {
  const upcoming = getUpcomingHolidays({ limit: 1, publicOnly });
  return upcoming.length > 0 ? upcoming[0] : null;
}

/**
 * Get all Full Moon Poya days for a specific year (or all years if omitted)
 */
export function getPoyaDays(year?: number | string): Holiday[] {
  let list = (holidayData.holidays as Holiday[]).filter(h => h.name.toLowerCase().includes('poya'));
  if (year !== undefined && year !== null && year !== '') {
    const y = parseInt(String(year), 10);
    if (!isNaN(y)) {
      list = list.filter(h => h.year === y);
    }
  }
  return list;
}

/**
 * Get the immediate next Poya day with daysUntil count
 */
export function getNextPoyaDay(): (Holiday & { daysUntil: number }) | null {
  const todayStr = getSriLankaTodayString();
  const poyaDays = (holidayData.holidays as Holiday[])
    .filter(h => h.name.toLowerCase().includes('poya') && h.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (poyaDays.length === 0) return null;

  const nextPoya = poyaDays[0];
  const todayDate = new Date(todayStr);
  const poyaDate = new Date(nextPoya.date);
  const diffTime = Math.abs(poyaDate.getTime() - todayDate.getTime());
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    ...nextPoya,
    daysUntil
  };
}

/**
 * Get holidays by tradition type (buddhist, hindu, islamic, christian, national)
 */
export function getHolidaysByType(type: string): Holiday[] {
  return getAllHolidays({ type });
}

/**
 * Get holidays by religion
 */
export function getHolidaysByReligion(religion: string): Holiday[] {
  return getAllHolidays({ religion });
}

/**
 * Search holidays by keyword
 */
export function searchHolidays(query: string): Holiday[] {
  return getAllHolidays({ query });
}

/**
 * Get metadata about the holiday dataset
 */
export function getMetadata() {
  return holidayData.meta;
}

/**
 * Async API Client to optionally query live REST API with automatic offline fallback
 */
export class SriLankanHolidayAPI {
  private baseUrl: string;
  private useOfflineFallback: boolean;
  private timeout: number;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl || 'https://holiday.imrishmika.dev').replace(/\/$/, '');
    this.useOfflineFallback = options.useOfflineFallback !== false;
    this.timeout = options.timeout || 5000;
  }

  private async fetchRemote(endpoint: string): Promise<any> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(id);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  /**
   * Get all holidays from live REST API (or fallback to offline dataset)
   */
  async getAllHolidays(filters: FilterOptions = {}): Promise<Holiday[]> {
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append('year', String(filters.year));
      if (filters.month) params.append('month', String(filters.month));
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.publicOnly) params.append('public', 'true');
      if (filters.bankOnly) params.append('bank', 'true');

      const queryStr = params.toString();
      const res = await this.fetchRemote(`/api/v2/holidays${queryStr ? '?' + queryStr : ''}`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      if (!this.useOfflineFallback) throw err;
    }

    return getAllHolidays(filters);
  }

  /**
   * Get today's holiday from live REST API (or fallback to offline dataset)
   */
  async getToday(): Promise<Holiday[]> {
    try {
      const res = await this.fetchRemote('/api/v1/holidays/today');
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      if (!this.useOfflineFallback) throw err;
    }
    return getTodayHoliday();
  }

  /**
   * Get upcoming holidays from live REST API (or fallback to offline dataset)
   */
  async getUpcoming(limit: number = 5): Promise<Holiday[]> {
    try {
      const res = await this.fetchRemote(`/api/v2/holidays/upcoming?limit=${limit}`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      if (!this.useOfflineFallback) throw err;
    }
    return getUpcomingHolidays({ limit });
  }

  /**
   * Search holidays using live REST API (or fallback to offline dataset)
   */
  async search(query: string): Promise<Holiday[]> {
    try {
      const res = await this.fetchRemote(`/api/v2/holidays/search?q=${encodeURIComponent(query)}`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      if (!this.useOfflineFallback) throw err;
    }
    return searchHolidays(query);
  }
}

// Default export object
export default {
  getAllHolidays,
  getHolidaysByYear,
  getHolidaysByMonth,
  getHolidayByDate,
  getTodayHoliday,
  getUpcomingHolidays,
  getUpcomingHoliday,
  getPoyaDays,
  getNextPoyaDay,
  getHolidaysByType,
  getHolidaysByReligion,
  isHoliday,
  isPublicHoliday,
  isBankHoliday,
  isPoyaDay,
  searchHolidays,
  getMetadata,
  SriLankanHolidayAPI
};
