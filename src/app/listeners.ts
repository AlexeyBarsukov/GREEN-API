import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { CREDENTIALS_STORAGE_KEY, login, logout } from '../features/auth/authSlice'
import {
  activeChatChanged,
  chatAdded,
  chatsCleared,
  chatsRestored,
  getChatsStorageKey,
  type StoredChats,
  selectStoredChats,
} from '../features/chats/chatsSlice'
import { greenApi } from '../shared/api/greenApi'
import { loadFromStorage, removeFromStorage, saveToStorage } from '../shared/lib/storage'
import type { AppDispatch, RootState } from './store'

export const listenerMiddleware = createListenerMiddleware()

const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()

startAppListening({
  actionCreator: login,
  effect: (action, api) => {
    const { idInstance } = action.payload
    const storedChats = loadFromStorage<StoredChats>(getChatsStorageKey(idInstance))

    saveToStorage(CREDENTIALS_STORAGE_KEY, action.payload)

    if (storedChats) {
      api.dispatch(chatsRestored(storedChats))
    }
  },
})

startAppListening({
  actionCreator: logout,
  effect: (_, api) => {
    removeFromStorage(CREDENTIALS_STORAGE_KEY)
    api.dispatch(chatsCleared())
    api.dispatch(greenApi.util.resetApiState())
  },
})

// Chats are kept per instance, so they are restored after the next login
startAppListening({
  matcher: isAnyOf(chatAdded, activeChatChanged),
  effect: (_, api) => {
    const state = api.getState()
    const { credentials } = state.auth

    if (credentials) {
      saveToStorage(getChatsStorageKey(credentials.idInstance), selectStoredChats(state))
    }
  },
})
