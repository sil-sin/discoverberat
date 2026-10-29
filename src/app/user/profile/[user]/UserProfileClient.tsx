'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/components/simple/Toast';
import styles from './user.module.css';
import Dashboard from '@/components/Dashboard/Dashboard';
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard';
import Button from '@/components/simple/Button';
import { deleteAccount } from '@/utils/auth/session';
import { signOutUser } from '@/utils/auth/signOut';
import type { BookingHistory } from './page';

type Props = {
  user: any;
  savedItems: any[];
  upcomingBookings: any[];
  blockedDates: string[];
  history: BookingHistory[];
  setDateBlocked: (dateKey: string, isBlocked: boolean) => Promise<void>;
};

export function UserProfileClient({
  user,
  savedItems,
  upcomingBookings,
  blockedDates,
  history,
  setDateBlocked,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return null;
  }

  const handleDeleteAccount = async () => {
    const isConfirmed = await toast.confirm(
      'Delete your account? Your saved tours and personal details are removed. This cannot be undone.',
      'Delete account',
    );
    if (!isConfirmed) return;
    setIsDeleting(true);
    const { error } = await deleteAccount().catch(() => ({
      error: 'Your account could not be deleted. Please try again.',
    }));
    if (error) {
      setIsDeleting(false);
      return toast.error(error);
    }
    toast.success('Your account is deleted.');
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
          <AdminDashboard
            bookings={upcomingBookings}
            user={user}
            blockedDates={blockedDates}
            history={history}
            setDateBlocked={setDateBlocked}
          />
        ) : (
          <Dashboard
            bookings={upcomingBookings}
            savedItems={savedItems}
            user={user}
          />
        )}
        {!user.isAdmin && (
          <section
            className={styles.dangerZone}
            aria-labelledby="danger-zone-title"
          >
            <div>
              <h2 id="danger-zone-title">Danger zone</h2>
              <p>
                Deleting your account removes your saved tours and your personal
                details from past bookings. You cannot undo this.
              </p>
            </div>
            <Button
              variant="tertiary"
              className={styles.deleteButton}
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Delete account
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}
