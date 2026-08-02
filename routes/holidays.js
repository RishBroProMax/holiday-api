const express = require('express');
const router = express.Router();
const {
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
} = require('../utils/helpers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Holiday:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "2025-12-25-christmas-day"
 *         name:
 *           type: string
 *           example: "Christmas Day"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-12-25"
 *         year:
 *           type: integer
 *           example: 2025
 *         month:
 *           type: integer
 *           example: 12
 *         day:
 *           type: integer
 *           example: 25
 *         dayOfWeek:
 *           type: string
 *           example: "Thursday"
 *         type:
 *           type: string
 *           enum: [buddhist, hindu, islamic, christian, national, international, multi]
 *           example: "christian"
 *         category:
 *           type: string
 *           enum: [public_and_bank, public, bank, observance]
 *           example: "public_and_bank"
 *         isPublicHoliday:
 *           type: boolean
 *           example: true
 *         isBankHoliday:
 *           type: boolean
 *           example: true
 *         description:
 *           type: string
 *           example: "Celebrates the birth of Jesus Christ."
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           example: 26
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Holiday'
 *         meta:
 *           type: object
 *           properties:
 *             apiVersion:
 *               type: string
 *               example: "2.0.0"
 *             timezone:
 *               type: string
 *               example: "Asia/Colombo"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               example: 400
 *             message:
 *               type: string
 *               example: "Invalid year parameter."
 */

/**
 * @swagger
 * /api/v1/holidays:
 *   get:
 *     summary: Get all holidays
 *     description: Retrieve Sri Lankan holidays. Supports filtering by year, month, type, category, public, and bank flags.
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (2024-2045)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [buddhist, hindu, islamic, christian, national, international, multi]
 *         description: Filter by holiday type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [public_and_bank, public, bank, observance]
 *         description: Filter by holiday category
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *         description: Set to true to return only public holidays
 *       - in: query
 *         name: bank
 *         schema:
 *           type: boolean
 *         description: Set to true to return only bank holidays
 *     responses:
 *       200:
 *         description: List of holidays
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res) => {
  const { year, month, type, category, public: isPublic, bank: isBank } = req.query;

  if (year && !isValidYear(year)) {
    return res.status(400).json(
      errorResponse(400, `Invalid year. Supported years range from ${SUPPORTED_YEARS[0]} to ${SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]}.`)
    );
  }

  if (month && !isValidMonth(month)) {
    return res.status(400).json(
      errorResponse(400, 'Invalid month. Must be between 1 and 12.')
    );
  }

  if (type && !isValidType(type)) {
    return res.status(400).json(
      errorResponse(400, `Invalid type. Supported types: ${VALID_TYPES.join(', ')}`)
    );
  }

  if (category && !VALID_CATEGORIES.includes(category.toLowerCase())) {
    return res.status(400).json(
      errorResponse(400, `Invalid category. Supported categories: ${VALID_CATEGORIES.join(', ')}`)
    );
  }

  const holidays = getAllHolidays({ year, month, type, category, public: isPublic, bank: isBank });
  const meta = {};
  if (year) meta.year = parseInt(year);
  if (month) meta.month = parseInt(month);
  if (type) meta.type = type;
  if (category) meta.category = category;

  res.json(successResponse(holidays, meta));
});

/**
 * @swagger
 * /api/v1/holidays/meta:
 *   get:
 *     summary: Get dataset metadata and statistics
 *     description: Returns dataset details, year coverage, total counts, and disclaimer.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Dataset metadata
 */
router.get('/meta', (req, res) => {
  res.json(successResponse(getMetadata()));
});

/**
 * @swagger
 * /api/v1/holidays/today:
 *   get:
 *     summary: Check if today is a holiday
 *     description: Returns holiday information if today is a holiday in Sri Lanka (Asia/Colombo timezone).
 *     tags: [Holidays]
 *     responses:
 *       200:
 *         description: Today's holiday status
 */
router.get('/today', (req, res) => {
  const holidays = getTodayHoliday();
  const isHoliday = holidays.length > 0;

  res.json({
    success: true,
    isHoliday,
    count: holidays.length,
    data: holidays,
    meta: {
      apiVersion: '2.0.0',
      timezone: 'Asia/Colombo',
      checkedDate: new Date().toISOString()
    }
  });
});

/**
 * @swagger
 * /api/v1/holidays/upcoming:
 *   get:
 *     summary: Get the next upcoming holiday
 *     description: Returns the next upcoming holiday from today (Asia/Colombo timezone).
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: publicOnly
 *         schema:
 *           type: boolean
 *         description: Set to true to ignore non-public observances
 *     responses:
 *       200:
 *         description: Next upcoming holiday
 *       404:
 *         description: No upcoming holiday found
 */
router.get('/upcoming', (req, res) => {
  const publicOnly = req.query.publicOnly === 'true';
  const holiday = getUpcomingHoliday(publicOnly);

  if (!holiday) {
    return res.status(404).json(
      errorResponse(404, 'No upcoming holidays found in the dataset.')
    );
  }

  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const sriLankaTime = new Date(utcTime + sriLankaOffset);
  const todayStr = sriLankaTime.toISOString().split('T')[0];

  const today = new Date(todayStr);
  const holidayDate = new Date(holiday.date);
  const diffTime = holidayDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  res.json({
    success: true,
    count: 1,
    data: holiday,
    meta: {
      apiVersion: '2.0.0',
      timezone: 'Asia/Colombo',
      daysUntil,
      checkedDate: todayStr
    }
  });
});

/**
 * @swagger
 * /api/v1/holidays/types:
 *   get:
 *     summary: List all holiday types
 *     description: Returns all available holiday categories and types.
 *     tags: [Holidays]
 *     responses:
 *       200:
 *         description: List of holiday types
 */
router.get('/types', (req, res) => {
  const types = [
    { type: 'buddhist', label: 'Buddhist', description: 'Full Moon Poya days (astronomically calculated)' },
    { type: 'hindu', label: 'Hindu', description: 'Hindu festivals including Deepavali, Thai Pongal, and Sivarathri' },
    { type: 'islamic', label: 'Islamic', description: 'Islamic observances including Eid al-Fitr, Eid al-Adha, and Milad-Un-Nabi' },
    { type: 'christian', label: 'Christian', description: 'Christian holidays including Christmas and Good Friday' },
    { type: 'national', label: 'National', description: 'National holidays including Independence Day, May Day, and Sinhala & Tamil New Year' },
    { type: 'international', label: 'International', description: 'International observances like World Environment Day, Women\'s Day' },
    { type: 'multi', label: 'Multi-religious', description: 'Days where multiple holidays coincide' }
  ];

  res.json(successResponse(types));
});

/**
 * @swagger
 * /api/v1/holidays/type/{type}:
 *   get:
 *     summary: Get holidays by type
 *     description: Retrieve all holidays of a specific type.
 *     tags: [Holidays]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [buddhist, hindu, islamic, christian, national, international, multi]
 *     responses:
 *       200:
 *         description: List of holidays by type
 *       400:
 *         description: Invalid type
 */
router.get('/type/:type', (req, res) => {
  const { type } = req.params;

  if (!isValidType(type)) {
    return res.status(400).json(
      errorResponse(400, `Invalid type "${type}". Supported types: ${VALID_TYPES.join(', ')}`)
    );
  }

  const holidays = getHolidaysByType(type);
  res.json(successResponse(holidays, { type: type.toLowerCase() }));
});

/**
 * @swagger
 * /api/v1/holidays/year/{year}:
 *   get:
 *     summary: Get holidays for a specific year
 *     description: Retrieve holidays for a given year (2024-2045).
 *     tags: [Holidays]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of holidays for the year
 *       400:
 *         description: Invalid year
 */
router.get('/year/:year', (req, res) => {
  const { year } = req.params;

  if (!isValidYear(year)) {
    return res.status(400).json(
      errorResponse(400, `Invalid year "${year}". Supported years: ${SUPPORTED_YEARS[0]} to ${SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]}.`)
    );
  }

  const holidays = getHolidaysByYear(year);
  res.json(successResponse(holidays, { year: parseInt(year) }));
});

/**
 * @swagger
 * /api/v1/holidays/month/{year}/{month}:
 *   get:
 *     summary: Get holidays for a specific month
 *     description: Retrieve holidays for a given month and year.
 *     tags: [Holidays]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: List of holidays for the month
 *       400:
 *         description: Invalid parameters
 */
router.get('/month/:year/:month', (req, res) => {
  const { year, month } = req.params;

  if (!isValidYear(year)) {
    return res.status(400).json(
      errorResponse(400, `Invalid year "${year}". Supported years: ${SUPPORTED_YEARS[0]} to ${SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]}.`)
    );
  }

  if (!isValidMonth(month)) {
    return res.status(400).json(
      errorResponse(400, 'Invalid month. Must be between 1 and 12.')
    );
  }

  const holidays = getHolidaysByMonth(year, month);
  res.json(successResponse(holidays, { year: parseInt(year), month: parseInt(month) }));
});

/**
 * @swagger
 * /api/v1/holidays/date/{date}:
 *   get:
 *     summary: Check if a specific date is a holiday
 *     description: Check whether a given date (YYYY-MM-DD) is a holiday.
 *     tags: [Holidays]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-25"
 *     responses:
 *       200:
 *         description: Holiday info for the date
 *       400:
 *         description: Invalid date format
 */
router.get('/date/:date', (req, res) => {
  const { date } = req.params;

  if (!isValidDate(date)) {
    return res.status(400).json(
      errorResponse(400, 'Invalid date format. Use YYYY-MM-DD (e.g., 2025-12-25).')
    );
  }

  const holidays = getHolidayByDate(date);
  const isHoliday = holidays.length > 0;

  res.json({
    success: true,
    isHoliday,
    count: holidays.length,
    data: holidays,
    meta: {
      apiVersion: '2.0.0',
      queriedDate: date
    }
  });
});

module.exports = router;
