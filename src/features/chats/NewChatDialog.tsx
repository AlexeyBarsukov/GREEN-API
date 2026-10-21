import { type ChangeEvent, type SubmitEvent, useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { getErrorMessage } from '../../shared/api/errors'
import { useCheckAccountMutation } from '../../shared/api/greenApi'
import { isSupportedPhone, normalizePhone } from '../../shared/lib/phone'
import { Button } from '../../shared/ui/Button/Button'
import { Modal } from '../../shared/ui/Modal/Modal'
import { TextField } from '../../shared/ui/TextField/TextField'
import { activeChatChanged, chatAdded } from './chatsSlice'
import styles from './NewChatDialog.module.css'

const NOT_AUTHORIZED_REASON = 'instance is starting or not authorized'

interface NewChatDialogProps {
  open: boolean
  onClose: () => void
}

export function NewChatDialog({ open, onClose }: NewChatDialogProps) {
  return (
    <Modal open={open} title="Новый чат" onClose={onClose}>
      <NewChatForm onCreated={onClose} />
    </Modal>
  )
}

function NewChatForm({ onCreated }: { onCreated: () => void }) {
  const dispatch = useAppDispatch()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checkAccount, { isLoading }] = useCheckAccountMutation()

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value)
    setError(null)
  }

  const handleNewChatSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const digits = normalizePhone(phone)

    if (!isSupportedPhone(digits)) {
      setError('Введите номер России (+7) или Беларуси (+375)')
      return
    }

    const result = await checkAccount({ phoneNumber: Number(digits) })

    if (result.error) {
      setError(getErrorMessage(result.error))
      return
    }

    if ('reason' in result.data) {
      setError(
        result.data.reason === NOT_AUTHORIZED_REASON
          ? 'Инстанс не авторизован или запускается'
          : result.data.reason,
      )
      return
    }

    if (!result.data.exist || !result.data.chatId) {
      setError('У этого номера нет аккаунта MAX')
      return
    }

    dispatch(chatAdded({ id: result.data.chatId, phone: digits }))
    dispatch(activeChatChanged(result.data.chatId))
    onCreated()
  }

  return (
    <form className={styles.form} onSubmit={handleNewChatSubmit} noValidate>
      <TextField
        label="Номер телефона"
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="+7 999 123-45-67"
        autoComplete="tel"
        autoFocus
        hint="Проверим, что у номера есть аккаунт MAX, и откроем чат"
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={phone.trim() === ''} loading={isLoading}>
        Создать чат
      </Button>
    </form>
  )
}
