'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import styles from './thank-you.module.css';
import { useAuthContext } from '@/utils/auth/auth-provider';
import PaypalCheckoutButton from '@/utils/payment/paypal';
import { WHATSAPP_URL } from '@/components/sectors/Navigation/utils';

type Props = {
  getBooking: (idToken: string, id: string) => Promise<Record<string, any> | null>;
};

export function ThankYouClient({ getBooking }: Props) {
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

  const profileHref = user ? '/user/profile/' + user.uid : '/authenticate';

  if (isMissing || !id) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>We could not find this booking</h1>
          <p className={styles.lead}>Your bookings are listed on your profile.</p>
          <Link className={styles.primaryLink} href={profileHref}>
            See my bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.page}>
        <div className={styles.card} aria-busy="true" aria-label="Loading your booking">
          <span className="skeleton" style={{ width: '60%', height: '2rem' }} />
          <span className="skeleton" />
          <span className="skeleton" style={{ width: '85%' }} />
          <span className="skeleton" style={{ height: '8rem' }} />
        </div>
      </div>
    );
  }

  return (
    <BookingConfirmation
      id={id}
      booking={booking}
      profileHref={profileHref}
      onPaid={() => setBooking({ ...booking, isPaid: true })}
    />
  );
}

type ConfirmationProps = {
  id: string;
  booking: Record<string, any>;
  profileHref: string;
  onPaid: () => void;
};

export function BookingConfirmation({
  id,
  booking,
  profileHref,
  onPaid,
}: ConfirmationProps) {
  const date = new Date(booking.date);
  const currency = booking.currency ?? '€';
  const total = `${currency}${booking.price * booking.guestNumber}`;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <FiCheckCircle aria-hidden className={styles.heroIcon} />
        <h1 className={styles.title}>Your booking is confirmed</h1>
        <p className={styles.lead}>
          We sent the details to <strong>{booking.email}</strong>.
        </p>
      </header>

      <div className={styles.layout}>
        <section className={styles.card} aria-labelledby="details-title">
          <h2 id="details-title" className={styles.cardTitle}>
            {booking.title}
          </h2>
          <dl className={styles.details}>
            <div>
              <dt>Date</dt>
              <dd>
                {date.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt>Start time</dt>
              <dd>
                {date.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{booking.guestNumber}</dd>
            </div>
            {booking.pickup && (
              <div>
                <dt>Pickup</dt>
                <dd>{booking.pickup}</dd>
              </div>
            )}
            <div>
              <dt>Total</dt>
              <dd>
                {total}{' '}
                <span className={styles.muted}>
                  ({currency}
                  {booking.price} per person)
                </span>
              </dd>
            </div>
            <div>
              <dt>Booking ID</dt>
              <dd className={styles.bookingId}>{id}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.card} aria-labelledby="payment-title">
          <div className={styles.paymentHeader}>
            <h2 id="payment-title" className={styles.cardTitle}>
              Payment
            </h2>
            <span
              className={booking.isPaid ? styles.badgePaid : styles.badgeDue}
            >
              {booking.isPaid ? 'Paid' : 'Not paid yet'}
            </span>
          </div>
          {booking.isPaid ? (
            <p className={styles.muted}>
              We received your payment of {total}. The receipt is in your inbox.
            </p>
          ) : (
            <>
              <p className={styles.muted}>
                Pay {total} now with PayPal, or pay on the day of the tour. Both
                are fine.
              </p>
              <PaypalCheckoutButton bookingId={id} onPaid={onPaid} />
            </>
          )}
        </section>
      </div>

      <section className={styles.next} aria-labelledby="next-title">
        <h2 id="next-title" className={styles.cardTitle}>
          Good to know
        </h2>
        <ul className={styles.facts}>
          <li>
            <FiCheck aria-hidden />
            <span>
              Free cancellation up to 24 hours before the tour, from{' '}
              <Link href={profileHref}>your bookings</Link>.
            </span>
          </li>
          <li>
            <FiCheck aria-hidden />
            <span>
              Questions? Message us on{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">
                <FaWhatsapp aria-hidden /> WhatsApp
              </a>{' '}
              or reply to the confirmation email.
            </span>
          </li>
        </ul>
        <div className={styles.actions}>
          <Link className={styles.primaryLink} href={profileHref}>
            See my bookings
          </Link>
          <Link className={styles.secondaryLink} href="/tours">
            Browse more tours
          </Link>
        </div>
      </section>
    </div>
  );
}
