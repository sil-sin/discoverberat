import Hero from '@/components/sectors/Hero/index';
import OurServices from '@/components/sectors/OurServices';
import Tours from '@/components/sectors/Tours';
import { getEntriesByType } from '@/utils/contentful/contentful';
import { TestimonialContainer } from '@/components/sectors/Testimonials/TestimonialsContainer';
import type { Metadata } from 'next';
import { HomeClient } from './HomeClient';


export const metadata: Metadata = {
  title: 'Discover Berat - Tour Operator',
  description:
    'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
  openGraph: {
    type: 'website',
    url: 'https://discoverberat.com/',
    title: 'Discover Berat - Tour Operator',
    description:
      'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
    images: [
      'https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico',
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Berat - Tour Operator',
    description:
      'Discover the charm, embrace the stories, and make memories that last a lifetime. Welcome to Discover Berat - Where Every Journey Tells a Tale.',
    images: [
      'https://images.ctfassets.net/vzi02yirpwbf/5IgNZ5fK06tYapDIIs6bjO/6da1941f117f3cdafd4a0a5374023e23/favicon.ico',
    ],
  },
};

export const revalidate = 43200; // 12 hours

async function getReviews() {
  try {
    const res = await fetch(
      'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJQ1Y_cDuZWhMRu6CZ0pwtbwA&key=AIzaSyDLEwujzNxMGHIrC1i9ZGG_Lm3LkyKrLWE',
      { next: { revalidate: 43200 } },
    );
    const data = await res.json();
    return data.result?.reviews?.map((item: any) => item) || null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [tours, transfers, reviews] = await Promise.all([
    getEntriesByType('tourPage'),
    getEntriesByType('transfers'),
    getReviews(),
  ]);

  if (!tours || !transfers) return null;

  const topTours = tours?.filter((tour: any) =>
    tour.fields?.category?.includes('top'),
  );

  return (
    <main className="main">
      <Hero />
      <OurServices />
      <Tours tours={topTours} pageTitle={'Top Tours'} />
      <HomeClient />
      {reviews && <TestimonialContainer reviews={reviews} />}
    </main>
  );
}
