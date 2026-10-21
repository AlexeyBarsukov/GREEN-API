import { ArrowLeft } from 'lucide-react'
import { useId, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { getErrorMessage } from '../../shared/api/errors'
import { useGetAccountSettingsQuery } from '../../shared/api/greenApi'
import type { StateInstance } from '../../shared/api/types'
import { formatPhone } from '../../shared/lib/phone'
import { Avatar } from '../../shared/ui/Avatar/Avatar'
import { Button } from '../../shared/ui/Button/Button'
import { selectCredentials } from '../auth/authSlice'
import { LogoutDialog } from './LogoutDialog'
import styles from './ProfilePanel.module.css'

const STATE_LABELS: Record<StateInstance, string> = {
  authorized: 'Авторизован',
  notAuthorized: 'Не авторизован',
  blocked: 'Заблокирован',
  starting: 'Запускается',
  suspended: 'Временно ограничен',
  pendingPassword: 'Ожидает пароль',
}

interface ProfilePanelProps {
  onClose: () => void
}

export function ProfilePanel({ onClose }: ProfilePanelProps) {
  const titleId = useId()
  const credentials = useAppSelector(selectCredentials)
  const { data: account, error, isLoading } = useGetAccountSettingsQuery()
  const [isLogoutOpen, setLogoutOpen] = useState(false)

  const handleLogoutOpen = () => {
    setLogoutOpen(true)
  }

  const handleLogoutClose = () => {
    setLogoutOpen(false)
  }

  if (!credentials) {
    return null
  }

  const phone = account?.phone ? formatPhone(account.phone) : null
  const state = account ? STATE_LABELS[account.stateInstance] : null
  const errorMessage = getErrorMessage(error)

  const rows = [
    { label: 'Телефон', value: phone ?? '—' },
    { label: 'idInstance', value: credentials.idInstance },
    { label: 'Адрес API', value: credentials.apiUrl },
    { label: 'Состояние', value: state ?? '—' },
  ]

  return (
    <section className={styles.panel} aria-labelledby={titleId}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onClose} aria-label="Назад">
          <ArrowLeft size={22} />
        </button>
        <h2 id={titleId} className={styles.title}>
          Профиль
        </h2>
      </header>

      <div className={styles.content}>
        <Avatar id={credentials.idInstance} name={null} src={account?.avatar} size="xl" />
        <p className={styles.name}>{phone ?? `Инстанс ${credentials.idInstance}`}</p>
        <p className={styles.state}>{isLoading ? 'Загрузка…' : state}</p>

        {errorMessage && (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        <dl className={styles.details}>
          {rows.map(({ label, value }) => (
            <div key={label} className={styles.row}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>

        <Button variant="secondary" onClick={handleLogoutOpen}>
          Выйти из профиля
        </Button>
      </div>

      <LogoutDialog open={isLogoutOpen} onClose={handleLogoutClose} />
    </section>
  )
}
