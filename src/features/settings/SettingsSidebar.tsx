import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Avatar } from '../../shared/ui/Avatar/Avatar'
import { Button } from '../../shared/ui/Button/Button'
import { logout, selectCredentials } from '../auth/authSlice'
import styles from './SettingsSidebar.module.css'

export function SettingsSidebar() {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector(selectCredentials)

  const handleLogout = () => {
    dispatch(logout())
  }

  if (!credentials) {
    return null
  }

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Настройки</h1>
      </header>

      <div className={styles.profile}>
        <Avatar id={credentials.idInstance} name="GREEN API" size="md" />
        <div className={styles.info}>
          <p className={styles.name}>Инстанс {credentials.idInstance}</p>
          <p className={styles.url}>{credentials.apiUrl}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={handleLogout}>
          Выйти из профиля
        </Button>
      </div>
    </aside>
  )
}
