import { getEntriesByType } from '@/utils/contentful/contentful';
import Tour from '@/components/Tour';
import Tours from '@/components/sectors/Tours';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  return {
    title: tour?.fields?.title
      ? `${tour.fields.title} - Discover Berat`
      : 'Tour - Discover Berat',
    description: tour?.fields?.description || 'Discover Berat tour details.',
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

  return (
    <>
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
