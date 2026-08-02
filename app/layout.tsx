import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sri Lankan Holiday API v2.5 | Free REST API (2024–2045) | Public, Bank & Poya Days',
  description: 'Free, fast, open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024–2045. Includes astronomical Poya calculations, JSON/CSV exports, and interactive developer docs.',
  keywords: [
    'Sri Lanka Holiday API',
    'Sri Lanka Public Holidays 2024 2025 2026',
    'Full Moon Poya Days API',
    'Poya Day API Sri Lanka',
    'Sri Lanka Bank Holidays API',
    'Sri Lanka Calendar API',
    'Sinhala Tamil New Year Date API',
    'Sri Lanka Holiday Dataset',
    'Free Holiday API Sri Lanka',
    'Asia Colombo Holiday API',
    'Vercel Holiday API'
  ],
  authors: [{ name: 'RishBroProMax', url: 'https://github.com/RishBroProMax' }],
  creator: 'imrishmika.dev',
  publisher: 'imrishmika.dev',
  metadataBase: new URL('https://holiday.imrishmika.dev'),
  alternates: {
    canonical: 'https://holiday.imrishmika.dev',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Sri Lankan Holiday API v2.5 | Free REST API (2024–2045)',
    description: 'Free open-source REST API & Web Explorer serving 850+ Sri Lankan public, bank & Poya holidays (2024–2045). Developer friendly, fast, and free.',
    url: 'https://holiday.imrishmika.dev',
    siteName: 'Sri Lankan Holiday API',
    images: [
      {
        url: '/OG.png',
        width: 1200,
        height: 630,
        alt: 'Sri Lankan Holiday API Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Lankan Holiday API v2.5 | Free REST API & Explorer',
    description: 'Free open-source REST API serving 850+ Sri Lankan public & Poya holidays (2024–2045). Built for developers.',
    images: ['/OG.png'],
    creator: '@imrishmika',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD Structured Data for Google Rich Snippets
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://holiday.imrishmika.dev/#website',
      'url': 'https://holiday.imrishmika.dev',
      'name': 'Sri Lankan Holiday API',
      'description': 'Free open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024-2045.',
      'publisher': {
        '@type': 'Person',
        'name': 'RishBroProMax',
        'url': 'https://imrishmika.dev'
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
      'author': {
        '@type': 'Person',
        'name': 'RishBroProMax',
        'url': 'https://imrishmika.dev'
      },
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    },
    {
      '@type': 'Dataset',
      '@id': 'https://holiday.imrishmika.dev/#dataset',
      'name': 'Sri Lankan Public, Bank and Poya Holidays Dataset (2024-2045)',
      'description': 'Comprehensive dataset of 850+ Sri Lankan public holidays, bank holidays, Full Moon Poya days (astronomically computed), Islamic lunar holidays, Hindu festivals, and Christian observances.',
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
        
        {/* Inject JSON-LD Structured Data for Search Engines */}
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
