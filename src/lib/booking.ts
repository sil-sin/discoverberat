import { getTimes } from './get-times'

export const MIN_GUESTS = 2
export const MAX_TEXT_LENGTH = 100
export const MAX_GUESTS_PER_SLOT = 20
const TIME_ZONE = 'Europe/Tirane'
const DATE_KEY_PATTERN = /^\d{2}\/\d{2}\/\d{4}, 00:00:00$/

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

// The pattern alone lets "32/01/2027" through, which rolls over to 1 Feb under its own blocked-date and slot keys.
export const isValidDateKey = (dateKey: string) => {
  if (!DATE_KEY_PATTERN.test(dateKey)) return false
  const { day, month, year } = parseDateKey(dateKey)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCDate() === day && date.getUTCMonth() === month - 1
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
