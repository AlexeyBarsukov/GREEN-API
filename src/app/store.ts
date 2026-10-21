import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { greenApi } from '../shared/api/greenApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [greenApi.reducerPath]: greenApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
