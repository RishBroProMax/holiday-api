const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const holidayRoutes = require('../routes/holidays');
const swaggerSpec = require('../docs/swagger');
const { getMetadata, successResponse } = require('../utils/helpers');

const app = express();

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many requests. Please try again later.'
    }
  }
});
app.use('/api/', limiter);

// Swagger UI options
const swaggerUiOptions = {
  customSiteTitle: 'Sri Lankan Holiday API - Interactive Docs',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true
  }
};

// Serve Swagger UI at both /docs and /api-docs
app.use('/docs', swaggerUi.serveFiles(swaggerSpec, swaggerUiOptions), swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.use('/api-docs', swaggerUi.serveFiles(swaggerSpec, swaggerUiOptions), swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// API Root endpoint GET /api
app.get('/api', (req, res) => {
  res.json({
    name: 'Sri Lankan Holiday API',
    version: '2.0.0',
    description: 'A free, open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024–2045.',
    website: 'https://holiday.imrishmika.dev',
    documentation: 'https://holiday.imrishmika.dev/docs',
    github: 'https://github.com/RishBroProMax/holiday-api',
    endpoints: {
      allHolidays: '/api/v1/holidays',
      upcomingHoliday: '/api/v1/holidays/upcoming',
      todayHoliday: '/api/v1/holidays/today',
      byYear: '/api/v1/holidays/year/:year',
      byMonth: '/api/v1/holidays/month/:year/:month',
      byDate: '/api/v1/holidays/date/:date',
      byType: '/api/v1/holidays/type/:type',
      typesList: '/api/v1/holidays/types',
      metadata: '/api/v1/holidays/meta',
      health: '/api/v1/health'
    }
  });
});

// API v1 Routes
app.use('/api/v1/holidays', holidayRoutes);

// Health check endpoint GET /api/v1/health
app.get('/api/v1/health', (req, res) => {
  res.json(successResponse({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }));
});

// Serve static assets from public/
app.use(express.static(path.join(__dirname, '../public')));

// Root route GET / -> serves landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `Endpoint ${req.originalUrl} not found. Refer to https://holiday.imrishmika.dev/docs for API documentation.`
    }
  });
});

// Local dev server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🇱🇰 Sri Lankan Holiday API running locally on:`);
    console.log(`  > Landing page:  http://localhost:${PORT}`);
    console.log(`  > API Info:      http://localhost:${PORT}/api`);
    console.log(`  > Interactive Docs: http://localhost:${PORT}/docs`);
    console.log(`  > API v1:        http://localhost:${PORT}/api/v1/holidays\n`);
  });
}

module.exports = app;
