import { Plus } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ChatListItem } from './ChatListItem'
import styles from './ChatSidebar.module.css'
import {
  activeChatChanged,
  type ChatPreview,
  selectActiveChatId,
  selectChatPreviews,
} from './chatsSlice'
import { getChatTitle } from './getChatTitle'
import { NewChatDialog } from './NewChatDialog'

const matchesQuery = ({ chat, lastMessage }: ChatPreview, query: string) =>
  [getChatTitle(chat), chat.phone, lastMessage?.text].some((value) =>
    value?.toLowerCase().includes(query),
  )

export function ChatSidebar() {
  const dispatch = useAppDispatch()
  const previews = useAppSelector(selectChatPreviews)
  const activeChatId = useAppSelector(selectActiveChatId)
  const [query, setQuery] = useState('')
  const [isDialogOpen, setDialogOpen] = useState(false)

  const normalizedQuery = query.trim().toLowerCase()
  const visiblePreviews = normalizedQuery
    ? previews.filter((preview) => matchesQuery(preview, normalizedQuery))
    : previews

  const handleChatSelect = (chatId: string) => {
    dispatch(activeChatChanged(chatId))
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <button
          type="button"
          className={styles.add}
          onClick={handleDialogOpen}
          aria-label="Новый чат"
          title="Новый чат"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </header>

      <div className={styles.search}>
        <input
          type="search"
          className={styles.searchInput}
          value={query}
          onChange={handleSearchChange}
          placeholder="Найти"
          aria-label="Поиск по чатам"
        />
      </div>

      {visiblePreviews.length > 0 ? (
        <ul className={styles.list}>
          {visiblePreviews.map((preview) => (
            <ChatListItem
              key={preview.chat.id}
              preview={preview}
              active={preview.chat.id === activeChatId}
              onSelect={handleChatSelect}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          {normalizedQuery ? 'Ничего не найдено' : 'Чатов пока нет. Нажмите «+», чтобы начать'}
        </p>
      )}

      <NewChatDialog open={isDialogOpen} onClose={handleDialogClose} />
    </aside>
  )
}
