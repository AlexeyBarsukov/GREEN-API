import { Fragment, useLayoutEffect, useRef } from 'react'
import { useAppSelector } from '../../app/hooks'
import { formatDayLabel, isSameDay } from '../../shared/lib/date'
import { selectChatMessages } from '../chats/chatsSlice'
import { MessageBubble } from './MessageBubble'
import styles from './MessageList.module.css'

const BOTTOM_THRESHOLD = 80

interface MessageListProps {
  chatId: string
}

export function MessageList({ chatId }: MessageListProps) {
  const messages = useAppSelector((state) => selectChatMessages(state, chatId))
  const listRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const lastMessage = messages.at(-1)

  useLayoutEffect(() => {
    const list = listRef.current

    if (list && (isAtBottomRef.current || lastMessage?.direction === 'outgoing')) {
      list.scrollTop = list.scrollHeight
    }
  }, [lastMessage])

  const handleListScroll = () => {
    const list = listRef.current

    if (list) {
      isAtBottomRef.current =
        list.scrollHeight - list.scrollTop - list.clientHeight < BOTTOM_THRESHOLD
    }
  }

  return (
    <div ref={listRef} className={styles.list} onScroll={handleListScroll}>
      <div className={styles.column}>
        {messages.length === 0 && (
          <p className={styles.empty}>Сообщений пока нет. Напишите первым</p>
        )}

        {messages.map((message, index) => {
          const previous = messages[index - 1]
          const isNewDay = !previous || !isSameDay(previous.timestamp, message.timestamp)
          const isGrouped = !isNewDay && previous.direction === message.direction

          return (
            <Fragment key={message.id}>
              {isNewDay && (
                <p className={styles.day}>
                  <span className={styles.dayLabel}>{formatDayLabel(message.timestamp)}</span>
                </p>
              )}
              <MessageBubble message={message} grouped={isGrouped} />
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
