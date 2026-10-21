import styles from './App.module.css'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { AuthPage } from './features/auth/AuthPage'
import { logout, selectCredentials } from './features/auth/authSlice'
import { Button } from './shared/ui/Button/Button'

export default function App() {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector(selectCredentials)

  if (!credentials) {
    return <AuthPage />
  }

  // Temporary screen until the chat layout is ready
  return (
    <main className={styles.app}>
      <div className={styles.stub}>
        <p>Инстанс {credentials.idInstance} подключён</p>
        <Button variant="secondary" onClick={() => dispatch(logout())}>
          Выйти
        </Button>
      </div>
    </main>
  )
}
