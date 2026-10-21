const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const dayLongFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
const dayLongWithYearFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const fullDateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const DAY_MS = 24 * 60 * 60 * 1000

export const isSameDay = (a: number, b: number) =>
  new Date(a).toDateString() === new Date(b).toDateString()

export const formatTime = (timestamp: number) => timeFormat.format(timestamp)

export const formatChatDate = (timestamp: number) => {
  const now = Date.now()

  if (isSameDay(timestamp, now)) {
    return timeFormat.format(timestamp)
  }

  if (new Date(timestamp).getFullYear() === new Date(now).getFullYear()) {
    return dayFormat.format(timestamp)
  }

  return fullDateFormat.format(timestamp)
}

export const formatDayLabel = (timestamp: number) => {
  const now = Date.now()

  if (isSameDay(timestamp, now)) {
    return 'Сегодня'
  }

  if (isSameDay(timestamp, now - DAY_MS)) {
    return 'Вчера'
  }

  if (new Date(timestamp).getFullYear() === new Date(now).getFullYear()) {
    return dayLongFormat.format(timestamp)
  }

  return dayLongWithYearFormat.format(timestamp)
}
