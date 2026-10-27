'use client';

import Image from 'next/image';
import styles from './user.module.css';
import Dashboard from '@/components/Dashboard/Dashboard';
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard';
import Button from '@/components/simple/Button';
import { deleteAccount } from '@/utils/auth/session';
import { signOutUser } from '@/utils/auth/signOut';

type Props = {
  user: any;
  savedItems: any[];
  upcomingBookings: any[];
};

export function UserProfileClient({
  user,
  savedItems,
  upcomingBookings,
}: Props) {
  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Delete your account? Your saved tours and personal details are removed. This cannot be undone.',
      )
    ) {
      return;
    }
    const { error } = await deleteAccount().catch(() => ({
      error: 'Your account could not be deleted. Please try again.',
    }));
    if (error) return alert(error);
    signOutUser();
  };

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <header className={styles.userInfo}>
          <Image
            src={user.picture || '/avatar.svg'}
            alt=""
            width={64}
            height={64}
          />
          <div>
            <h1 className={styles.title}>
              {`Hi, ${user.displayName?.split(' ')[0] || (user.isAdmin ? 'Admin' : 'there')}`}
            </h1>
            <p className={styles.email}>{user.email}</p>
          </div>
        </header>
        {user.isAdmin ? (
          <AdminDashboard bookings={upcomingBookings} user={user} />
        ) : (
          <Dashboard
            bookings={upcomingBookings}
            savedItems={savedItems}
            user={user}
          />
        )}
        {!user.isAdmin && (
          <section className={styles.deleteAccount}>
            <Button variant="tertiary" onClick={handleDeleteAccount}>
              Delete my account
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}
