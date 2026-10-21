import { SendHorizontal } from 'lucide-react'
import {
  type ChangeEvent,
  type KeyboardEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAppDispatch } from '../../app/hooks'
import { sendChatMessage } from '../chats/sendChatMessage'
import styles from './MessageComposer.module.css'

// GREEN-API sendMessage limit
const MAX_MESSAGE_LENGTH = 4000

interface MessageComposerProps {
  chatId: string
}

export function MessageComposer({ chatId }: MessageComposerProps) {
  const dispatch = useAppDispatch()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const message = text.trim()

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const sendMessage = () => {
    if (!message) {
      return
    }

    dispatch(sendChatMessage({ chatId, text: message }))
    setText('')
    textareaRef.current?.focus()
  }

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const handleTextKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      sendMessage()
    }
  }

  const handleMessageSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage()
  }

  return (
    <form className={styles.composer} onSubmit={handleMessageSubmit}>
      <div className={styles.field} data-value={text}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleTextKeyDown}
          placeholder="Сообщение"
          aria-label="Сообщение"
          maxLength={MAX_MESSAGE_LENGTH}
          rows={1}
        />
      </div>

      {message && (
        <button type="submit" className={styles.send} aria-label="Отправить">
          <SendHorizontal size={20} />
        </button>
      )}
    </form>
  )
}
