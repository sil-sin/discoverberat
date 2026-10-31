import { getEntriesByType } from '@/lib/contentful';
import { Tour } from '@/app/tours/[tour]/_components/Tour';
import { Tours } from '@/components/tours/Tours';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL, summarize } from '@/lib/site';

export const revalidate = 43200; // 12 hours

type Props = {
  params: Promise<{ tour: string }>;
};

export async function generateStaticParams() {
  const entries = await getEntriesByType('tourPage');
  return entries.map((e: any) => ({ tour: e.fields.url }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tour: tourSlug } = await params;
  const entries = await getEntriesByType('tourPage');
  const tour: any = entries?.find((e: any) => e?.fields?.url === tourSlug);

  if (!tour) return { title: 'Tour - Discover Berat' };

  const title = `${tour.fields.title} - Discover Berat`;
  const description = summarize(tour.fields.description);
  const image = `https:${tour.fields.image.fields.file.url}`;
  return {
    title,
    description,
    alternates: { canonical: `/tours/${tourSlug}` },
    openGraph: { type: 'website', title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function TourPage({ params }: Props) {
  const { tour: tourSlug } = await params;
  const entries = await getEntriesByType('tourPage');
  const tour: any =
    entries?.find((e: any) => e?.fields?.url === tourSlug) || null;

  if (!tour) {
    notFound();
  }

  const { title, description, price, image } = tour.fields;
  const url = `${SITE_URL}/tours/${tourSlug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: title,
      description: summarize(description, 500),
      image: `https:${image.fields.file.url}`,
      url,
      provider: {
        '@type': 'TravelAgency',
        name: 'Discover Berat',
        url: SITE_URL,
      },
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Tours',
          item: `${SITE_URL}/tours`,
        },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Tour
        tour={{
          ...tour.fields,
          id: tour.sys.id,
          imgUrl: tour.fields.image.fields.file.url,
          blurDataURL: tour.fields.image.fields.file.blurDataURL,
        }}
      />
      <Tours
        tours={entries.filter((entry: any) => entry !== tour).slice(0, 3)}
        pageTitle="More tours"
      />
    </>
  );
}
