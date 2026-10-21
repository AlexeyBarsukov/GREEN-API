import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

interface AuthState {
  credentials: Credentials | null
}

const initialState: AuthState = {
  credentials: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<Credentials>) {
      state.credentials = action.payload
    },
    logout(state) {
      state.credentials = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
