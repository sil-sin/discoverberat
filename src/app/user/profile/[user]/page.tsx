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
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { user: null, error: 'No token' };
    }

    const authenticatedUser = await adminSDK.auth().verifyIdToken(token);
    const user = await adminSDK.auth().getUser(authenticatedUser.uid);

    // Redirect if user is accessing wrong profile
    if (userId !== user.uid) {
      return { redirect: '/user/profile/' + user.uid };
    }

    const db = getFirestore();
    const bookingQuery = db.collectionGroup('bookings');
    const savedItemsQuery = db.collectionGroup('savedBooking');

    let data: FirebaseFirestore.DocumentData[] = [];

    await bookingQuery.get().then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        const bookingData = documentSnapshot.data();
        const timestamp = bookingData.date;
        const date = new Date(timestamp._seconds * 1000);

        if (date < new Date()) {
          return;
        }

        if (authenticatedUser.uid === process.env.ADMIN_ID) {
          data.push(bookingData);
          return;
        }

        if (authenticatedUser.uid === bookingData.uid && bookingData.date) {
          data.push(bookingData);
        }
      });
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

    const savedItems: any[] = [];
    await savedItemsQuery.get().then((querySnapshot) => {
      return querySnapshot.forEach((documentSnapshot) => {
        authenticatedUser.uid === documentSnapshot.data().uid
          ? savedItems.push(documentSnapshot.data())
          : null;
      });
    });

    if (user.uid === process.env.ADMIN_ID) {
      return {
        user: {
          ...authenticatedUser,
          displayName: user.displayName,
          picture: user.photoURL,
          isAdmin: true,
        },
        upcomingBookings: data,
        savedItems: [],
      };
    }

    return {
      user: {
        ...authenticatedUser,
        displayName: user.displayName,
        picture: user.photoURL,
      },
      upcomingBookings: data,
      savedItems: savedItems || [],
    };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { user: userId } = await params;
  const result = await getUserData(userId);

  if ('redirect' in result && result.redirect) {
    redirect(result.redirect);
  }

  if (!result.user) {
    redirect('/authenticate?callback=/user/profile/' + userId);
  }

  return (
    <UserProfileClient
      user={result.user}
      savedItems={result.savedItems || []}
      upcomingBookings={result.upcomingBookings || []}
    />
  );
}
