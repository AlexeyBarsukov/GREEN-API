import { formatChatDate } from '../../shared/lib/date'
import { Avatar } from '../../shared/ui/Avatar/Avatar'
import styles from './ChatListItem.module.css'
import type { ChatPreview } from './chatsSlice'
import { getChatTitle } from './getChatTitle'

interface ChatListItemProps {
  preview: ChatPreview
  active: boolean
  onSelect: (chatId: string) => void
}

export function ChatListItem({ preview, active, onSelect }: ChatListItemProps) {
  const { chat, lastMessage } = preview
  const title = getChatTitle(chat)
  const date = formatChatDate(lastMessage?.timestamp ?? chat.createdAt)
  const className = active ? `${styles.item} ${styles.active}` : styles.item

  const handleChatSelect = () => {
    onSelect(chat.id)
  }

  return (
    <li>
      <button
        type="button"
        className={className}
        onClick={handleChatSelect}
        aria-current={active ? 'true' : undefined}
      >
        <Avatar id={chat.id} name={chat.name} />

        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.title}>{title}</span>
            <span className={styles.date}>{date}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.preview}>
              {lastMessage?.direction === 'outgoing' && <span className={styles.you}>Вы: </span>}
              {lastMessage?.text ?? 'Нет сообщений'}
            </span>
            {chat.unreadCount > 0 && <span className={styles.badge}>{chat.unreadCount}</span>}
          </div>
        </div>
      </button>
    </li>
  )
}
