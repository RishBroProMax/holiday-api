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
    searchHolidays: typeof searchHolidays;
    getMetadata: typeof getMetadata;
    SriLankanHolidayAPI: typeof SriLankanHolidayAPI;
};
export default _default;
