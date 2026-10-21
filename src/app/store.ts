import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import chatsReducer, {
  chatsRestored,
  getChatsStorageKey,
  type StoredChats,
} from '../features/chats/chatsSlice'
import { greenApi } from '../shared/api/greenApi'
import { loadFromStorage } from '../shared/lib/storage'
import { listenerMiddleware } from './listeners'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    [greenApi.reducerPath]: greenApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(greenApi.middleware),
})

const { credentials } = store.getState().auth

if (credentials) {
  const storedChats = loadFromStorage<StoredChats>(getChatsStorageKey(credentials.idInstance))

  if (storedChats) {
    store.dispatch(chatsRestored(storedChats))
  }
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
