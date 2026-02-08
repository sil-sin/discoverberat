import { getEntriesByType } from '@/utils/contentful/contentful';
import { getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore';
import { adminSDK, initializeAdmin } from '@/utils/firebase/adminConfig';

import type { Metadata } from 'next';
import { BookingClient } from './BookingClient';

export const metadata: Metadata = {
  title: 'New Booking - Discover Berat',
  description: 'Book your tour or service with Discover Berat.',
};

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ tour?: string; service?: string }>;
};

async function getBookingData(tourSlug?: string, serviceSlug?: string) {
  const tourData: any = tourSlug
    ? (await getEntriesByType('tourPage')).find(
        (tour: any) => tour.fields.url === tourSlug,
      )
    : null;

  const serviceData: any = serviceSlug
    ? (await getEntriesByType('serviceCard')).find(
        (service: any) => service.fields.url === serviceSlug,
      )
    : null;

  if (!adminSDK) {
    initializeAdmin();
  }

  const db = getFirestoreAdmin();
  const unavailableDatesCollection = db.collectionGroup('unavailableDates');
  const unavailableDates = await unavailableDatesCollection.get();

  const dateCountMap = new Map();
  unavailableDates.docs.forEach((doc) => {
    const date = doc.data().date;
    if (dateCountMap.has(date)) {
      dateCountMap.set(date, dateCountMap.get(date) + 1);
    } else {
      dateCountMap.set(date, 1);
    }
  });

  const datesWithMoreThanTwoOccurrences = Array.from(dateCountMap.entries())
    .filter(([, count]) => count > 2)
    .map(([date]) => date);

  if (serviceData) {
    return {
      booking: {
        ...serviceData.fields,
        id: serviceData.sys.id,
        type: 'service',
      },
      unavailableDates: datesWithMoreThanTwoOccurrences,
    };
  }

  if (tourData) {
    return {
      booking: { ...tourData.fields, id: tourData.sys.id, type: 'tour' },
      unavailableDates: datesWithMoreThanTwoOccurrences,
    };
  }

  return { booking: null, unavailableDates: [] };
}

export default async function BookingNewPage({ searchParams }: Props) {
  const { tour, service } = await searchParams;
  const { booking, unavailableDates } = await getBookingData(tour, service);

  if (!booking) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Booking not found</h1>
        <p>Please select a tour or service to book.</p>
      </div>
    );
  }

  return (
    <BookingClient booking={booking} unavailableDates={unavailableDates} />
  );
}
