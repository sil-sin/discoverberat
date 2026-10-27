import React, { CSSProperties, useState } from 'react'
import styles from './Dashboard.module.css'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import Button from '../simple/Button/index'
import PaypalCheckoutButton from '@/utils/payment/paypal'
import { cancelBooking } from '@/utils/payment/actions'
import { useAuthContext } from '@/utils/auth/auth-provider'
import { toast } from '@/components/simple/Toast'
import { FiCalendar } from 'react-icons/fi'

function PaymentStatus({ booking }: { booking: any }) {
  return (
    <span className={classNames(styles.status, booking.isPaid && styles.paid)}>
      {booking.cancellationRequested
        ? 'Refund pending'
        : booking.isPaid
          ? 'Paid'
          : 'Pay on location'}
    </span>
  )
}

// ponytail: bookings store no tour length, so every event gets 3 hours; add a duration field in Contentful to make it exact.
const TOUR_LENGTH_MS = 3 * 60 * 60 * 1000

const icsTime = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, '')
const icsText = (text: string) => text.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

function AddToCalendar({ booking }: { booking: any }) {
  const menuId = `calendar-${booking.id}`
  const anchor = `--${menuId}`
  const startDate = new Date(booking.startsAt)
  const start = icsTime(startDate)
  const end = icsTime(new Date(startDate.getTime() + TOUR_LENGTH_MS))
  const google = new URLSearchParams({
    action: 'TEMPLATE',
    text: booking.title,
    dates: `${start}/${end}`,
    location: booking.pickup,
  })
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Discover Berat//Bookings//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@discoverberat`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${icsText(booking.title)}`,
    `LOCATION:${icsText(booking.pickup)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return (
    <>
      <button
        type='button'
        popoverTarget={menuId}
        className={styles.action}
        style={{ anchorName: anchor } as CSSProperties}
      >
        <FiCalendar aria-hidden />
        Add to calendar
      </button>
      <div
        id={menuId}
        popover='auto'
        className={styles.menu}
        style={{ positionAnchor: anchor } as CSSProperties}
        onClick={(event) => event.currentTarget.hidePopover()}
      >
        <a
          href={`https://calendar.google.com/calendar/render?${google}`}
          target='_blank'
          rel='noreferrer noopener'
        >
          Google Calendar
        </a>
        <a
          href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
          download={`${booking.title}.ics`}
        >
          Apple or Outlook
        </a>
      </div>
    </>
  )
}

const guests = (count: number) => `${count} guest${count === 1 ? '' : 's'}`

export default function Dashboard({ bookings, savedItems, user }: any) {
  const router = useRouter()
  const { user: firebaseUser } = useAuthContext()
  const [payingId, setPayingId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  if (!user) {
    return null
  }

  const [nextBooking, ...laterBookings] = bookings ?? []

  const handleCancel = async (booking: any) => {
    const message = booking.isPaid
      ? `Cancel ${booking.title}? We refund your payment minus the PayPal fee.`
      : `Cancel ${booking.title}?`
    if (!firebaseUser || !(await toast.confirm(message, 'Cancel booking'))) return
    setCancellingId(booking.id)
    const { error } = await firebaseUser
      .getIdToken()
      .then((idToken) => cancelBooking(idToken, booking.id))
      .catch(() => ({
        error: 'Your booking could not be cancelled. Please try again.',
      }))
    if (error) {
      setCancellingId(null)
      return toast.error(error)
    }
    toast.success(
      booking.isPaid
        ? 'Cancellation requested. We will refund your payment soon.'
        : 'Booking cancelled.',
    )
    router.refresh()
  }

  const actions = (booking: any) =>
    payingId === booking.id ? (
      <div className={styles.payment}>
        <PaypalCheckoutButton
          bookingId={booking.id}
          onPaid={() => {
            setPayingId(null)
            router.refresh()
          }}
        />
        <button
          type='button'
          className={styles.action}
          onClick={() => setPayingId(null)}
        >
          Cancel
        </button>
      </div>
    ) : (
      <div className={styles.actions}>
        {!booking.isPaid && (
          <button
            type='button'
            className={classNames(styles.action, styles.pay)}
            onClick={() => setPayingId(booking.id)}
          >
            Pay now
          </button>
        )}
        <AddToCalendar booking={booking} />
        {booking.canCancel && (
          <button
            type='button'
            className={styles.action}
            disabled={cancellingId === booking.id}
            aria-busy={cancellingId === booking.id}
            onClick={() => handleCancel(booking)}
          >
            {cancellingId === booking.id ? 'Cancelling…' : 'Cancel booking'}
          </button>
        )}
      </div>
    )

  return (
    <div data-testid='dashboard' className={styles.dashboard}>
      <section data-testid='upcoming-booking'>
        <h2 className={styles.heading}>Your next tour</h2>
        {nextBooking ? (
          <article className={styles.ticket}>
            <div className={styles.ticketMain}>
              <h3 className={styles.ticketTitle}>{nextBooking.title}</h3>
              <dl className={styles.details}>
                <div>
                  <dt>Pickup</dt>
                  <dd>{nextBooking.pickup}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{guests(nextBooking.guestNumber)}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>
                    {nextBooking.currency}
                    {nextBooking.price * nextBooking.guestNumber}
                  </dd>
                </div>
              </dl>
              {actions(nextBooking)}
            </div>
            <div className={styles.ticketStub}>
              <time className={styles.ticketDate} dateTime={nextBooking.startsAt}>
                {nextBooking.date}
              </time>
              <PaymentStatus booking={nextBooking} />
            </div>
          </article>
        ) : (
          <div className={styles.empty}>
            <p>You have no upcoming tours.</p>
            <Button variant='link' href='/tours'>
              Browse tours
            </Button>
          </div>
        )}
      </section>

      {laterBookings.length > 0 && (
        <section>
          <h2 className={styles.heading}>Later bookings</h2>
          <ul className={styles.list}>
            {laterBookings.map((booking: any) => (
              <li key={booking.id}>
                <details className={styles.booking}>
                  <summary className={styles.row}>
                    <time className={styles.rowDate} dateTime={booking.startsAt}>
                      {booking.date}
                    </time>
                    <span className={styles.rowTitle}>{booking.title}</span>
                    <PaymentStatus booking={booking} />
                  </summary>
                  <dl className={styles.details}>
                    <div>
                      <dt>Pickup</dt>
                      <dd>{booking.pickup}</dd>
                    </div>
                    <div>
                      <dt>Booked by</dt>
                      <dd>{booking.booker}</dd>
                    </div>
                    <div>
                      <dt>Guests</dt>
                      <dd>{guests(booking.guestNumber)}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd>
                        {booking.currency}
                        {booking.price * booking.guestNumber}
                      </dd>
                    </div>
                  </dl>
                  {actions(booking)}
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className={styles.heading}>Saved for later</h2>
        {savedItems?.length > 0 ? (
          <ul className={styles.list}>
            {savedItems.map((savedItem: any) => (
              <li key={savedItem.id} className={styles.row}>
                <span className={styles.rowTitle}>{savedItem.title}</span>
                <span className={styles.rowDate}>
                  {savedItem.currency}
                  {savedItem.price} per person
                </span>
                <Button variant='link' href={`/tours/${savedItem.url}`}>
                  View tour
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>
            Tours you save for later show up here.
          </p>
        )}
      </section>
    </div>
  )
}
