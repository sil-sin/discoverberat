import type { MetadataRoute } from 'next';
import { getEntriesByType } from '@/lib/contentful';
import { SITE_URL } from '@/lib/site';

export const revalidate = 43200; // 12 hours

const PAGES = [
  '',
  '/tours',
  '/services/transfers',
  '/about',
  '/contact',
  '/terms',
  '/refund-policy',
  '/privacy-policy',
  '/cookie-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getEntriesByType('tourPage');
  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...tours.map((tour: any) => ({
      url: `${SITE_URL}/tours/${tour.fields.url}`,
      lastModified: tour.sys.updatedAt,
    })),
  ];
}
