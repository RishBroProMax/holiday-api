import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/_next/',
    },
    sitemap: 'https://holiday.imrishmika.dev/sitemap.xml',
    host: 'https://holiday.imrishmika.dev',
  };
}
