import { configureStore } from '@reduxjs/toolkit'
import authReducer, { login } from '../features/auth/authSlice'
import chatsReducer from '../features/chats/chatsSlice'
import { greenApi } from '../shared/api/greenApi'
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
  store.dispatch(login(credentials))
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
