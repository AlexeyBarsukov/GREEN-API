import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { StateInstance } from './types'

const getHttpStatus = (error: FetchBaseQueryError) => {
  if (typeof error.status === 'number') {
    return error.status
  }

  return error.status === 'PARSING_ERROR' ? error.originalStatus : null
}

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined) => {
  if (!error) {
    return null
  }

  if (!('status' in error)) {
    return error.message ?? 'Неизвестная ошибка'
  }

  if (error.status === 'FETCH_ERROR') {
    return 'Не удалось подключиться к серверу. Проверьте адрес API и интернет'
  }

  if (error.status === 'TIMEOUT_ERROR') {
    return 'Сервер не ответил вовремя. Попробуйте ещё раз'
  }

  if (error.status === 'CUSTOM_ERROR') {
    return error.error
  }

  const status = getHttpStatus(error)

  if (status === 401 || status === 403) {
    return 'Неверный idInstance или apiTokenInstance'
  }

  if (status === 429) {
    return 'Слишком много запросов. Подождите немного'
  }

  if (status !== null && status >= 500) {
    return 'Сервер GREEN-API временно недоступен'
  }

  return `Ошибка запроса (${status ?? 'нет ответа'})`
}

const stateInstanceMessages: Record<Exclude<StateInstance, 'authorized'>, string> = {
  notAuthorized: 'Инстанс не авторизован. Отсканируйте QR-код в личном кабинете GREEN-API',
  blocked: 'Аккаунт MAX заблокирован',
  starting: 'Инстанс запускается. Попробуйте через пару минут',
  suspended: 'Аккаунт временно ограничен: писать можно только своим контактам',
  pendingPassword: 'Для авторизации нужен пароль двухфакторной защиты',
}

export const getStateInstanceMessage = (state: StateInstance) =>
  state === 'authorized' ? null : stateInstanceMessages[state]
