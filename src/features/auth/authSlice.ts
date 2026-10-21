import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadFromStorage } from '../../shared/lib/storage'

export const CREDENTIALS_STORAGE_KEY = 'credentials'

export const DEFAULT_API_URL = 'https://api.green-api.com'

export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export interface AuthState {
  credentials: Credentials | null
  logoutReason: string | null
}

const initialState: AuthState = {
  credentials: loadFromStorage<Credentials>(CREDENTIALS_STORAGE_KEY),
  logoutReason: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<Credentials>) {
      state.credentials = action.payload
      state.logoutReason = null
    },
    logout(state, action: PayloadAction<string | undefined>) {
      state.credentials = null
      state.logoutReason = action.payload ?? null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

export const selectCredentials = (state: { auth: AuthState }) => state.auth.credentials

export const selectLogoutReason = (state: { auth: AuthState }) => state.auth.logoutReason
