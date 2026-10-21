import type { AppDispatch, RootState } from '../../app/store'
import { getStateInstanceMessage } from '../../shared/api/errors'
import type {
  MessageData,
  MessageNotification,
  Notification,
  OutgoingMessageStatus,
  OutgoingMessageStatusNotification,
  StateInstanceChangedNotification,
} from '../../shared/api/types'
import { logout } from '../auth/authSlice'
import {
  chatAdded,
  type MessageStatus,
  messageAdded,
  messageStatusChanged,
  selectChatMessages,
} from '../chats/chatsSlice'

type GetState = () => RootState

const UNSUPPORTED_MESSAGE_TEXT = 'Сообщение этого типа не поддерживается'

const STATUS_MAP: Record<OutgoingMessageStatus, MessageStatus> = {
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed',
  noAccount: 'failed',
  notInGroup: 'failed',
}

const STATUS_ERRORS: Partial<Record<OutgoingMessageStatus, string>> = {
  failed: 'MAX не принял сообщение',
  noAccount: 'У получателя нет аккаунта MAX',
  notInGroup: 'Вы не состоите в этой группе',
}

const getMessageText = (messageData: MessageData | undefined) =>
  messageData?.textMessageData?.textMessage ?? messageData?.extendedTextMessageData?.text ?? null

const handleMessageNotification = (
  notification: MessageNotification,
  dispatch: AppDispatch,
  getState: GetState,
) => {
  const { typeWebhook, idMessage, timestamp, senderData, messageData } = notification
  const { chatId, chatName, senderPhoneNumber } = senderData
  const isIncoming = typeWebhook === 'incomingMessageReceived'
  const text = getMessageText(messageData) ?? UNSUPPORTED_MESSAGE_TEXT

  if (typeWebhook === 'outgoingAPIMessageReceived') {
    const isSentFromThisApp = selectChatMessages(getState(), chatId).some(
      (message) => message.status === 'pending' && message.text === text,
    )

    if (isSentFromThisApp) {
      return
    }
  }

  dispatch(
    chatAdded({
      id: chatId,
      name: chatName || null,
      phone: isIncoming && senderPhoneNumber ? String(senderPhoneNumber) : null,
    }),
  )

  dispatch(
    messageAdded({
      id: idMessage,
      chatId,
      text,
      timestamp: timestamp * 1000,
      direction: isIncoming ? 'incoming' : 'outgoing',
      status: isIncoming ? undefined : 'sent',
    }),
  )
}

const handleStatusNotification = (
  { chatId, idMessage, status, description }: OutgoingMessageStatusNotification,
  dispatch: AppDispatch,
) => {
  dispatch(
    messageStatusChanged({
      chatId,
      id: idMessage,
      status: STATUS_MAP[status],
      error: description || STATUS_ERRORS[status],
    }),
  )
}

const handleStateNotification = (
  { stateInstance }: StateInstanceChangedNotification,
  dispatch: AppDispatch,
) => {
  if (stateInstance === 'notAuthorized' || stateInstance === 'blocked') {
    dispatch(logout(getStateInstanceMessage(stateInstance) ?? undefined))
  }
}

export const handleNotification = (
  notification: Notification,
  dispatch: AppDispatch,
  getState: GetState,
) => {
  switch (notification.typeWebhook) {
    case 'incomingMessageReceived':
    case 'outgoingMessageReceived':
    case 'outgoingAPIMessageReceived':
      handleMessageNotification(notification, dispatch, getState)
      break
    case 'outgoingMessageStatus':
      handleStatusNotification(notification, dispatch)
      break
    case 'stateInstanceChanged':
      handleStateNotification(notification, dispatch)
      break
  }
}
