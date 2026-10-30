import React, { useState } from 'react'
import classNames from 'classnames'
import type { BookingHistory } from '@/app/user/profile/[user]/page'
import styles from './AdminHistory.module.css'
import { tiraneMonth } from '@/helpers/booking'

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

// Four equal steps of 1, 2 or 5 × 10ⁿ, with the top tick at or above the maximum.
const axisTicks = (max: number) => {
  const raw = Math.max(max, 1) / 4
  const power = 10 ** Math.floor(Math.log10(raw))
  const step = Math.max(1, [1, 2, 5, 10].map((n) => n * power).find((n) => n >= raw)!)
  return [4, 3, 2, 1, 0].map((n) => n * step)
}

const sum = (rows: BookingHistory[], metric: Metric) =>
  rows.reduce((total, row) => total + row[metric], 0)

export default function AdminHistory({ history }: { history: BookingHistory[] }) {
  const [metric, setMetric] = useState<Metric>('bookings')
  const [tourId, setTourId] = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)
  const [currentMonth] = useState(() => tiraneMonth(new Date()))

  if (history.length === 0) {
    return <p className={styles.empty}>No bookings yet</p>
  }

  const { format, label } = metrics[metric]
  const allMonths = history.map((row) => row.month).sort()
  const months = monthRange(allMonths[0], allMonths[allMonths.length - 1])
  const titles = Object.fromEntries(history.map((row) => [row.tourId, row.title]))
  const tourIds = Object.keys(titles)

  const inMonth = month ? history.filter((row) => row.month === month) : history
  const selected = tourId ? inMonth.filter((row) => row.tourId === tourId) : inMonth
  const ranking = tourIds
    .map((id) => ({ id, value: sum(inMonth.filter((row) => row.tourId === id), metric) }))
    .filter((tour) => tour.value > 0)
    .sort((a, b) => b.value - a.value)
  const rankMax = ranking[0]?.value ?? 1

  const perMonth = months.map((m) => ({
    month: m,
    value: sum(history.filter((row) => row.month === m && (!tourId || row.tourId === tourId)), metric),
  }))
  const ticks = axisTicks(Math.max(...perMonth.map((point) => point.value)))
  const labelEvery = Math.ceil(months.length / 6)
  const scope = [tourId && titles[tourId], month ? monthLabel(month, true) : 'All time']
    .filter(Boolean)
    .join(' · ')

  return (
    <div className={styles.history}>
      <h2 className={styles.heading}>History</h2>

      <div className={styles.controls}>
        <div role='group' aria-label='Measure' className={styles.segmented}>
          {(Object.keys(metrics) as Metric[]).map((key) => (
            <button key={key} type='button' aria-pressed={metric === key} onClick={() => setMetric(key)}>
              {metrics[key].label}
            </button>
          ))}
        </div>
      </div>

      <section aria-labelledby='history-totals' className={styles.panel}>
        <div className={styles.scopeRow}>
          <h3 id='history-totals' className={styles.scope}>
            {scope}
          </h3>
          {(month || tourId) && (
            <button
              type='button'
              className={styles.textButton}
              onClick={() => {
                setMonth(null)
                setTourId(null)
              }}
            >
              Show everything
            </button>
          )}
        </div>
        <dl className={styles.totals}>
          {(Object.keys(metrics) as Metric[]).map((key) => (
            <div key={key}>
              <dt>{metrics[key].label}</dt>
              <dd>{metrics[key].format(sum(selected, key))}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby='history-months' className={styles.panel}>
        <h3 id='history-months' className={styles.panelTitle}>
          {label} per month
          <span className={styles.hint}>Select a month to see its tours</span>
        </h3>
        <div className={styles.chart}>
          <div className={styles.yAxis} aria-hidden>
            {ticks.map((tick) => (
              <span key={tick}>{format(tick)}</span>
            ))}
          </div>
          <div className={styles.plot}>
            {perMonth.map(({ month: m, value }, index) => (
              <button
                key={m}
                type='button'
                aria-pressed={month === m}
                aria-label={`${monthLabel(m, true)}: ${format(value)} ${metric === 'revenue' ? '' : label.toLowerCase()}`.trim()}
                className={classNames(
                  styles.column,
                  m > currentMonth && styles.upcoming,
                  month && month !== m && styles.dimmed,
                )}
                onClick={() => setMonth(month === m ? null : m)}
              >
                <span className={styles.tooltip} aria-hidden>
                  {monthLabel(m, true)} · <strong>{format(value)}</strong>
                </span>
                <span className={styles.bar} style={{ height: `${(value / ticks[0]) * 100}%` }} />
                <span className={styles.xLabel} aria-hidden>
                  {index % labelEvery === 0 && monthLabel(m, index === 0 || m.endsWith('-01'))}
                </span>
              </button>
            ))}
          </div>
        </div>
        {months.some((m) => m > currentMonth) && (
          <p className={styles.legend}>
            <span className={styles.legendUpcoming} aria-hidden /> Booked for coming months
          </p>
        )}
      </section>

      <section aria-labelledby='history-tours' className={styles.panel}>
        <h3 id='history-tours' className={styles.panelTitle}>
          {label} per tour
          <span className={styles.hint}>Select a tour to see its months</span>
        </h3>
        {ranking.length > 0 ? (
          <ul className={styles.ranking}>
            {ranking.map(({ id, value }) => (
              <li key={id}>
                <button
                  type='button'
                  aria-pressed={tourId === id}
                  className={styles.rankRow}
                  onClick={() => setTourId(tourId === id ? null : id)}
                >
                  <span className={styles.rankFill} style={{ width: `${(value / rankMax) * 100}%` }} />
                  <span className={styles.rankName}>{titles[id]}</span>
                  <span className={styles.rankValue}>{format(value)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>No bookings in {monthLabel(month!, true)}</p>
        )}
      </section>

      <details className={styles.tableDetails}>
        <summary>Show as table</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <caption>{label} per tour and month</caption>
            <thead>
              <tr>
                <th scope='col'>Tour</th>
                {months.map((m) => (
                  <th key={m} scope='col'>
                    {monthLabel(m, true)}
                  </th>
                ))}
                <th scope='col'>Total</th>
              </tr>
            </thead>
            <tbody>
              {tourIds.map((id) => {
                const rows = history.filter((row) => row.tourId === id)
                return (
                  <tr key={id}>
                    <th scope='row' title={titles[id]}>
                      {titles[id]}
                    </th>
                    {months.map((m) => {
                      const value = sum(rows.filter((row) => row.month === m), metric)
                      return <td key={m}>{value ? format(value) : '–'}</td>
                    })}
                    <td>{format(sum(rows, metric))}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope='row'>All tours</th>
                {months.map((m) => (
                  <td key={m}>{format(sum(history.filter((row) => row.month === m), metric))}</td>
                ))}
                <td>{format(sum(history, metric))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>
      <p className={styles.note}>Cancelled bookings are not included.</p>
    </div>
  )
}
