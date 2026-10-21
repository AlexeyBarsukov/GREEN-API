import { createListenerMiddleware } from '@reduxjs/toolkit'
import { CREDENTIALS_STORAGE_KEY, login, logout } from '../features/auth/authSlice'
import { greenApi } from '../shared/api/greenApi'
import { removeFromStorage, saveToStorage } from '../shared/lib/storage'

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: login,
  effect: (action) => {
    saveToStorage(CREDENTIALS_STORAGE_KEY, action.payload)
  },
})

listenerMiddleware.startListening({
  actionCreator: logout,
  effect: (_, api) => {
    removeFromStorage(CREDENTIALS_STORAGE_KEY)
    api.dispatch(greenApi.util.resetApiState())
  },
})
