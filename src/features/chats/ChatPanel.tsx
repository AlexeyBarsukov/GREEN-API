import { ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { formatPhone } from '../../shared/lib/phone'
import { Avatar } from '../../shared/ui/Avatar/Avatar'
import { MessageComposer } from '../messages/MessageComposer'
import { MessageList } from '../messages/MessageList'
import styles from './ChatPanel.module.css'
import { activeChatChanged, selectActiveChat } from './chatsSlice'
import { getChatTitle } from './getChatTitle'

export function ChatPanel() {
  const dispatch = useAppDispatch()
  const chat = useAppSelector(selectActiveChat)

  const handleChatClose = () => {
    dispatch(activeChatChanged(null))
  }

  if (!chat) {
    return (
      <section className={styles.panel}>
        <div className={styles.placeholder}>
          <p className={styles.hint}>Выберите чат или создайте новый</p>
        </div>
      </section>
    )
  }

  const title = getChatTitle(chat)
  const subtitle = chat.name && chat.phone ? formatPhone(chat.phone) : 'MAX'

  return (
    <section className={styles.panel} aria-label={`Чат: ${title}`}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={handleChatClose}
          aria-label="Закрыть чат"
        >
          <ArrowLeft size={22} />
        </button>
        <Avatar id={chat.id} name={chat.name} size="sm" />
        <div className={styles.info}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </header>

      <MessageList key={`list-${chat.id}`} chatId={chat.id} />
      <MessageComposer key={`composer-${chat.id}`} chatId={chat.id} />
    </section>
  )
}
