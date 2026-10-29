import React, { KeyboardEvent, useState } from 'react'
import classNames from 'classnames'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { toast } from '@/components/simple/Toast'
import styles from './AdminDashboard.module.css'
import AdminHistory from './AdminHistory'

const tabs = ['Overview', 'Bookings', 'History', 'Availability', 'Account'] as const
type Tab = (typeof tabs)[number]

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const toDateKey = (date: Date) => {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day.toLocaleString('en-GB')
}

const fromDateKey = (dateKey: string) => {
  const [day, month, year] = dateKey.slice(0, 10).split('/').map(Number)
  return new Date(year, month - 1, day)
}

const formatDay = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

function PaymentStatus({ booking }: { booking: any }) {
  const [label, tone] = booking.cancellationRequested
    ? ['Refund pending', styles.refund]
    : booking.isPaid
      ? ['Paid', styles.paid]
      : ['Not paid', null]
  return <span className={classNames(styles.status, tone)}>{label}</span>
}

function BookingList({ bookings }: { bookings: any[] }) {
  return (
    <ul className={styles.list}>
      {bookings.map((booking) => (
        <li key={booking.id}>
          <details className={styles.booking}>
            <summary className={styles.row}>
              <time className={styles.rowDate} dateTime={booking.startsAt}>
                {booking.date}
              </time>
              <span className={styles.rowTitle}>{booking.title}</span>
              <span className={styles.rowMeta}>
                {booking.booker} · {plural(booking.guestNumber, 'guest')}
              </span>
              <PaymentStatus booking={booking} />
            </summary>
            <dl className={styles.details}>
              <div>
                <dt>Pickup</dt>
                <dd>{booking.pickup}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${booking.email}`}>{booking.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{booking.phone && <a href={`tel:${booking.phone}`}>{booking.phone}</a>}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>
                  {booking.currency}
                  {booking.price * booking.guestNumber} ({booking.currency}
                  {booking.price} × {booking.guestNumber})
                </dd>
              </div>
            </dl>
          </details>
        </li>
      ))}
    </ul>
  )
}

export default function AdminDashboard({ bookings, user, blockedDates = [], history = [], setDateBlocked }: any) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [blocked, setBlocked] = useState<string[]>(blockedDates)
  const [isSaving, setIsSaving] = useState(false)
  const [now] = useState(Date.now)

  if (!user) {
    return null
  }

  const bookingsOn = (dateKey: string) =>
    bookings.filter((booking: any) => toDateKey(new Date(booking.startsAt)) === dateKey)

  const nextWeek = bookings.filter(
    (booking: any) => new Date(booking.startsAt).getTime() - now < WEEK_MS,
  )
  const stats = [
    { label: 'Upcoming', value: bookings.length },
    {
      label: 'Guests next 7 days',
      value: nextWeek.reduce((sum: number, booking: any) => sum + booking.guestNumber, 0),
    },
    {
      label: 'Not paid',
      value: bookings.filter((booking: any) => !booking.isPaid && !booking.cancellationRequested).length,
    },
    {
      label: 'Refund pending',
      value: bookings.filter((booking: any) => booking.cancellationRequested).length,
      isAlert: true,
    },
  ]

  const thisMonth = new Date(now).toLocaleDateString('en-CA', { timeZone: 'Europe/Tirane' }).slice(0, 7)
  const monthRows = history.filter((row: any) => row.month === thisMonth)
  const monthTotal = (key: string) => monthRows.reduce((sum: number, row: any) => sum + row[key], 0)

  const openTab = (tab: Tab) => {
    setActiveTab(tab)
    document.getElementById(`admin-tab-${tab}`)?.focus()
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    openTab(tabs[(tabs.indexOf(activeTab) + step + tabs.length) % tabs.length])
  }

  const cardLink = (tab: Tab, label: string) => (
    <button type='button' className={styles.cardLink} onClick={() => openTab(tab)}>
      {label} <span aria-hidden>→</span>
    </button>
  )

  const toggleBlocked = async (date: Date) => {
    const dateKey = toDateKey(date)
    const isBlocked = !blocked.includes(dateKey)
    const affected = bookingsOn(dateKey)
    if (
      isBlocked &&
      affected.length > 0 &&
      !(await toast.confirm(
        `${formatDay(date)} has ${plural(affected.length, 'booking')}. Blocking stops new bookings only. Cancel or refund the existing ones yourself.`,
        'Block anyway',
      ))
    ) {
      return
    }
    setIsSaving(true)
    try {
      await setDateBlocked(dateKey, isBlocked)
      setBlocked((dates) =>
        isBlocked ? [...dates, dateKey] : dates.filter((d) => d !== dateKey),
      )
    } catch {
      toast.error('The date could not be saved. Please try again.')
    }
    setIsSaving(false)
  }

  const panelProps = (tab: Tab) => ({
    role: 'tabpanel',
    id: `admin-panel-${tab}`,
    'aria-labelledby': `admin-tab-${tab}`,
    hidden: activeTab !== tab,
  })

  const sortedBlocked = [...blocked].sort((a, b) => fromDateKey(a).getTime() - fromDateKey(b).getTime())

  return (
    <div data-testid='admin-dashboard' className={styles.body}>
      <nav
        role='tablist'
        aria-label='Admin dashboard'
        aria-orientation='vertical'
        className={styles.sidebar}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type='button'
            role='tab'
            id={`admin-tab-${tab}`}
            aria-controls={`admin-panel-${tab}`}
            aria-selected={activeTab === tab}
            tabIndex={activeTab === tab ? 0 : -1}
            className={styles.tab}
            onClick={() => setActiveTab(tab)}
            onKeyDown={handleTabKeyDown}
          >
            {tab}
            {tab === 'Bookings' && <span className={styles.count}>{bookings.length}</span>}
          </button>
        ))}
      </nav>
      <main className={styles.panels}>
        <section {...panelProps('Overview')} className={styles.overview}>
          <article className={classNames(styles.card, styles.cardWide)}>
            <h2 className={styles.cardTitle}>Bookings</h2>
            <dl className={styles.stats}>
              {stats.map(({ label, value, isAlert }) => (
                <div key={label} className={classNames(styles.stat, isAlert && value > 0 && styles.statAlert)}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {bookings.length > 0 ? (
              <ul className={styles.miniList}>
                {bookings.slice(0, 3).map((booking: any) => (
                  <li key={booking.id}>
                    <time dateTime={booking.startsAt}>{booking.date}</time>
                    <span className={styles.rowTitle}>{booking.title}</span>
                    <span className={styles.rowMeta}>{plural(booking.guestNumber, 'guest')}</span>
                    <PaymentStatus booking={booking} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>No upcoming bookings</p>
            )}
            {cardLink('Bookings', 'All bookings')}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>This month</h2>
            <dl className={styles.miniStats}>
              <div>
                <dt>Bookings</dt>
                <dd>{monthTotal('bookings')}</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>{monthTotal('guests')}</dd>
              </div>
              <div>
                <dt>Revenue</dt>
                <dd>€{monthTotal('revenue').toLocaleString('en-GB')}</dd>
              </div>
            </dl>
            {cardLink('History', 'Full history')}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Blocked dates</h2>
            {sortedBlocked.length > 0 ? (
              <ul className={styles.miniList}>
                {sortedBlocked.slice(0, 3).map((dateKey) => {
                  const affected = bookingsOn(dateKey).length
                  return (
                    <li key={dateKey}>
                      <span className={styles.rowTitle}>{formatDay(fromDateKey(dateKey))}</span>
                      {affected > 0 && (
                        <span className={classNames(styles.status, styles.refund)}>
                          {plural(affected, 'booking')} to cancel
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className={styles.muted}>No blocked dates</p>
            )}
            {cardLink('Availability', 'Manage availability')}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Account</h2>
            <p className={styles.accountLine}>
              <strong>{user.displayName}</strong>
              <span>{user.email}</span>
            </p>
            {cardLink('Account', 'Account details')}
          </article>
        </section>

        <section {...panelProps('Bookings')}>
          <h2 className={styles.heading}>All upcoming bookings</h2>
          {bookings.length > 0 ? (
            <BookingList bookings={bookings} />
          ) : (
            <p className={styles.empty}>No upcoming bookings</p>
          )}
        </section>

        <section {...panelProps('History')}>
          <AdminHistory history={history} />
        </section>

        <section {...panelProps('Availability')}>
          <h2 className={styles.heading}>Blocked dates</h2>
          <p className={styles.muted}>
            Select a day to block or unblock it. Blocked days close every tour and service.
          </p>
          <div className={styles.availability}>
            <div className={styles.calendar}>
              <ReactCalendar
                minDate={new Date()}
                tileDisabled={() => isSaving}
                tileClassName={({ date }) => (blocked.includes(toDateKey(date)) ? styles.blockedDay : null)}
                tileContent={({ date, view }) =>
                  view === 'month' && bookingsOn(toDateKey(date)).length > 0 ? (
                    <span className={styles.bookedDot} aria-hidden />
                  ) : null
                }
                onClickDay={toggleBlocked}
              />
              <p className={styles.legend}>
                <span className={styles.legendBlocked} /> Blocked
                <span className={styles.bookedDot} /> Has bookings
              </p>
            </div>
            {sortedBlocked.length > 0 ? (
              <ul className={styles.blockedList}>
                {sortedBlocked.map((dateKey) => {
                  const affected = bookingsOn(dateKey)
                  return (
                    <li key={dateKey} className={classNames(affected.length > 0 && styles.blockedAlert)}>
                      <div className={styles.blockedHeader}>
                        <strong>{formatDay(fromDateKey(dateKey))}</strong>
                        <button
                          type='button'
                          className={styles.action}
                          disabled={isSaving}
                          onClick={() => toggleBlocked(fromDateKey(dateKey))}
                        >
                          Unblock
                        </button>
                      </div>
                      {affected.length > 0 && (
                        <>
                          <p role='note'>
                            {plural(affected.length, 'booking')} on this day. Cancel or refund them.
                          </p>
                          <ul>
                            {affected.map((booking: any) => (
                              <li key={booking.id}>
                                {booking.title}, {booking.booker}, {plural(booking.guestNumber, 'guest')}{' '}
                                <PaymentStatus booking={booking} />
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className={styles.empty}>No blocked dates</p>
            )}
          </div>
        </section>

        <section {...panelProps('Account')} data-testid='admin-dashboard-user-data'>
          <h2 className={styles.heading}>Account</h2>
          <dl className={styles.details}>
            <div>
              <dt>Full name</dt>
              <dd data-testid='admin-dashboard-user-name'>{user.displayName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd data-testid='admin-dashboard-user-email'>{user.email}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  )
}
