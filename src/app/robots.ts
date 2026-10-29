import type { MetadataRoute } from 'next';
import { SITE_URL, isProduction } from '@/utils/site';

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/user/', '/booking/', '/authenticate'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
