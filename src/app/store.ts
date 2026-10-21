import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { greenApi } from '../shared/api/greenApi'
import { listenerMiddleware } from './listeners'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [greenApi.reducerPath]: greenApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(greenApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
