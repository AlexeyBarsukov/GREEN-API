export type StateInstance =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'starting'
  | 'suspended'
  | 'pendingPassword'

export interface GetStateInstanceResponse {
  stateInstance: StateInstance
}

export interface SendMessageRequest {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface CheckAccountRequest {
  phoneNumber: number
}

export type CheckAccountResponse =
  | { exist: boolean; chatId: string; fromCache: boolean }
  | { status: false; reason: string }

export interface InstanceData {
  idInstance: number
  wid: string
  typeInstance: string
}

export interface SenderData {
  chatId: string
  chatName: string
  chatType: 'user' | 'group'
  sender: string
  senderName: string
  senderContactName?: string
  senderPhoneNumber?: number
}

export interface MessageData {
  typeMessage: string
  textMessageData?: { textMessage: string }
  extendedTextMessageData?: { text: string }
}

export interface MessageNotification {
  typeWebhook: 'incomingMessageReceived' | 'outgoingMessageReceived' | 'outgoingAPIMessageReceived'
  instanceData: InstanceData
  timestamp: number
  idMessage: string
  senderData: SenderData
  messageData: MessageData
}

export type OutgoingMessageStatus =
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'noAccount'
  | 'notInGroup'

export interface OutgoingMessageStatusNotification {
  typeWebhook: 'outgoingMessageStatus'
  instanceData: InstanceData
  timestamp: number
  chatId: string
  idMessage: string
  status: OutgoingMessageStatus
  description?: string
}

export interface StateInstanceChangedNotification {
  typeWebhook: 'stateInstanceChanged'
  instanceData: InstanceData
  timestamp: number
  stateInstance: StateInstance
}

export type Notification =
  | MessageNotification
  | OutgoingMessageStatusNotification
  | StateInstanceChangedNotification

export interface ReceiveNotificationRequest {
  receiveTimeout?: number
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: Notification
}

export interface DeleteNotificationResponse {
  result: boolean
  reason?: string
}
