import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sri Lankan Holiday API | Free REST API & Explorer (2024–2045)',
  description: 'Fast, free, open-source REST API providing Sri Lankan public, bank, and Poya holiday data for 2024–2045. Built with Next.js.',
  keywords: ['Sri Lanka', 'Holiday API', 'Poya Days', 'Public Holidays', 'Bank Holidays', 'REST API', 'Next.js', 'Vercel'],
  authors: [{ name: 'RishBroProMax', url: 'https://github.com/RishBroProMax' }],
  metadataBase: new URL('https://holiday.imrishmika.dev'),
  openGraph: {
    title: 'Sri Lankan Holiday API',
    description: 'Free open-source REST API & Web Explorer serving 850+ Sri Lankan public & Poya holidays (2024–2045).',
    url: 'https://holiday.imrishmika.dev',
    siteName: 'Sri Lankan Holiday API',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Lankan Holiday API',
    description: 'Free open-source REST API & Web Explorer serving 850+ Sri Lankan public & Poya holidays (2024–2045).',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0B0E14] text-[#F3F4F6] antialiased selection:bg-[#FFBE29] selection:text-black">
        {children}
      </body>
    </html>
  );
}
