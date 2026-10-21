import { useAppSelector } from './app/hooks'
import { AuthPage } from './features/auth/AuthPage'
import { selectCredentials } from './features/auth/authSlice'
import { MainLayout } from './features/layout/MainLayout'

export default function App() {
  const credentials = useAppSelector(selectCredentials)

  return credentials ? <MainLayout /> : <AuthPage />
}
