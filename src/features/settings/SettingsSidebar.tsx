import { ChevronRight } from 'lucide-react'
import { useAppSelector } from '../../app/hooks'
import { useGetAccountSettingsQuery } from '../../shared/api/greenApi'
import { formatPhone } from '../../shared/lib/phone'
import { Avatar } from '../../shared/ui/Avatar/Avatar'
import { selectCredentials } from '../auth/authSlice'
import styles from './SettingsSidebar.module.css'

interface SettingsSidebarProps {
  profileOpen: boolean
  onProfileOpen: () => void
}

export function SettingsSidebar({ profileOpen, onProfileOpen }: SettingsSidebarProps) {
  const credentials = useAppSelector(selectCredentials)
  const { data: account } = useGetAccountSettingsQuery()

  if (!credentials) {
    return null
  }

  const instanceLabel = `Инстанс ${credentials.idInstance}`
  const title = account?.phone ? formatPhone(account.phone) : instanceLabel
  const subtitle = account?.phone ? instanceLabel : credentials.apiUrl

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Настройки</h1>
      </header>

      <button
        type="button"
        className={styles.profile}
        onClick={onProfileOpen}
        aria-current={profileOpen ? 'page' : undefined}
      >
        <Avatar id={credentials.idInstance} name={null} src={account?.avatar} size="md" />
        <span className={styles.info}>
          <span className={styles.name}>{title}</span>
          <span className={styles.caption}>{subtitle}</span>
        </span>
        <ChevronRight className={styles.chevron} size={20} />
      </button>
    </aside>
  )
}
