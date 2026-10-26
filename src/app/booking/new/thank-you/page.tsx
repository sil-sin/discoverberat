import { Suspense } from 'react';
import Loader from '@/components/simple/Loader';
import { ThankYouClient } from './ThankYouClient';
import type { Metadata } from 'next';
import { adminSDK } from '@/utils/firebase/adminConfig';

export const metadata: Metadata = {
  title: 'Thank You - Discover Berat',
  description: 'Thank you for your booking with Discover Berat.',
};

async function getBooking(idToken: string, id: string) {
  'use server';
  const { uid } = await adminSDK.auth().verifyIdToken(idToken);
  const snapshot = await adminSDK
    .firestore()
    .collection('bookings')
    .doc(String(id))
    .get();
  const booking = snapshot.data();
  if (!booking || (booking.uid !== uid && uid !== process.env.ADMIN_ID)) {
    return null;
  }
  return { ...booking, date: booking.date.toDate() as Date };
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ThankYouClient getBooking={getBooking} />
    </Suspense>
  );
}
