import { nanoid } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '../../app/hooks'
import { getErrorMessage } from '../../shared/api/errors'
import { greenApi } from '../../shared/api/greenApi'
import { messageAdded, messageFailed, messageSent } from './chatsSlice'

interface SendChatMessageArgs {
  chatId: string
  text: string
}

export const sendChatMessage = createAppAsyncThunk(
  'chats/sendChatMessage',
  async ({ chatId, text }: SendChatMessageArgs, { dispatch }) => {
    const localId = `local-${nanoid()}`

    dispatch(
      messageAdded({
        id: localId,
        chatId,
        text,
        timestamp: Date.now(),
        direction: 'outgoing',
        status: 'pending',
      }),
    )

    const result = await dispatch(
      greenApi.endpoints.sendMessage.initiate({ chatId, message: text }),
    )

    if (result.error) {
      const error = getErrorMessage(result.error) ?? 'Не удалось отправить сообщение'

      dispatch(messageFailed({ chatId, id: localId, error }))
      return
    }

    dispatch(messageSent({ chatId, localId, id: result.data.idMessage }))
  },
)
