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
export interface LongWeekend {
    holiday: Holiday;
    dates: string[];
    dayCount: number;
}
export declare const VALID_TYPES: string[];
export declare const VALID_CATEGORIES: string[];
export declare const SUPPORTED_YEARS: any[];
/**
 * Get all Sri Lankan holidays matching optional filters
 */
export declare function getAllHolidays(filters?: FilterOptions): Holiday[];
/**
 * Get all holidays for a specific year
 */
export declare function getHolidaysByYear(year: number | string): Holiday[];
/**
 * Get all holidays for a specific month in a given year
 */
export declare function getHolidaysByMonth(year: number | string, month: number | string): Holiday[];
/**
 * Get holidays on a specific date (YYYY-MM-DD)
 */
export declare function getHolidayByDate(dateStr: string): Holiday[];
/**
 * Check if a given date string (YYYY-MM-DD) is any holiday
 */
export declare function isHoliday(dateStr: string): boolean;
/**
 * Check if a given date string (YYYY-MM-DD) is a Public Holiday
 */
export declare function isPublicHoliday(dateStr: string): boolean;
/**
 * Check if a given date string (YYYY-MM-DD) is a Bank Holiday
 */
export declare function isBankHoliday(dateStr: string): boolean;
/**
 * Check if a given date string (YYYY-MM-DD) is a Poya Day
 */
export declare function isPoyaDay(dateStr: string): boolean;
/**
 * Check if a date (YYYY-MM-DD) is a business working day in Sri Lanka
 * (Returns false for Saturdays, Sundays, and Public Holidays)
 */
export declare function isWorkingDay(dateStr: string): boolean;
/**
 * Get all holidays falling between two dates (inclusive)
 */
export declare function getHolidaysInRange(startDateStr: string, endDateStr: string, filters?: FilterOptions): Holiday[];
/**
 * Count total business working days between two dates (inclusive)
 * (Excludes Saturdays, Sundays, and Sri Lankan Public Holidays)
 */
export declare function countWorkingDays(startDateStr: string, endDateStr: string): number;
/**
 * Find all long weekend opportunities for a target year (or all years if omitted)
 */
export declare function getLongWeekends(year?: number | string): LongWeekend[];
/**
 * Get all Buddhist holidays / Poya days for a year
 */
export declare function getBuddhistHolidays(year?: number | string): Holiday[];
/**
 * Get all Hindu holidays / festivals for a year
 */
export declare function getHinduHolidays(year?: number | string): Holiday[];
/**
 * Get all Islamic holidays for a year
 */
export declare function getIslamicHolidays(year?: number | string): Holiday[];
/**
 * Get all Christian holidays for a year
 */
export declare function getChristianHolidays(year?: number | string): Holiday[];
/**
 * Get all National holidays for a year
 */
export declare function getNationalHolidays(year?: number | string): Holiday[];
/**
 * Get today's holiday(s) in Sri Lanka
 */
export declare function getTodayHoliday(): Holiday[];
/**
 * Get upcoming holidays from today in Sri Lanka
 */
export declare function getUpcomingHolidays(options?: {
    limit?: number;
    publicOnly?: boolean;
}): Holiday[];
/**
 * Get the immediate next upcoming holiday
 */
export declare function getUpcomingHoliday(publicOnly?: boolean): Holiday | null;
/**
 * Get all Full Moon Poya days for a specific year (or all years if omitted)
 */
export declare function getPoyaDays(year?: number | string): Holiday[];
/**
 * Get the immediate next Poya day with daysUntil count
 */
export declare function getNextPoyaDay(): (Holiday & {
    daysUntil: number;
}) | null;
/**
 * Calculate days remaining until a target date (YYYY-MM-DD) from today in Sri Lanka
 */
export declare function getDaysUntil(dateStr: string): number;
/**
 * Lookup a specific holiday by exact ID string
 */
export declare function getHolidayById(id: string): Holiday | null;
/**
 * Get holidays by tradition type (buddhist, hindu, islamic, christian, national)
 */
export declare function getHolidaysByType(type: string): Holiday[];
/**
 * Get holidays by religion
 */
export declare function getHolidaysByReligion(religion: string): Holiday[];
/**
 * Search holidays by keyword
 */
export declare function searchHolidays(query: string): Holiday[];
/**
 * Get metadata about the holiday dataset
 */
export declare function getMetadata(): {
    version: string;
    generated: string;
    source: string;
    totalHolidays: number;
    startYear: number;
    endYear: number;
    types: string[];
    timezone: string;
};
/**
 * Get dataset analytical breakdown statistics
 */
export declare function getDatasetStats(): {
    totalHolidays: number;
    supportedYears: any[];
    startYear: any;
    endYear: any;
    publicCount: number;
    bankCount: number;
    poyaCount: number;
    breakdownByReligion: Record<string, number>;
    version: string;
};
/**
 * Async API Client to optionally query live REST API with automatic offline fallback
 */
export declare class SriLankanHolidayAPI {
    private baseUrl;
    private useOfflineFallback;
    private timeout;
    constructor(options?: ClientOptions);
    private fetchRemote;
    /**
     * Get all holidays from live REST API (or fallback to offline dataset)
     */
    getAllHolidays(filters?: FilterOptions): Promise<Holiday[]>;
    /**
     * Get today's holiday from live REST API (or fallback to offline dataset)
     */
    getToday(): Promise<Holiday[]>;
    /**
     * Get upcoming holidays from live REST API (or fallback to offline dataset)
     */
    getUpcoming(limit?: number): Promise<Holiday[]>;
    /**
     * Search holidays using live REST API (or fallback to offline dataset)
     */
    search(query: string): Promise<Holiday[]>;
}
declare const _default: {
    getAllHolidays: typeof getAllHolidays;
    getHolidaysByYear: typeof getHolidaysByYear;
    getHolidaysByMonth: typeof getHolidaysByMonth;
    getHolidayByDate: typeof getHolidayByDate;
    getTodayHoliday: typeof getTodayHoliday;
    getUpcomingHolidays: typeof getUpcomingHolidays;
    getUpcomingHoliday: typeof getUpcomingHoliday;
    getPoyaDays: typeof getPoyaDays;
    getNextPoyaDay: typeof getNextPoyaDay;
    getHolidaysByType: typeof getHolidaysByType;
    getHolidaysByReligion: typeof getHolidaysByReligion;
    isHoliday: typeof isHoliday;
    isPublicHoliday: typeof isPublicHoliday;
    isBankHoliday: typeof isBankHoliday;
    isPoyaDay: typeof isPoyaDay;
    isWorkingDay: typeof isWorkingDay;
    getHolidaysInRange: typeof getHolidaysInRange;
    countWorkingDays: typeof countWorkingDays;
    getLongWeekends: typeof getLongWeekends;
    getBuddhistHolidays: typeof getBuddhistHolidays;
    getHinduHolidays: typeof getHinduHolidays;
    getIslamicHolidays: typeof getIslamicHolidays;
    getChristianHolidays: typeof getChristianHolidays;
    getNationalHolidays: typeof getNationalHolidays;
    getDaysUntil: typeof getDaysUntil;
    getHolidayById: typeof getHolidayById;
    searchHolidays: typeof searchHolidays;
    getMetadata: typeof getMetadata;
    getDatasetStats: typeof getDatasetStats;
    SriLankanHolidayAPI: typeof SriLankanHolidayAPI;
};
export default _default;
