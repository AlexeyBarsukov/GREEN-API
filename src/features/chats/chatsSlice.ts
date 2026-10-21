import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type MessageDirection = 'incoming' | 'outgoing'

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface Message {
  id: string
  chatId: string
  text: string
  timestamp: number
  direction: MessageDirection
  status?: MessageStatus
  error?: string
}

export interface Chat {
  id: string
  phone: string | null
  name: string | null
  createdAt: number
  unreadCount: number
}

export interface ChatsState {
  chats: Record<string, Chat>
  messages: Record<string, Message[]>
  activeChatId: string | null
}

export type StoredChats = Pick<ChatsState, 'chats' | 'messages'>

interface ChatAddedPayload {
  id: string
  phone?: string | null
  name?: string | null
}

interface MessageSentPayload {
  chatId: string
  localId: string
  id: string
}

interface MessageFailedPayload {
  chatId: string
  id: string
  error: string
}

interface MessageStatusChangedPayload {
  chatId: string
  id: string
  status: MessageStatus
  error?: string
}

export interface ChatPreview {
  chat: Chat
  lastMessage: Message | null
}

const initialState: ChatsState = {
  chats: {},
  messages: {},
  activeChatId: null,
}

export const getChatsStorageKey = (idInstance: string) => `chats:${idInstance}`

const UNSENT_MESSAGE_ERROR = 'Сообщение не было отправлено'

const STATUS_PROGRESS: Record<MessageStatus, number> = {
  pending: 0,
  failed: 1,
  sent: 2,
  delivered: 3,
  read: 4,
}

const canChangeStatus = (current: MessageStatus | undefined, next: MessageStatus) => {
  if (!current) {
    return true
  }

  if (next === 'failed') {
    return current === 'pending' || current === 'sent'
  }

  return STATUS_PROGRESS[next] > STATUS_PROGRESS[current]
}

const failPendingMessages = (messages: Message[]) =>
  messages.map((message) =>
    message.status === 'pending'
      ? { ...message, status: 'failed' as const, error: UNSENT_MESSAGE_ERROR }
      : message,
  )

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatsRestored(_, action: PayloadAction<StoredChats>) {
      const messages = Object.fromEntries(
        Object.entries(action.payload.messages).map(([chatId, list]) => [
          chatId,
          failPendingMessages(list),
        ]),
      )

      return { chats: action.payload.chats, messages, activeChatId: null }
    },
    chatsCleared() {
      return initialState
    },
    chatAdded(state, action: PayloadAction<ChatAddedPayload>) {
      const { id, phone = null, name = null } = action.payload
      const chat = state.chats[id]

      if (chat) {
        chat.phone = phone ?? chat.phone
        chat.name = name ?? chat.name
        return
      }

      state.chats[id] = { id, phone, name, createdAt: Date.now(), unreadCount: 0 }
      state.messages[id] = []
    },
    activeChatChanged(state, action: PayloadAction<string | null>) {
      const chat = action.payload ? state.chats[action.payload] : undefined

      state.activeChatId = chat ? chat.id : null

      if (chat) {
        chat.unreadCount = 0
      }
    },
    messageAdded(state, action: PayloadAction<Message>) {
      const message = action.payload
      const { chatId } = message

      state.chats[chatId] ??= {
        id: chatId,
        phone: null,
        name: null,
        createdAt: message.timestamp,
        unreadCount: 0,
      }

      state.messages[chatId] ??= []

      const messages = state.messages[chatId]

      if (messages.some(({ id }) => id === message.id)) {
        return
      }

      const insertIndex = messages.findLastIndex(({ timestamp }) => timestamp <= message.timestamp)

      messages.splice(insertIndex + 1, 0, message)

      if (message.direction === 'incoming' && state.activeChatId !== chatId) {
        state.chats[chatId].unreadCount += 1
      }
    },
    messageSent(state, action: PayloadAction<MessageSentPayload>) {
      const { chatId, localId, id } = action.payload
      const messages = state.messages[chatId]

      if (!messages) {
        return
      }

      if (messages.some((message) => message.id === id)) {
        state.messages[chatId] = messages.filter((message) => message.id !== localId)
        return
      }

      const message = messages.find((item) => item.id === localId)

      if (message) {
        message.id = id
        message.status = 'sent'
      }
    },
    messageFailed(state, action: PayloadAction<MessageFailedPayload>) {
      const { chatId, id, error } = action.payload
      const message = state.messages[chatId]?.find((item) => item.id === id)

      if (message) {
        message.status = 'failed'
        message.error = error
      }
    },
    messageStatusChanged(state, action: PayloadAction<MessageStatusChangedPayload>) {
      const { chatId, id, status, error } = action.payload
      const message = state.messages[chatId]?.find((item) => item.id === id)

      if (!message || !canChangeStatus(message.status, status)) {
        return
      }

      message.status = status
      message.error = status === 'failed' ? error : undefined
    },
  },
})

export const {
  chatsRestored,
  chatsCleared,
  chatAdded,
  activeChatChanged,
  messageAdded,
  messageSent,
  messageFailed,
  messageStatusChanged,
} = chatsSlice.actions
export default chatsSlice.reducer

type ChatsRootState = { chats: ChatsState }

const EMPTY_MESSAGES: Message[] = []

export const selectActiveChatId = (state: ChatsRootState) => state.chats.activeChatId

export const selectActiveChat = (state: ChatsRootState): Chat | null => {
  const { activeChatId, chats } = state.chats

  return activeChatId ? (chats[activeChatId] ?? null) : null
}

export const selectChatMessages = (state: ChatsRootState, chatId: string) =>
  state.chats.messages[chatId] ?? EMPTY_MESSAGES

export const selectStoredChats = (state: ChatsRootState): StoredChats => ({
  chats: state.chats.chats,
  messages: state.chats.messages,
})

export const selectChatPreviews = createSelector(
  [(state: ChatsRootState) => state.chats.chats, (state: ChatsRootState) => state.chats.messages],
  (chats, messages): ChatPreview[] =>
    Object.values(chats)
      .map((chat) => ({ chat, lastMessage: messages[chat.id]?.at(-1) ?? null }))
      .sort(
        (a, b) =>
          (b.lastMessage?.timestamp ?? b.chat.createdAt) -
          (a.lastMessage?.timestamp ?? a.chat.createdAt),
      ),
)
