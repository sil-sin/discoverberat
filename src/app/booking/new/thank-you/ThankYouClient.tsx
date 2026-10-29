'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './thank-you.module.css';
import Button from '@/components/simple/Button';
import Loader from '@/components/simple/Loader';
import { useAuthContext } from '@/utils/auth/auth-provider';
import PaypalCheckoutButton from '@/utils/payment/paypal';

type Props = {
  getBooking: (idToken: string, id: string) => Promise<Record<string, any> | null>;
};

export function ThankYouClient({ getBooking }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [booking, setBooking] = useState<Record<string, any> | null>(null);
  const [isMissing, setIsMissing] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !id) return;
    user
      .getIdToken()
      .then((idToken) => getBooking(idToken, id))
      .then((result) => (result ? setBooking(result) : setIsMissing(true)))
      .catch((error) => {
        console.error('Error fetching booking:', error);
        setIsMissing(true);
      });
  }, [getBooking, user, id]);

  if (isMissing || !id) {
    return (
      <div className={styles.container}>
        <div className={styles.detailsContainer}>
          <h3 className={styles.title}>We could not find this booking</h3>
          <p>Your bookings are listed on your profile.</p>
          <Button
            variant="primary"
            onClick={() =>
              router.push(user ? '/user/profile/' + user.uid : '/authenticate')
            }
            text="See all bookings"
          />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.container}>
        <div
          className={styles.detailsContainer}
          aria-busy="true"
          aria-label="Loading your booking"
        >
          <span className="skeleton" style={{ width: '60%', height: '1.5rem', margin: '0 auto' }} />
          <span className="skeleton" />
          <span className="skeleton" style={{ width: '85%' }} />
          <span className="skeleton" style={{ width: '40%' }} />
          <span className="skeleton" style={{ height: '3rem' }} />
        </div>
      </div>
    );
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
          <h3 className={styles.title}>Your booking is confirmed</h3>
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
          {booking.isPaid ? (
            <p>
              <strong>Paid</strong>
            </p>
          ) : (
            <section aria-labelledby="payment-title">
              <h4 id="payment-title">Payment (optional)</h4>
              <p>Pay now with PayPal, or pay on the day of the tour.</p>
              <PaypalCheckoutButton
                bookingId={id}
                onPaid={() => setBooking({ ...booking, isPaid: true })}
              />
            </section>
          )}
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
