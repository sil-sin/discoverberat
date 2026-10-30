'use server';

import { cookies } from 'next/headers';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { adminSDK } from '@/lib/firebase/admin';

export async function setSessionToken(token: string | null) {
  const cookieStore = await cookies();
  if (!token) {
    cookieStore.delete('token');
    return;
  }
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
}

export async function deleteAccount() {
  const token = (await cookies()).get('token')?.value;
  if (!token) throw new Error('Not signed in');
  const { uid } = await adminSDK.auth().verifyIdToken(token);
  if (uid === process.env.ADMIN_ID) throw new Error('Admin cannot be deleted');

  const db = getFirestore();
  const [bookings, savedItems, dayLocks] = await Promise.all([
    db.collection('bookings').where('uid', '==', uid).get(),
    db.collection('savedBooking').where('uid', '==', uid).get(),
    db.collection('unavailableDates').where('uid', '==', uid).get(),
  ]);
  // A day back, so tours that started today (or older bookings stored at midnight) still count as upcoming.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (bookings.docs.some((doc) => doc.data().date?.toDate() >= since)) {
    return {
      error:
        'You have upcoming bookings. Contact us to cancel them before you delete your account.',
    };
  }

  // Past bookings stay without personal data, as sales records for tax.
  const batch = db.batch();
  bookings.docs.forEach((doc) =>
    batch.update(doc.ref, {
      booker: FieldValue.delete(),
      email: FieldValue.delete(),
      phone: FieldValue.delete(),
      pickup: FieldValue.delete(),
      uid: FieldValue.delete(),
    }),
  );
  savedItems.docs.forEach((doc) => batch.delete(doc.ref));
  dayLocks.docs.forEach((doc) => batch.update(doc.ref, { uid: FieldValue.delete() }));
  await batch.commit();

  await adminSDK.auth().deleteUser(uid);
  (await cookies()).delete('token');
  return { error: null };
}
