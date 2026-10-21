import type { ForkedTaskAPI, ListenerEffectAPI, SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { AppDispatch, RootState } from '../../app/store'
import { greenApi } from '../../shared/api/greenApi'
import { logout } from '../auth/authSlice'
import { handleNotification } from './handleNotification'

const RETRY_DELAY = 5000

const INVALID_CREDENTIALS_REASON = 'Данные инстанса больше не действительны. Войдите заново'

type AppListenerApi = ListenerEffectAPI<RootState, AppDispatch>

const isAuthError = (error: FetchBaseQueryError | SerializedError) =>
  'status' in error && (error.status === 401 || error.status === 403)

const isTimeoutError = (error: FetchBaseQueryError | SerializedError) =>
  'status' in error && error.status === 'TIMEOUT_ERROR'

const receiveNotification = async (api: AppListenerApi, task: ForkedTaskAPI) => {
  const request = api.dispatch(greenApi.endpoints.receiveNotification.initiate(undefined))
  const abortRequest = () => request.abort()

  task.signal.addEventListener('abort', abortRequest)

  try {
    return await request
  } finally {
    task.signal.removeEventListener('abort', abortRequest)
    request.reset()
  }
}

const deleteNotification = async (api: AppListenerApi, receiptId: number) => {
  const request = api.dispatch(greenApi.endpoints.deleteNotification.initiate(receiptId))

  await request
  request.reset()
}

export const pollNotifications = async (api: AppListenerApi, task: ForkedTaskAPI) => {
  while (!task.signal.aborted) {
    const result = await receiveNotification(api, task)

    if (task.signal.aborted) {
      return
    }

    if (result.error) {
      if (isAuthError(result.error)) {
        api.dispatch(logout(INVALID_CREDENTIALS_REASON))
        return
      }

      if (!isTimeoutError(result.error)) {
        await task.delay(RETRY_DELAY)
      }

      continue
    }

    if (!result.data) {
      continue
    }

    const { receiptId, body } = result.data

    handleNotification(body, api.dispatch, api.getState)
    await deleteNotification(api, receiptId)
  }
}
