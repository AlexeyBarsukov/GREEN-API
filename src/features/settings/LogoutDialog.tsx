import { useAppDispatch } from '../../app/hooks'
import { Button } from '../../shared/ui/Button/Button'
import { Modal } from '../../shared/ui/Modal/Modal'
import { logout } from '../auth/authSlice'
import styles from './LogoutDialog.module.css'

interface LogoutDialogProps {
  open: boolean
  onClose: () => void
}

export function LogoutDialog({ open, onClose }: LogoutDialogProps) {
  const dispatch = useAppDispatch()

  const handleLogoutConfirm = () => {
    dispatch(logout())
  }

  return (
    <Modal open={open} title="Выйти из профиля?" onClose={onClose}>
      <p className={styles.text}>
        Чаты сохранятся в этом браузере и появятся снова после входа с этим инстансом.
      </p>
      <div className={styles.actions}>
        <Button variant="danger" onClick={handleLogoutConfirm}>
          Выйти
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
      </div>
    </Modal>
  )
}
