import { add } from 'date-fns'

export const getTimes = (selectedDate?: Date) => {
  console.log(selectedDate)

  if (!selectedDate) return null
  const startingTime = add(selectedDate, { hours: 9 })

  const endingTime = add(selectedDate, { hours: 16 })
  const interval = 30 //minutes
  const times: any[] = []
  for (
    let i = startingTime;
    i < endingTime;
    i = add(i, { minutes: interval })
  ) {
    times.push(
      i?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    )
  }
  console.log(times)

  return times
}
