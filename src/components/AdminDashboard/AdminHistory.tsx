import React, { useState } from 'react'
import classNames from 'classnames'
import type { BookingHistory } from '@/app/user/profile/[user]/page'
import styles from './AdminHistory.module.css'

const metrics = {
  bookings: { label: 'Bookings', format: (value: number) => String(value) },
  guests: { label: 'Guests', format: (value: number) => String(value) },
  revenue: { label: 'Revenue', format: (value: number) => `€${value.toLocaleString('en-GB')}` },
}
type Metric = keyof typeof metrics

const monthRange = (first: string, last: string) => {
  const months: string[] = []
  const date = new Date(`${first}-01T00:00:00`)
  while (date.toLocaleDateString('en-CA').slice(0, 7) <= last) {
    months.push(date.toLocaleDateString('en-CA').slice(0, 7))
    date.setMonth(date.getMonth() + 1)
  }
  return months
}

const monthLabel = (month: string, withYear = false) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString('en-GB', {
    month: 'short',
    ...(withYear && { year: 'numeric' }),
  })

// Rounds the axis maximum up to an even step × 10ⁿ so the middle gridline lands on a whole value.
const niceMax = (value: number) => {
  const step = 10 ** Math.floor(Math.log10(Math.max(value, 1)))
  return [1, 2, 4, 6, 8, 10].map((n) => n * step).find((n) => n >= value) ?? value
}

const sum = (rows: BookingHistory[], metric: Metric) =>
  rows.reduce((total, row) => total + row[metric], 0)

export default function AdminHistory({ history }: { history: BookingHistory[] }) {
  const [metric, setMetric] = useState<Metric>('bookings')
  const [tourId, setTourId] = useState('all')
  const [currentMonth] = useState(() => new Date().toLocaleDateString('en-CA').slice(0, 7))

  if (history.length === 0) {
    return <p className={styles.empty}>No bookings yet</p>
  }

  const { format, label } = metrics[metric]
  const allMonths = history.map((row) => row.month).sort()
  const months = monthRange(allMonths[0], allMonths[allMonths.length - 1])
  const tours = Object.values(
    history.reduce<Record<string, { id: string; title: string; rows: BookingHistory[] }>>(
      (byTour, row) => {
        byTour[row.tourId] ??= { id: row.tourId, title: row.title, rows: [] }
        byTour[row.tourId].rows.push(row)
        return byTour
      },
      {},
    ),
  ).sort((a, b) => sum(b.rows, metric) - sum(a.rows, metric))

  const selected = tourId === 'all' ? history : history.filter((row) => row.tourId === tourId)
  const perMonth = months.map((month) => ({
    month,
    value: sum(selected.filter((row) => row.month === month), metric),
  }))
  const monthMax = niceMax(Math.max(...perMonth.map((point) => point.value)))
  const tourMax = Math.max(...tours.map((tour) => sum(tour.rows, metric)))
  const labelEvery = Math.ceil(months.length / 12)

  return (
    <div className={styles.history}>
      <h2 className={styles.heading}>History</h2>
      <p className={styles.muted}>Bookings by tour and month. Cancelled bookings are not included.</p>

      <div className={styles.filters}>
        <div role='group' aria-label='Measure' className={styles.segmented}>
          {(Object.keys(metrics) as Metric[]).map((key) => (
            <button
              key={key}
              type='button'
              aria-pressed={metric === key}
              onClick={() => setMetric(key)}
            >
              {metrics[key].label}
            </button>
          ))}
        </div>
        <label className={styles.select}>
          Tour
          <select value={tourId} onChange={(event) => setTourId(event.target.value)}>
            <option value='all'>All tours</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <dl className={styles.stats}>
        {(Object.keys(metrics) as Metric[]).map((key) => (
          <div key={key} className={styles.stat}>
            <dt>{metrics[key].label}</dt>
            <dd>{metrics[key].format(sum(selected, key))}</dd>
          </div>
        ))}
      </dl>

      <figure className={styles.figure}>
        <figcaption className={styles.caption}>{label} per month</figcaption>
        <div className={styles.columnChart}>
          <div className={styles.yAxis} aria-hidden>
            {(monthMax % 2 ? [monthMax, 0] : [monthMax, monthMax / 2, 0]).map((tick) => (
              <span key={tick}>{format(tick)}</span>
            ))}
          </div>
          <div className={styles.plot}>
            {perMonth.map(({ month, value }, index) => (
              <div
                key={month}
                className={classNames(styles.column, month > currentMonth && styles.upcoming)}
                tabIndex={0}
                role='img'
                aria-label={`${monthLabel(month, true)}: ${format(value)}`}
              >
                <span className={styles.tooltip} aria-hidden>
                  {monthLabel(month, true)} · <strong>{format(value)}</strong>{' '}
                  {metric !== 'revenue' && label.toLowerCase()}
                </span>
                <span className={styles.bar} style={{ height: `${(value / monthMax) * 100}%` }} />
                <span className={styles.xLabel} aria-hidden>
                  {index % labelEvery === 0 && monthLabel(month, index === 0 || month.endsWith('-01'))}
                </span>
              </div>
            ))}
          </div>
        </div>
        {months.some((month) => month > currentMonth) && (
          <p className={styles.legend}>
            <span className={styles.legendDone} /> Past and this month
            <span className={styles.legendUpcoming} /> Booked for later months
          </p>
        )}
      </figure>

      {tourId === 'all' && (
        <figure className={styles.figure}>
          <figcaption className={styles.caption}>{label} per tour</figcaption>
          <ul className={styles.barList}>
            {tours.map((tour) => {
              const value = sum(tour.rows, metric)
              return (
                <li key={tour.id}>
                  <button type='button' className={styles.barLabel} onClick={() => setTourId(tour.id)}>
                    {tour.title}
                  </button>
                  <span className={styles.barTrack}>
                    <span className={styles.hBar} style={{ width: `${(value / tourMax) * 100}%` }} />
                    <span className={styles.barValue}>{format(value)}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </figure>
      )}

      <figure className={styles.figure}>
        <figcaption className={styles.caption}>{label} per tour and month</figcaption>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope='col'>Tour</th>
                {months.map((month) => (
                  <th key={month} scope='col'>
                    {monthLabel(month, true)}
                  </th>
                ))}
                <th scope='col'>Total</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <th scope='row'>{tour.title}</th>
                  {months.map((month) => {
                    const value = sum(tour.rows.filter((row) => row.month === month), metric)
                    return <td key={month}>{value ? format(value) : '–'}</td>
                  })}
                  <td>{format(sum(tour.rows, metric))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope='row'>All tours</th>
                {months.map((month) => (
                  <td key={month}>{format(sum(history.filter((row) => row.month === month), metric))}</td>
                ))}
                <td>{format(sum(history, metric))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </figure>
    </div>
  )
}
