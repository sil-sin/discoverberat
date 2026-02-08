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

  if (user.isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div className={styles.userInfo}>
            <Image
              src={user.picture || '/avatar.svg'}
              alt={user.displayName ?? 'Profile Picture'}
              width={50}
              height={50}
            />
            <h2
              className={styles.title}
            >{`Welcome, ${user?.displayName || 'Admin'}`}</h2>
          </div>
          <AdminDashboard bookings={upcomingBookings} user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          <Image
            src={user.picture || '/avatar.svg'}
            alt={user.displayName ?? 'Profile Picture'}
            width={50}
            height={50}
          />
          <h2 className={styles.title}>
            {`Welcome, ${user?.displayName || 'User'}`}
          </h2>
        </div>
        <Dashboard
          bookings={upcomingBookings}
          savedItems={savedItems}
          user={user}
        />
      </div>
    </div>
  );
}
