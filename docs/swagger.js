const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🇱🇰 Sri Lankan Holiday API',
      version: '2.0.0',
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

## 📁 Categories
| Category | Description |
|:---|:---|
| \`public_and_bank\` | Official public holidays (banks closed) |
| \`observance\` | Widely recognized but not official public holidays |

## 🕐 Timezone
All date calculations use **Asia/Colombo (UTC+5:30)** timezone.

## ⚠️ Disclaimer
Poya dates are computed astronomically (Jean Meeus algorithm). Islamic holiday dates are approximate and subject to moon sighting. Always verify with the Sri Lankan Government Gazette for legally binding dates.
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
    tags: [
      {
        name: 'Holidays',
        description: 'Sri Lankan public holiday endpoints'
      },
      {
        name: 'Health',
        description: 'API health and metadata'
      }
    ]
  },
  apis: ['./routes/*.js', './api/index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
