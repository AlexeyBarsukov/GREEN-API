import { formatPhone } from '../../shared/lib/phone'
import type { Chat } from './chatsSlice'

export const getChatTitle = (chat: Chat) => {
  if (chat.name) {
    return chat.name
  }

  return chat.phone ? formatPhone(chat.phone) : `Чат ${chat.id}`
}
