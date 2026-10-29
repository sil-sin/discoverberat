import { add, setHours, setMinutes, setSeconds } from 'date-fns'

export const getTimes = (selectedDate: Date | null) => {
  if (!selectedDate) return null

  // Reset the time part of the selectedDate to 00:00:00
  const selectedDateWithoutTime = setSeconds(
    setMinutes(setHours(selectedDate, 0), 0),
    0
  )

  const startingTime = add(selectedDateWithoutTime, { hours: 9 })
  const endingTime = add(selectedDateWithoutTime, { hours: 16 })
  const interval = 30 //minutes
  const times: string[] = []

  for (
    let i = startingTime;
    i < endingTime;
    i = add(i, { minutes: interval })
  ) {
    times.push(
      i?.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }) || ''
    )
  }

  return times
}
