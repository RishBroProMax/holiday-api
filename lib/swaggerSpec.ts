export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: '🇱🇰 Sri Lankan Holiday API',
    version: '2.5.0',
    description: `
A free, open-source REST API providing comprehensive Sri Lankan public, bank, and Poya holiday data for **2024–2045** (22 years).

- **Website & Playground**: [https://holiday.imrishmika.dev](https://holiday.imrishmika.dev)
- **GitHub Repository**: [https://github.com/RishBroProMax/holiday-api](https://github.com/RishBroProMax/holiday-api)

## 🌟 Features
- **850+ holidays** across 22 years
- **Multi-religious coverage**: Buddhist (Poya days), Hindu, Islamic, Christian & National holidays
- **Bank holidays**: Complete bank holiday categorization
- **International observances**: World Environment Day, Human Rights Day, etc.
- **Smart queries**: Filter by year, month, type, category, or specific date
- **Upcoming holiday**: Find out when the next holiday is
- **Today check**: Instantly check if today is a holiday

## 🏷️ Holiday Types
| Type | Description |
|:---|:---|
| \`buddhist\` | Full Moon Poya days (astronomically calculated) |
| \`hindu\` | Deepavali, Thai Pongal, Maha Sivarathri |
| \`islamic\` | Eid al-Fitr, Eid al-Adha, Milad-Un-Nabi |
| \`christian\` | Christmas, Good Friday |
| \`national\` | Independence Day, May Day, Sinhala & Tamil New Year |
| \`international\` | World Environment Day, Human Rights Day, etc. |

## 🕐 Timezone
All date calculations use **Asia/Colombo (UTC+5:30)** timezone.
    `,
    contact: {
      name: 'RishBroProMax',
      url: 'https://github.com/RishBroProMax/holiday-api'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'https://holiday.imrishmika.dev',
      description: 'Production Server'
    },
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server'
    }
  ],
  paths: {
    '/api': {
      get: {
        summary: 'API Overview & Base Info',
        description: 'Returns API metadata, version, and list of available endpoints.',
        responses: {
          '200': {
            description: 'API base information'
          }
        }
      }
    },
    '/api/v1/holidays': {
      get: {
        summary: 'Get all holidays',
        description: 'Retrieve Sri Lankan holidays with optional filters for year, month, type, category, public, and bank.',
        parameters: [
          { in: 'query', name: 'year', schema: { type: 'integer' }, description: 'Filter by year (2024-2045)' },
          { in: 'query', name: 'month', schema: { type: 'integer' }, description: 'Filter by month (1-12)' },
          { in: 'query', name: 'type', schema: { type: 'string' }, description: 'Filter by holiday type' },
          { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category' },
          { in: 'query', name: 'public', schema: { type: 'boolean' }, description: 'Filter for public holidays' },
          { in: 'query', name: 'bank', schema: { type: 'boolean' }, description: 'Filter for bank holidays' }
        ],
        responses: {
          '200': { description: 'List of holidays' }
        }
      }
    },
    '/api/v1/holidays/upcoming': {
      get: {
        summary: 'Get next upcoming holiday',
        description: 'Returns the next upcoming holiday from today in Asia/Colombo timezone with days countdown.',
        parameters: [
          { in: 'query', name: 'publicOnly', schema: { type: 'boolean' }, description: 'Only consider public holidays' }
        ],
        responses: {
          '200': { description: 'Next upcoming holiday' }
        }
      }
    },
    '/api/v1/holidays/today': {
      get: {
        summary: 'Check if today is a holiday',
        description: 'Returns boolean isHoliday status and holiday data if today is a holiday in Sri Lanka.',
        responses: {
          '200': { description: 'Today holiday status' }
        }
      }
    },
    '/api/v1/holidays/year/{year}': {
      get: {
        summary: 'Get holidays for a specific year',
        parameters: [
          { in: 'path', name: 'year', required: true, schema: { type: 'integer' }, description: 'Year (2024-2045)' }
        ],
        responses: {
          '200': { description: 'Year holiday list' }
        }
      }
    },
    '/api/v1/holidays/month/{year}/{month}': {
      get: {
        summary: 'Get holidays for a specific month',
        parameters: [
          { in: 'path', name: 'year', required: true, schema: { type: 'integer' } },
          { in: 'path', name: 'month', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'Month holiday list' }
        }
      }
    },
    '/api/v1/holidays/date/{date}': {
      get: {
        summary: 'Check if a specific date is a holiday',
        parameters: [
          { in: 'path', name: 'date', required: true, schema: { type: 'string' }, example: '2025-12-25' }
        ],
        responses: {
          '200': { description: 'Holiday status for date' }
        }
      }
    },
    '/api/v1/holidays/type/{type}': {
      get: {
        summary: 'Get holidays by type',
        parameters: [
          { in: 'path', name: 'type', required: true, schema: { type: 'string' }, example: 'buddhist' }
        ],
        responses: {
          '200': { description: 'Holidays by type' }
        }
      }
    },
    '/api/v1/holidays/types': {
      get: {
        summary: 'List available holiday types',
        responses: {
          '200': { description: 'List of holiday types' }
        }
      }
    },
    '/api/v1/holidays/meta': {
      get: {
        summary: 'Get dataset metadata',
        responses: {
          '200': { description: 'Dataset statistics and info' }
        }
      }
    },
    '/api/v1/health': {
      get: {
        summary: 'API Health Check',
        responses: {
          '200': { description: 'Health status' }
        }
      }
    }
  }
};
