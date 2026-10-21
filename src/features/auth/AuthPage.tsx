import { type ChangeEvent, type SubmitEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getErrorMessage, getStateInstanceMessage } from '../../shared/api/errors'
import { useLazyGetStateInstanceQuery } from '../../shared/api/greenApi'
import { Button } from '../../shared/ui/Button/Button'
import { Logo } from '../../shared/ui/Logo/Logo'
import { TextField } from '../../shared/ui/TextField/TextField'
import styles from './AuthPage.module.css'
import { type Credentials, DEFAULT_API_URL, login, selectLogoutReason } from './authSlice'

const CONSOLE_URL = 'https://console.green-api.com'

const initialForm: Credentials = {
  idInstance: '',
  apiTokenInstance: '',
  apiUrl: DEFAULT_API_URL,
}

const validateCredentials = ({ idInstance, apiUrl }: Credentials) => {
  if (!/^\d+$/.test(idInstance)) {
    return 'idInstance должен состоять только из цифр'
  }

  if (!/^https:\/\/\S+$/.test(apiUrl)) {
    return 'Адрес API должен начинаться с https://'
  }

  return null
}

export function AuthPage() {
  const dispatch = useAppDispatch()
  const logoutReason = useAppSelector(selectLogoutReason)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(logoutReason)
  const [checkInstance, { isFetching }] = useLazyGetStateInstanceQuery()

  const isFilled = Object.values(form).every((value) => value.trim() !== '')

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleLoginSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const credentials: Credentials = {
      idInstance: form.idInstance.trim(),
      apiTokenInstance: form.apiTokenInstance.trim(),
      apiUrl: form.apiUrl.trim(),
    }

    const validationError = validateCredentials(credentials)

    if (validationError) {
      setError(validationError)
      return
    }

    const result = await checkInstance(credentials)

    if (result.error) {
      setError(getErrorMessage(result.error))
      return
    }

    const stateError = result.data ? getStateInstanceMessage(result.data.stateInstance) : null

    if (stateError) {
      setError(stateError)
      return
    }

    dispatch(login(credentials))
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <Logo />
          <h1 className={styles.title}>Войдите с данными инстанса GREEN-API</h1>
        </div>

        <form className={styles.form} onSubmit={handleLoginSubmit} noValidate>
          <TextField
            name="idInstance"
            label="idInstance"
            value={form.idInstance}
            onChange={handleFieldChange}
            inputMode="numeric"
            autoComplete="username"
            autoFocus
          />
          <TextField
            name="apiTokenInstance"
            label="apiTokenInstance"
            type="password"
            value={form.apiTokenInstance}
            onChange={handleFieldChange}
            autoComplete="current-password"
          />
          <TextField
            name="apiUrl"
            label="apiUrl"
            type="url"
            value={form.apiUrl}
            onChange={handleFieldChange}
            hint="Все данные есть в личном кабинете GREEN-API на странице инстанса"
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className={styles.submit} disabled={!isFilled} loading={isFetching}>
            Продолжить
          </Button>
        </form>

        <footer className={styles.footer}>
          <p className={styles.note}>Данные хранятся только в вашем браузере</p>
          <a className={styles.link} href={CONSOLE_URL} target="_blank" rel="noreferrer">
            Открыть личный кабинет GREEN-API
          </a>
        </footer>
      </section>
    </main>
  )
}
