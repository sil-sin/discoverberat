import { getTimes } from './getTimes'

export const MIN_GUESTS = 2
export const MAX_GUESTS_PER_SLOT = 20
export const TIME_ZONE = 'Europe/Tirane'
export const DATE_KEY_PATTERN = /^\d{2}\/\d{2}\/\d{4}, 00:00:00$/

// A dateKey is the calendar day the booker picked, written as "dd/mm/yyyy, 00:00:00".
export const toDateKey = (date: Date) => {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day.toLocaleString('en-GB')
}

export const parseDateKey = (dateKey: string) => {
  const [day, month, year] = dateKey.slice(0, 10).split('/').map(Number)
  return { day, month, year }
}

export const fromDateKey = (dateKey: string) => {
  const { day, month, year } = parseDateKey(dateKey)
  return new Date(year, month - 1, day)
}

export const tiraneMonth = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: TIME_ZONE }).slice(0, 7)

// Tours start at Berat local time, whatever the booker's time zone.
export const tiraneDateTime = (dateKey: string, time: string) => {
  const { day, month, year } = parseDateKey(dateKey)
  const [hours, minutes] = time.split(':').map(Number)
  const asUtc = Date.UTC(year, month - 1, day, hours, minutes)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
      .formatToParts(asUtc)
      .map(({ type, value }) => [type, Number(value)]),
  )
  const offset = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) - asUtc
  return new Date(asUtc - offset)
}

export const getStartTimes = ({ tourTime, isDayTrip }: { tourTime?: string[]; isDayTrip?: boolean }) =>
  tourTime ?? (isDayTrip ? ['09:00'] : getTimes(new Date())!)
