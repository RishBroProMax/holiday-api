"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SriLankanHolidayAPI = exports.SUPPORTED_YEARS = exports.VALID_CATEGORIES = exports.VALID_TYPES = void 0;
exports.getAllHolidays = getAllHolidays;
exports.getHolidaysByYear = getHolidaysByYear;
exports.getHolidaysByMonth = getHolidaysByMonth;
exports.getHolidayByDate = getHolidayByDate;
exports.isHoliday = isHoliday;
exports.isPublicHoliday = isPublicHoliday;
exports.isBankHoliday = isBankHoliday;
exports.isPoyaDay = isPoyaDay;
exports.isWorkingDay = isWorkingDay;
exports.getHolidaysInRange = getHolidaysInRange;
exports.countWorkingDays = countWorkingDays;
exports.getLongWeekends = getLongWeekends;
exports.getBuddhistHolidays = getBuddhistHolidays;
exports.getHinduHolidays = getHinduHolidays;
exports.getIslamicHolidays = getIslamicHolidays;
exports.getChristianHolidays = getChristianHolidays;
exports.getNationalHolidays = getNationalHolidays;
exports.getTodayHoliday = getTodayHoliday;
exports.getUpcomingHolidays = getUpcomingHolidays;
exports.getUpcomingHoliday = getUpcomingHoliday;
exports.getPoyaDays = getPoyaDays;
exports.getNextPoyaDay = getNextPoyaDay;
exports.getDaysUntil = getDaysUntil;
exports.getHolidayById = getHolidayById;
exports.getHolidaysByType = getHolidaysByType;
exports.getHolidaysByReligion = getHolidaysByReligion;
exports.searchHolidays = searchHolidays;
exports.getMetadata = getMetadata;
exports.getDatasetStats = getDatasetStats;
const holidaysData_1 = require("./holidaysData");
exports.VALID_TYPES = ['buddhist', 'hindu', 'islamic', 'christian', 'national', 'international', 'multi'];
exports.VALID_CATEGORIES = ['public_and_bank', 'public', 'bank', 'observance'];
exports.SUPPORTED_YEARS = Array.from(new Set(holidaysData_1.holidayData.holidays.map((h) => h.year))).sort((a, b) => a - b);
/**
 * Get all Sri Lankan holidays matching optional filters
 */
function getAllHolidays(filters = {}) {
    let results = [...holidaysData_1.holidayData.holidays];
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
        results = results.filter(h => h.name.toLowerCase().includes(q) ||
            h.description.toLowerCase().includes(q) ||
            h.date.includes(q) ||
            h.type.toLowerCase().includes(q));
    }
    return results;
}
/**
 * Get all holidays for a specific year
 */
function getHolidaysByYear(year) {
    return getAllHolidays({ year });
}
/**
 * Get all holidays for a specific month in a given year
 */
function getHolidaysByMonth(year, month) {
    return getAllHolidays({ year, month });
}
/**
 * Get holidays on a specific date (YYYY-MM-DD)
 */
function getHolidayByDate(dateStr) {
    const formatted = dateStr.trim();
    return holidaysData_1.holidayData.holidays.filter(h => h.date === formatted);
}
/**
 * Check if a given date string (YYYY-MM-DD) is any holiday
 */
function isHoliday(dateStr) {
    return getHolidayByDate(dateStr).length > 0;
}
/**
 * Check if a given date string (YYYY-MM-DD) is a Public Holiday
 */
function isPublicHoliday(dateStr) {
    return getHolidayByDate(dateStr).some(h => h.isPublicHoliday);
}
/**
 * Check if a given date string (YYYY-MM-DD) is a Bank Holiday
 */
function isBankHoliday(dateStr) {
    return getHolidayByDate(dateStr).some(h => h.isBankHoliday);
}
/**
 * Check if a given date string (YYYY-MM-DD) is a Poya Day
 */
function isPoyaDay(dateStr) {
    return getHolidayByDate(dateStr).some(h => h.name.toLowerCase().includes('poya'));
}
/**
 * Check if a date (YYYY-MM-DD) is a business working day in Sri Lanka
 * (Returns false for Saturdays, Sundays, and Public Holidays)
 */
function isWorkingDay(dateStr) {
    const formatted = dateStr.trim();
    const dateObj = new Date(formatted + 'T00:00:00');
    if (isNaN(dateObj.getTime()))
        return false;
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6)
        return false;
    return !isPublicHoliday(formatted);
}
/**
 * Get all holidays falling between two dates (inclusive)
 */
function getHolidaysInRange(startDateStr, endDateStr, filters = {}) {
    const start = startDateStr.trim();
    const end = endDateStr.trim();
    const allFiltered = getAllHolidays(filters);
    return allFiltered.filter(h => h.date >= start && h.date <= end).sort((a, b) => a.date.localeCompare(b.date));
}
/**
 * Count total business working days between two dates (inclusive)
 * (Excludes Saturdays, Sundays, and Sri Lankan Public Holidays)
 */
function countWorkingDays(startDateStr, endDateStr) {
    const start = new Date(startDateStr.trim() + 'T00:00:00');
    const end = new Date(endDateStr.trim() + 'T00:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end)
        return 0;
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        if (isWorkingDay(dateStr)) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}
function formatYMD(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
/**
 * Find all long weekend opportunities for a target year (or all years if omitted)
 */
function getLongWeekends(year) {
    const holidays = getAllHolidays({ year, publicOnly: true });
    const results = [];
    for (const h of holidays) {
        const hDate = new Date(h.date + 'T00:00:00');
        const dayOfWeek = hDate.getDay(); // 1 = Monday, 5 = Friday
        if (dayOfWeek === 1) { // Monday -> Long weekend (Sat, Sun, Mon)
            const sat = new Date(hDate);
            sat.setDate(sat.getDate() - 2);
            const sun = new Date(hDate);
            sun.setDate(sun.getDate() - 1);
            results.push({
                holiday: h,
                dates: [formatYMD(sat), formatYMD(sun), h.date],
                dayCount: 3
            });
        }
        else if (dayOfWeek === 5) { // Friday -> Long weekend (Fri, Sat, Sun)
            const sat = new Date(hDate);
            sat.setDate(sat.getDate() + 1);
            const sun = new Date(hDate);
            sun.setDate(sun.getDate() + 2);
            results.push({
                holiday: h,
                dates: [h.date, formatYMD(sat), formatYMD(sun)],
                dayCount: 3
            });
        }
    }
    return results;
}
/**
 * Get all Buddhist holidays / Poya days for a year
 */
function getBuddhistHolidays(year) {
    return getAllHolidays({ year, religion: 'buddhist' });
}
/**
 * Get all Hindu holidays / festivals for a year
 */
function getHinduHolidays(year) {
    return getAllHolidays({ year, religion: 'hindu' });
}
/**
 * Get all Islamic holidays for a year
 */
function getIslamicHolidays(year) {
    return getAllHolidays({ year, religion: 'islamic' });
}
/**
 * Get all Christian holidays for a year
 */
function getChristianHolidays(year) {
    return getAllHolidays({ year, religion: 'christian' });
}
/**
 * Get all National holidays for a year
 */
function getNationalHolidays(year) {
    return getAllHolidays({ year, religion: 'national' });
}
/**
 * Helper to get today's date in Asia/Colombo timezone (YYYY-MM-DD)
 */
function getSriLankaTodayString() {
    const now = new Date();
    const sriLankaOffset = 5.5 * 60 * 60 * 1000;
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const sriLankaTime = new Date(utcTime + sriLankaOffset);
    return sriLankaTime.toISOString().split('T')[0];
}
/**
 * Get today's holiday(s) in Sri Lanka
 */
function getTodayHoliday() {
    return getHolidayByDate(getSriLankaTodayString());
}
/**
 * Get upcoming holidays from today in Sri Lanka
 */
function getUpcomingHolidays(options = {}) {
    const todayStr = getSriLankaTodayString();
    let candidates = holidaysData_1.holidayData.holidays.filter(h => h.date >= todayStr);
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
function getUpcomingHoliday(publicOnly = false) {
    const upcoming = getUpcomingHolidays({ limit: 1, publicOnly });
    return upcoming.length > 0 ? upcoming[0] : null;
}
/**
 * Get all Full Moon Poya days for a specific year (or all years if omitted)
 */
function getPoyaDays(year) {
    let list = holidaysData_1.holidayData.holidays.filter(h => h.name.toLowerCase().includes('poya'));
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
function getNextPoyaDay() {
    const todayStr = getSriLankaTodayString();
    const poyaDays = holidaysData_1.holidayData.holidays
        .filter(h => h.name.toLowerCase().includes('poya') && h.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date));
    if (poyaDays.length === 0)
        return null;
    const nextPoya = poyaDays[0];
    const todayDate = new Date(todayStr + 'T00:00:00');
    const poyaDate = new Date(nextPoya.date + 'T00:00:00');
    const diffTime = Math.abs(poyaDate.getTime() - todayDate.getTime());
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
        ...nextPoya,
        daysUntil
    };
}
/**
 * Calculate days remaining until a target date (YYYY-MM-DD) from today in Sri Lanka
 */
function getDaysUntil(dateStr) {
    const todayStr = getSriLankaTodayString();
    const today = new Date(todayStr + 'T00:00:00');
    const target = new Date(dateStr.trim() + 'T00:00:00');
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
/**
 * Lookup a specific holiday by exact ID string
 */
function getHolidayById(id) {
    const targetId = id.trim().toLowerCase();
    const found = holidaysData_1.holidayData.holidays.find(h => h.id.toLowerCase() === targetId);
    return found || null;
}
/**
 * Get holidays by tradition type (buddhist, hindu, islamic, christian, national)
 */
function getHolidaysByType(type) {
    return getAllHolidays({ type });
}
/**
 * Get holidays by religion
 */
function getHolidaysByReligion(religion) {
    return getAllHolidays({ religion });
}
/**
 * Search holidays by keyword
 */
function searchHolidays(query) {
    return getAllHolidays({ query });
}
/**
 * Get metadata about the holiday dataset
 */
function getMetadata() {
    return holidaysData_1.holidayData.meta;
}
/**
 * Get dataset analytical breakdown statistics
 */
function getDatasetStats() {
    const holidays = holidaysData_1.holidayData.holidays;
    const totalHolidays = holidays.length;
    const publicCount = holidays.filter(h => h.isPublicHoliday).length;
    const bankCount = holidays.filter(h => h.isBankHoliday).length;
    const poyaCount = holidays.filter(h => h.name.toLowerCase().includes('poya')).length;
    const breakdownByReligion = {};
    for (const h of holidays) {
        const r = h.type.toLowerCase();
        breakdownByReligion[r] = (breakdownByReligion[r] || 0) + 1;
    }
    return {
        totalHolidays,
        supportedYears: exports.SUPPORTED_YEARS,
        startYear: exports.SUPPORTED_YEARS[0],
        endYear: exports.SUPPORTED_YEARS[exports.SUPPORTED_YEARS.length - 1],
        publicCount,
        bankCount,
        poyaCount,
        breakdownByReligion,
        version: holidaysData_1.holidayData.meta.version
    };
}
/**
 * Async API Client to optionally query live REST API with automatic offline fallback
 */
class SriLankanHolidayAPI {
    constructor(options = {}) {
        this.baseUrl = (options.baseUrl || 'https://holiday.imrishmika.dev').replace(/\/$/, '');
        this.useOfflineFallback = options.useOfflineFallback !== false;
        this.timeout = options.timeout || 5000;
    }
    async fetchRemote(endpoint) {
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
        }
        catch (err) {
            clearTimeout(id);
            throw err;
        }
    }
    /**
     * Get all holidays from live REST API (or fallback to offline dataset)
     */
    async getAllHolidays(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.year)
                params.append('year', String(filters.year));
            if (filters.month)
                params.append('month', String(filters.month));
            if (filters.type)
                params.append('type', filters.type);
            if (filters.category)
                params.append('category', filters.category);
            if (filters.publicOnly)
                params.append('public', 'true');
            if (filters.bankOnly)
                params.append('bank', 'true');
            const queryStr = params.toString();
            const res = await this.fetchRemote(`/api/v2/holidays${queryStr ? '?' + queryStr : ''}`);
            if (res && res.success && Array.isArray(res.data)) {
                return res.data;
            }
        }
        catch (err) {
            if (!this.useOfflineFallback)
                throw err;
        }
        return getAllHolidays(filters);
    }
    /**
     * Get today's holiday from live REST API (or fallback to offline dataset)
     */
    async getToday() {
        try {
            const res = await this.fetchRemote('/api/v1/holidays/today');
            if (res && res.success && Array.isArray(res.data)) {
                return res.data;
            }
        }
        catch (err) {
            if (!this.useOfflineFallback)
                throw err;
        }
        return getTodayHoliday();
    }
    /**
     * Get upcoming holidays from live REST API (or fallback to offline dataset)
     */
    async getUpcoming(limit = 5) {
        try {
            const res = await this.fetchRemote(`/api/v2/holidays/upcoming?limit=${limit}`);
            if (res && res.success && Array.isArray(res.data)) {
                return res.data;
            }
        }
        catch (err) {
            if (!this.useOfflineFallback)
                throw err;
        }
        return getUpcomingHolidays({ limit });
    }
    /**
     * Search holidays using live REST API (or fallback to offline dataset)
     */
    async search(query) {
        try {
            const res = await this.fetchRemote(`/api/v2/holidays/search?q=${encodeURIComponent(query)}`);
            if (res && res.success && Array.isArray(res.data)) {
                return res.data;
            }
        }
        catch (err) {
            if (!this.useOfflineFallback)
                throw err;
        }
        return searchHolidays(query);
    }
}
exports.SriLankanHolidayAPI = SriLankanHolidayAPI;
// Default export object
exports.default = {
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
    isWorkingDay,
    getHolidaysInRange,
    countWorkingDays,
    getLongWeekends,
    getBuddhistHolidays,
    getHinduHolidays,
    getIslamicHolidays,
    getChristianHolidays,
    getNationalHolidays,
    getDaysUntil,
    getHolidayById,
    searchHolidays,
    getMetadata,
    getDatasetStats,
    SriLankanHolidayAPI
};
