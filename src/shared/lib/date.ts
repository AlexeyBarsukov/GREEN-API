const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const fullDateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export const formatTime = (timestamp: number) => timeFormat.format(timestamp)

export const formatChatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()

  if (isSameDay(date, now)) {
    return timeFormat.format(date)
  }

  if (date.getFullYear() === now.getFullYear()) {
    return dayFormat.format(date)
  }

  return fullDateFormat.format(date)
}
