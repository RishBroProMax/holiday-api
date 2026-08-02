# 🇱🇰 Sri Lankan Holiday API (v2.5)

![Sri Lankan Holiday API Banner](public/OG.png)

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Version](https://img.shields.io/badge/Version-v2.5.0-amber.svg)](https://holiday.imrishmika.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)
[![Live Site](https://img.shields.io/badge/Live-holiday.imrishmika.dev-007A3D.svg)](https://holiday.imrishmika.dev)

A fast, free, open-source REST API & Interactive Web Dashboard serving comprehensive Sri Lankan public, bank, and Poya holiday data for **2024 through 2045** (22 years).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **OpenAPI 3.0 (Swagger UI)**. Deploys seamlessly to Vercel.

---

## 🌐 Live URLs

- 🏠 **Web Landing Page & Playground**: [https://holiday.imrishmika.dev](https://holiday.imrishmika.dev)
- 📖 **Interactive Swagger UI Docs**: [https://holiday.imrishmika.dev/docs](https://holiday.imrishmika.dev/docs)
- 🔌 **API Base Endpoint**: [https://holiday.imrishmika.dev/api](https://holiday.imrishmika.dev/api)
- 📦 **GitHub Repository**: [https://github.com/RishBroProMax/holiday-api](https://github.com/RishBroProMax/holiday-api)

---

## ✨ Features

- 📅 **850+ Holidays Cataloged**: Complete coverage across 22 years (2024–2045).
- 🌕 **Astronomically Computed Poya Days**: Full Moon Poya dates calculated using the Jean Meeus lunar algorithm for Sri Lanka standard time (`Asia/Colombo`).
- 🕉️☪️✝️☸️ **Multi-Religious & National Coverage**: Buddhist, Hindu, Islamic, Christian, National, and International observances.
- ⚡ **Next.js Serverless Native**: Ultra-fast responses via Vercel Edge CDN.
- 🔍 **Search & Filter Explorer**: Filter by year (2024-2045), month, holiday type, category, or keyword search directly from the web interface.
- 💻 **Live API Playground & Code Generator**: Test endpoints live in browser and copy integration code for **Next.js**, **React**, **Vue 3**, **Vite**, **Node.js**, **Python**, **cURL**, **PHP**, **Go**, **Java**, and **Flutter / Dart**.
- ⏱️ **Live Ticking Countdown Timer**: Real-time ticking countdown to the next upcoming holiday.
- 📥 **Dataset Export**: One-click download buttons for full dataset in **JSON** or **CSV** format.
- 🛡️ **Production-Ready**: CORS enabled, zero database requirements.

---

## 📌 API Endpoints

Base URL: `https://holiday.imrishmika.dev`

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api` | Base API overview & endpoint listing |
| `GET` | `/api/v1/holidays` | List holidays (filters: `year`, `month`, `type`, `category`, `public`, `bank`) |
| `GET` | `/api/v1/holidays/upcoming` | Get next upcoming holiday from today in Sri Lanka |
| `GET` | `/api/v1/holidays/today` | Check if today is a public holiday in Sri Lanka |
| `GET` | `/api/v1/holidays/export` | Export full dataset in `json` or `csv` format |
| `GET` | `/api/v1/holidays/year/:year` | Get holidays for a specific year (2024–2045) |
| `GET` | `/api/v1/holidays/month/:year/:month` | Get holidays for a specific year and month |
| `GET` | `/api/v1/holidays/date/:date` | Check if a specific date (`YYYY-MM-DD`) is a holiday |
| `GET` | `/api/v1/holidays/types` | List all available holiday types |
| `GET` | `/api/v1/holidays/type/:type` | Get holidays of a specific type |
| `GET` | `/api/v1/holidays/meta` | Get dataset metadata and statistics |
| `GET` | `/api/v1/health` | Health check endpoint |

---

## 💡 Quick cURL Example

### Get Next Upcoming Holiday
```bash
curl https://holiday.imrishmika.dev/api/v1/holidays/upcoming
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "id": "2026-08-26-milad-un-nabi-holy-prophet-s-birthday",
    "name": "Milad-Un-Nabi (Holy Prophet's Birthday)",
    "date": "2026-08-26",
    "year": 2026,
    "month": 8,
    "day": 26,
    "dayOfWeek": "Wednesday",
    "type": "islamic",
    "category": "public_and_bank",
    "isPublicHoliday": true,
    "isBankHoliday": true,
    "description": "Celebrates the birthday of Prophet Muhammad (Peace Be Upon Him)."
  },
  "meta": {
    "apiVersion": "2.5.0",
    "timezone": "Asia/Colombo",
    "daysUntil": 24
  }
}
```

---

## 🛠️ Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/RishBroProMax/holiday-api.git
cd holiday-api

# Install dependencies
npm install

# Start local dev server
npm run dev

# Open in browser:
# Landing Page:     http://localhost:3000
# API Info:         http://localhost:3000/api
# Swagger Docs:     http://localhost:3000/docs
# API v1 Endpoint:  http://localhost:3000/api/v1/holidays
```

---

## 📄 License

[MIT License](LICENSE) © 2026 [imrishmika.dev](https://imrishmika.dev) • [RishBroProMax](https://github.com/RishBroProMax)
