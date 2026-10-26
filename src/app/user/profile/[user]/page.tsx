import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminSDK } from '@/utils/firebase/adminConfig';
import { getFirestore } from 'firebase-admin/firestore';
import { UserProfileClient } from './UserProfileClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Discover Berat',
  description: 'Your profile and bookings.',
};

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ user: string }>;
};

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
  const bookingQuery =
    authenticatedUser.uid === process.env.ADMIN_ID
      ? db.collection('bookings').where('date', '>=', new Date())
      : db.collection('bookings').where('uid', '==', authenticatedUser.uid);
  const savedItemsQuery = db
    .collection('savedBooking')
    .where('uid', '==', authenticatedUser.uid);

  const [user, bookingsSnapshot, savedItemsSnapshot] = await Promise.all([
    adminSDK.auth().getUser(authenticatedUser.uid),
    bookingQuery.get(),
    savedItemsQuery.get(),
  ]);

  let data: FirebaseFirestore.DocumentData[] = [];

  bookingsSnapshot.forEach((documentSnapshot) => {
    const bookingData = documentSnapshot.data();
    const timestamp = bookingData.date;
    if (!timestamp || new Date(timestamp._seconds * 1000) < new Date()) {
      return;
    }
    data.push(bookingData);
  });

  data.sort((a: any, b: any) => {
    return a.date.seconds - b.date.seconds;
  });

  data.forEach((item: any) => {
    const date = new Date(item.date.seconds * 1000);
    item.date = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  });

  const savedItems = savedItemsSnapshot.docs.map((doc) => doc.data());

  const isAdmin = user.uid === process.env.ADMIN_ID;
  return {
    user: {
      ...authenticatedUser,
      displayName: user.displayName,
      picture: user.photoURL,
      isAdmin,
    },
    upcomingBookings: data,
    savedItems: isAdmin ? [] : savedItems,
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
    />
  );
}
