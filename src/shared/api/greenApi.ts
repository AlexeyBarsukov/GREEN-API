import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { type AuthState, type Credentials, selectCredentials } from '../../features/auth/authSlice'
import type {
  CheckAccountRequest,
  CheckAccountResponse,
  DeleteNotificationResponse,
  GetAccountSettingsResponse,
  GetStateInstanceResponse,
  ReceiveNotificationRequest,
  ReceiveNotificationResponse,
  SendMessageRequest,
  SendMessageResponse,
} from './types'

const DEFAULT_RECEIVE_TIMEOUT = 20

const RECEIVE_TIMEOUT_MARGIN = 40

const EMPTY_QUEUE_STATUS = 408

interface GreenApiArgs extends Omit<FetchArgs, 'url'> {
  apiMethod: string
  pathParam?: string | number
  // Allows checking credentials before they are saved to the store
  instance?: Credentials
}

const rawBaseQuery = fetchBaseQuery()

const buildUrl = (
  { apiUrl, idInstance, apiTokenInstance }: Credentials,
  apiMethod: string,
  pathParam?: string | number,
) => {
  const base = apiUrl.replace(/\/+$/, '')
  const url = `${base}/waInstance${idInstance}/${apiMethod}/${apiTokenInstance}`

  return pathParam === undefined ? url : `${url}/${pathParam}`
}

const greenApiBaseQuery: BaseQueryFn<GreenApiArgs, unknown, FetchBaseQueryError> = (
  { apiMethod, pathParam, instance, ...fetchArgs },
  api,
  extraOptions,
) => {
  const credentials = instance ?? selectCredentials(api.getState() as { auth: AuthState })

  if (!credentials) {
    return { error: { status: 'CUSTOM_ERROR', error: 'Не указаны данные инстанса' } }
  }

  const url = buildUrl(credentials, apiMethod, pathParam)

  return rawBaseQuery({ ...fetchArgs, url }, api, extraOptions)
}

export const greenApi = createApi({
  reducerPath: 'greenApi',
  baseQuery: greenApiBaseQuery,
  endpoints: (builder) => ({
    getStateInstance: builder.query<GetStateInstanceResponse, Credentials | undefined>({
      query: (instance) => ({ apiMethod: 'getStateInstance', instance }),
    }),

    getAccountSettings: builder.query<GetAccountSettingsResponse, void>({
      query: () => ({ apiMethod: 'getAccountSettings' }),
    }),

    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({ apiMethod: 'sendMessage', method: 'POST', body }),
    }),

    checkAccount: builder.mutation<CheckAccountResponse, CheckAccountRequest>({
      query: (body) => ({ apiMethod: 'checkAccount', method: 'POST', body }),
    }),

    // Notifications are mutations: they are read in a loop and must not be cached
    receiveNotification: builder.mutation<
      ReceiveNotificationResponse | null,
      ReceiveNotificationRequest | undefined
    >({
      query: ({ receiveTimeout = DEFAULT_RECEIVE_TIMEOUT } = {}) => ({
        apiMethod: 'receiveNotification',
        params: { receiveTimeout },
        timeout: (receiveTimeout + RECEIVE_TIMEOUT_MARGIN) * 1000,
        validateStatus: (response) => response.ok || response.status === EMPTY_QUEUE_STATUS,
      }),
    }),

    deleteNotification: builder.mutation<DeleteNotificationResponse, number>({
      query: (receiptId) => ({
        apiMethod: 'deleteNotification',
        method: 'DELETE',
        pathParam: receiptId,
      }),
    }),
  }),
})

export const {
  useGetStateInstanceQuery,
  useLazyGetStateInstanceQuery,
  useGetAccountSettingsQuery,
  useSendMessageMutation,
  useCheckAccountMutation,
} = greenApi
