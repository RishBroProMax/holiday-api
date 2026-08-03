import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0E14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Sri Lanka Holiday API | Public, Bank & Poya Days | Free REST API',
  description: 'Free, fast REST API for Sri Lanka public, bank and Poya holidays (2024–2045). Browse live docs, export JSON/CSV, and integrate with Next.js, Python, PHP or Node.',
  applicationName: 'Sri Lankan Holiday API',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Sri Lanka Holiday API',
    'Sri Lankan Holiday API',
    'Sri Lanka Public Holidays 2024 2025 2026',
    'Sri Lanka Public Holidays API',
    'Full Moon Poya Days API',
    'Poya Day API Sri Lanka',
    'Poya Day Calendar Sri Lanka',
    'Sri Lanka Bank Holidays API',
    'Sri Lanka Calendar API',
    'Sinhala and Tamil New Year Date API',
    'Sri Lanka Holiday Dataset',
    'Free Holiday API Sri Lanka',
    'Asia Colombo Holiday API',
    'Sri Lanka Holidays JSON',
    'Sri Lanka Holidays CSV',
    'Sri Lanka Mercantile Holidays',
    'Sri Lanka Public Gazette Holidays',
    'Sri Lanka Holiday Web Service',
    'Vercel Holiday API',
    'imrishmika',
    'RishBroProMax'
  ],
  authors: [
    { name: 'RishBroProMax', url: 'https://github.com/RishBroProMax' },
    { name: 'Rishmika', url: 'https://imrishmika.dev' }
  ],
  creator: 'imrishmika.dev',
  publisher: 'imrishmika.dev',
  metadataBase: new URL('https://holiday.imrishmika.dev'),
  alternates: {
    canonical: 'https://holiday.imrishmika.dev',
    languages: {
      'en-LK': 'https://holiday.imrishmika.dev',
      'x-default': 'https://holiday.imrishmika.dev',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Sri Lanka Holiday API (2024–2045) | Free REST API & Explorer',
    description: 'Free open-source REST API & Web Explorer serving 858+ Sri Lankan public, bank & Poya holidays (2024–2045). Astronomically calculated Poya days, JSON/CSV exports & interactive docs.',
    url: 'https://holiday.imrishmika.dev',
    siteName: 'Sri Lankan Holiday API',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: 'https://holiday.imrishmika.dev/OG.png',
        secureUrl: 'https://holiday.imrishmika.dev/OG.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Sri Lankan Holiday API Official Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Lanka Holiday API (2024–2045) | Free REST API & Explorer',
    description: 'Free open-source REST API serving 858+ Sri Lankan public & Poya holidays (2024–2045). Developer friendly, fast, and free.',
    images: ['https://holiday.imrishmika.dev/OG.png'],
    creator: '@imrishmika',
    site: '@imrishmika',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

// Comprehensive JSON-LD Structured Data Schema for Google Rich Search Results
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://holiday.imrishmika.dev/#website',
      'url': 'https://holiday.imrishmika.dev',
      'name': 'Sri Lankan Holiday API',
      'description': 'Free open-source REST API & dataset providing Sri Lankan public, bank, and Poya holiday data for 2024-2045.',
      'inLanguage': 'en-LK',
      'publisher': {
        '@type': 'Organization',
        'name': 'imrishmika.dev',
        'url': 'https://imrishmika.dev',
        'logo': 'https://holiday.imrishmika.dev/favicon.png'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://holiday.imrishmika.dev/?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://holiday.imrishmika.dev/#software',
      'name': 'Sri Lankan Holiday API',
      'applicationCategory': 'DeveloperApplication',
      'softwareVersion': '2.5.0',
      'operatingSystem': 'All',
      'url': 'https://holiday.imrishmika.dev',
      'downloadUrl': 'https://holiday.imrishmika.dev/api/v1/holidays/export',
      'author': {
        '@type': 'Person',
        'name': 'RishBroProMax',
        'url': 'https://imrishmika.dev'
      },
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      }
    },
    {
      '@type': 'Dataset',
      '@id': 'https://holiday.imrishmika.dev/#dataset',
      'name': 'Sri Lankan Public, Bank and Poya Holidays Dataset (2024-2045)',
      'description': 'Comprehensive dataset of 858+ Sri Lankan public holidays, bank holidays, Full Moon Poya days (astronomically computed), Islamic lunar holidays, Hindu festivals, and Christian observances.',
      'url': 'https://holiday.imrishmika.dev',
      'license': 'https://opensource.org/licenses/MIT',
      'temporalCoverage': '2024/2045',
      'spatialCoverage': {
        '@type': 'Place',
        'name': 'Sri Lanka'
      },
      'distribution': [
        {
          '@type': 'DataDownload',
          'encodingFormat': 'application/json',
          'contentUrl': 'https://holiday.imrishmika.dev/api/v1/holidays/export?format=json'
        },
        {
          '@type': 'DataDownload',
          'encodingFormat': 'text/csv',
          'contentUrl': 'https://holiday.imrishmika.dev/api/v1/holidays/export?format=csv'
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://holiday.imrishmika.dev/#breadcrumb',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://holiday.imrishmika.dev'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'API Overview',
          'item': 'https://holiday.imrishmika.dev/api'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Swagger Documentation',
          'item': 'https://holiday.imrishmika.dev/docs'
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'Dataset Export',
          'item': 'https://holiday.imrishmika.dev/api/v1/holidays/export'
        }
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://holiday.imrishmika.dev/#faq',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Is the Sri Lankan Holiday API free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, the Sri Lankan Holiday API is 100% free and open-source under the MIT license with no API key required.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How are Full Moon Poya Days calculated in the API?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Full Moon Poya days are astronomically calculated using the Jean Meeus lunar phase algorithm specifically calibrated for Sri Lanka Standard Time (Asia/Colombo timezone, UTC+5:30).'
          }
        },
        {
          '@type': 'Question',
          'name': 'What years are covered in the Sri Lanka Holiday API?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The API covers 22 complete calendar years from 2024 to 2045, containing over 858 cataloged holidays.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can I download the Sri Lanka holiday dataset as CSV or JSON?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, you can export the full dataset directly in JSON or CSV format from https://holiday.imrishmika.dev/api/v1/holidays/export.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I query upcoming holidays or check if today is a holiday?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Use /api/v1/holidays/upcoming to get the next holiday with a countdown or /api/v1/holidays/today to check today status in Sri Lanka timezone.'
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-LK" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Inject JSON-LD Structured Data for Search Engine Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0B0E14] text-[#F3F4F6] antialiased selection:bg-[#FFBE29] selection:text-black">
        {children}
      </body>
    </html>
  );
}
