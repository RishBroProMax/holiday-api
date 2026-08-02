const holidayData = require('../data/holidays.json');

const VALID_TYPES = ['buddhist', 'hindu', 'islamic', 'christian', 'national', 'international', 'multi'];
const VALID_CATEGORIES = ['public_and_bank', 'public', 'bank', 'observance'];
const SUPPORTED_YEARS = [...new Set(holidayData.holidays.map(h => h.year))].sort();

/**
 * Get all holidays, optionally filtered
 */
function getAllHolidays(filters = {}) {
  let results = [...holidayData.holidays];

  if (filters.year) {
    const year = parseInt(filters.year);
    results = results.filter(h => h.year === year);
  }

  if (filters.month) {
    const month = parseInt(filters.month);
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

  // Filter for public holidays only
  if (filters.public === 'true' || filters.public === true) {
    results = results.filter(h => h.isPublicHoliday);
  }

  // Filter for bank holidays only
  if (filters.bank === 'true' || filters.bank === true) {
    results = results.filter(h => h.isBankHoliday);
  }

  return results;
}

/**
 * Get holidays for a specific year
 */
function getHolidaysByYear(year) {
  const y = parseInt(year);
  return holidayData.holidays.filter(h => h.year === y);
}

/**
 * Get holidays for a specific month in a year
 */
function getHolidaysByMonth(year, month) {
  const y = parseInt(year);
  const m = parseInt(month);
  return holidayData.holidays.filter(h => h.year === y && h.month === m);
}

/**
 * Check if a specific date is a holiday
 */
function getHolidayByDate(dateStr) {
  return holidayData.holidays.filter(h => h.date === dateStr);
}

/**
 * Get the next upcoming holiday from today (uses Sri Lanka timezone UTC+5:30)
 */
function getUpcomingHoliday(onlyPublic = false) {
  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  const todayStr = sriLankaTime.toISOString().split('T')[0];

  let candidates = holidayData.holidays.filter(h => h.date >= todayStr);
  if (onlyPublic) {
    candidates = candidates.filter(h => h.isPublicHoliday);
  }
  candidates.sort((a, b) => a.date.localeCompare(b.date));

  return candidates.length > 0 ? candidates[0] : null;
}

/**
 * Check if today is a holiday (Sri Lanka timezone)
 */
function getTodayHoliday() {
  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  const todayStr = sriLankaTime.toISOString().split('T')[0];

  return getHolidayByDate(todayStr);
}

/**
 * Get holidays by type
 */
function getHolidaysByType(type) {
  return holidayData.holidays.filter(h => h.type === type.toLowerCase());
}

/**
 * Validate year parameter
 */
function isValidYear(year) {
  const y = parseInt(year);
  return SUPPORTED_YEARS.includes(y);
}

/**
 * Validate month parameter
 */
function isValidMonth(month) {
  const m = parseInt(month);
  return m >= 1 && m <= 12;
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate holiday type
 */
function isValidType(type) {
  return VALID_TYPES.includes(type.toLowerCase());
}

/**
 * Get dataset metadata
 */
function getMetadata() {
  return holidayData.meta;
}

/**
 * Build a success response
 */
function successResponse(data, meta = {}) {
  const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
  return {
    success: true,
    count,
    data,
    meta: {
      apiVersion: '2.0.0',
      timezone: 'Asia/Colombo',
      ...meta
    }
  };
}

/**
 * Build an error response
 */
function errorResponse(code, message) {
  return {
    success: false,
    error: {
      code,
      message
    }
  };
}

module.exports = {
  getAllHolidays,
  getHolidaysByYear,
  getHolidaysByMonth,
  getHolidayByDate,
  getUpcomingHoliday,
  getTodayHoliday,
  getHolidaysByType,
  getMetadata,
  isValidYear,
  isValidMonth,
  isValidDate,
  isValidType,
  successResponse,
  errorResponse,
  VALID_TYPES,
  VALID_CATEGORIES,
  SUPPORTED_YEARS
};
