'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './thank-you.module.css';
import Button from '@/components/simple/Button';
import { useAuthContext } from '@/utils/auth/auth-provider';

type Props = {
  getBooking: (idToken: string, id: string) => Promise<Record<string, any> | null>;
};

export function ThankYouClient({ getBooking }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [booking, setBooking] = useState<Record<string, any> | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !id) return;
    user
      .getIdToken()
      .then((idToken) => getBooking(idToken, id))
      .then(setBooking)
      .catch((error) => console.error('Error fetching booking:', error));
  }, [getBooking, user, id]);

  if (!booking) {
    return <p>Loading...</p>;
  }

  const formattedDate = new Date(booking.date).toLocaleString(
    'en-GB',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  );
  const formatedBookingTitle = booking.title.includes(booking.type)
    ? booking.title
        .split(' ')
        .filter((char: string) => char !== booking.type)
        .join(' ')
    : booking.title;

  return (
    <div className={styles.container}>
      {booking && (
        <div className={styles.detailsContainer}>
          <h3 className={styles.title}>Thank you for your booking! </h3>
          <section>
            You have booked{' '}
            <strong>
              {formatedBookingTitle} {booking.type}
            </strong>
            , for a total price of{' '}
            <strong>
              {booking.currency}
              {booking.price * booking.guestNumber}
            </strong>{' '}
            for {booking.guestNumber} guest
            {booking.guestNumber === 1 ? '' : 's'} (
            {booking.currency + booking.price} per person).
            <div>
              Starting on <strong>{formattedDate}</strong>.<p>See you soon!</p>
            </div>
          </section>
          <Button
            variant="primary"
            onClick={() =>
              router.push(booking.type === 'tour' ? '/tours' : '/')
            }
            text="Book another"
          />
          <Button
            variant="secondary"
            onClick={() => router.push('/user/profile/' + user?.uid)}
            text="See all bookings"
          />
        </div>
      )}
    </div>
  );
}
