'use client';

import Image from 'next/image';
import styles from './user.module.css';
import Dashboard from '@/components/Dashboard/Dashboard';
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard';

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
      </div>
    </div>
  );
}
