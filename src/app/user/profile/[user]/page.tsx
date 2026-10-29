import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminSDK } from '@/utils/firebase/adminConfig';
import { getFirestore } from 'firebase-admin/firestore';
import { UserProfileClient } from './UserProfileClient';
import { CANCEL_DEADLINE_MS } from '@/utils/payment/paypalServer';
import type { Metadata } from 'next';
import { DATE_KEY_PATTERN, parseDateKey, tiraneMonth } from '@/helpers/booking';

const DAY_MS = 24 * 60 * 60 * 1000;

export const metadata: Metadata = {
  title: 'Profile - Discover Berat',
  description: 'Your profile and bookings.',
};

export const dynamic = 'force-dynamic';

export type BookingHistory = {
  tourId: string;
  title: string;
  month: string;
  bookings: number;
  guests: number;
  revenue: number;
};

type Props = {
  params: Promise<{ user: string }>;
};

async function setDateBlocked(dateKey: string, isBlocked: boolean) {
  'use server';
  const token = (await cookies()).get('token')?.value;
  const { uid } = await adminSDK.auth().verifyIdToken(token ?? '');
  if (uid !== process.env.ADMIN_ID) throw new Error('Not allowed');
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    throw new Error('Invalid date');
  }
  const ref = getFirestore()
    .collection('blockedDates')
    .doc(encodeURIComponent(dateKey));
  if (!isBlocked) return void (await ref.delete());
  const { day, month, year } = parseDateKey(dateKey);
  await ref.set({ dateKey, day: new Date(Date.UTC(year, month - 1, day)) });
}

async function getUserData(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { user: null, error: 'No token' };
  }

  let authenticatedUser;
  try {
    authenticatedUser = await adminSDK.auth().verifyIdToken(token);
  } catch (error) {
    console.error('Profile token check failed:', error);
    return { user: null, error: 'Authentication failed' };
  }

  // Redirect if user is accessing wrong profile
  if (userId !== authenticatedUser.uid) {
    return { redirect: '/user/profile/' + authenticatedUser.uid };
  }

  const db = getFirestore();
  const isAdmin = authenticatedUser.uid === process.env.ADMIN_ID;
  const bookingQuery = isAdmin
    ? db.collection('bookings')
    : db.collection('bookings').where('uid', '==', authenticatedUser.uid);
  const savedItemsQuery = db
    .collection('savedBooking')
    .where('uid', '==', authenticatedUser.uid);

  const [user, bookingsSnapshot, savedItemsSnapshot, blockedSnapshot] = await Promise.all([
    adminSDK.auth().getUser(authenticatedUser.uid),
    bookingQuery.get(),
    savedItemsQuery.get(),
    isAdmin
      // Blocks are stored at UTC midnight, so a day's window keeps today's block listed.
      ? db.collection('blockedDates').where('day', '>=', new Date(Date.now() - DAY_MS)).get()
      : null,
  ]);

  let data: FirebaseFirestore.DocumentData[] = [];
  const history = new Map<string, BookingHistory>();

  bookingsSnapshot.forEach((documentSnapshot) => {
    const bookingData = documentSnapshot.data();
    if (isAdmin && bookingData.date && !bookingData.cancellationRequested) {
      const month = tiraneMonth(bookingData.date.toDate());
      const key = `${bookingData.bookingId}_${month}`;
      const row = history.get(key) ?? {
        tourId: bookingData.bookingId,
        title: bookingData.title,
        month,
        bookings: 0,
        guests: 0,
        revenue: 0,
      };
      row.bookings += 1;
      row.guests += bookingData.guestNumber;
      row.revenue += bookingData.price * bookingData.guestNumber;
      history.set(key, row);
    }
    const timestamp = bookingData.date;
    if (!timestamp || new Date(timestamp._seconds * 1000) < new Date()) {
      return;
    }
    data.push({ ...bookingData, id: documentSnapshot.id });
  });

  data.sort((a: any, b: any) => {
    return a.date.seconds - b.date.seconds;
  });

  data.forEach((item: any) => {
    const date = new Date(item.date.seconds * 1000);
    item.startsAt = date.toISOString();
    item.canCancel =
      !item.cancellationRequested &&
      date.getTime() - Date.now() >= CANCEL_DEADLINE_MS;
    item.date = date.toLocaleString('en-GB', {
      timeZone: 'Europe/Tirane',
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  const savedItems = savedItemsSnapshot.docs.map((doc) => doc.data());

  return {
    user: {
      ...authenticatedUser,
      displayName: user.displayName,
      picture: user.photoURL,
      isAdmin,
    },
    upcomingBookings: data,
    savedItems: isAdmin ? [] : savedItems,
    history: [...history.values()],
    blockedDates: blockedSnapshot?.docs.map((doc) => doc.data().dateKey as string) ?? [],
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { user: userId } = await params;
  const result = await getUserData(userId);

  if ('redirect' in result && result.redirect) {
    redirect(result.redirect);
  }

  if (!result.user) {
    redirect('/authenticate?callbackUrl=/user/profile/' + userId);
  }

  return (
    <UserProfileClient
      user={result.user}
      savedItems={result.savedItems || []}
      upcomingBookings={result.upcomingBookings || []}
      blockedDates={result.blockedDates || []}
      history={result.history || []}
      setDateBlocked={setDateBlocked}
    />
  );
}
