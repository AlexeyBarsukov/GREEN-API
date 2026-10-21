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

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatsRestored(_, action: PayloadAction<StoredChats>) {
      return { ...action.payload, activeChatId: null }
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
  },
})

export const { chatsRestored, chatsCleared, chatAdded, activeChatChanged } = chatsSlice.actions
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
