import { Check, CheckCheck, CircleAlert, Clock, type LucideIcon } from 'lucide-react'
import { formatTime } from '../../shared/lib/date'
import type { Message, MessageStatus } from '../chats/chatsSlice'
import styles from './MessageBubble.module.css'

const STATUS_VIEW: Record<MessageStatus, { icon: LucideIcon; label: string }> = {
  pending: { icon: Clock, label: 'Отправляется' },
  sent: { icon: Check, label: 'Отправлено' },
  delivered: { icon: CheckCheck, label: 'Доставлено' },
  read: { icon: CheckCheck, label: 'Прочитано' },
  failed: { icon: CircleAlert, label: 'Не отправлено' },
}

interface MessageBubbleProps {
  message: Message
  grouped: boolean
}

export function MessageBubble({ message, grouped }: MessageBubbleProps) {
  const { text, timestamp, direction, status, error } = message
  const rowClassName = [styles.row, styles[direction], grouped && styles.grouped]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rowClassName}>
      <div className={styles.bubble} title={error}>
        <span className={styles.text}>{text}</span>
        <span className={styles.spacer} aria-hidden="true" />
        <span className={styles.meta}>
          <time dateTime={new Date(timestamp).toISOString()}>{formatTime(timestamp)}</time>
          {direction === 'outgoing' && status && <MessageStatusIcon status={status} />}
        </span>
      </div>
    </div>
  )
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  const { icon: Icon, label } = STATUS_VIEW[status]

  return <Icon className={`${styles.status} ${styles[status]}`} aria-label={label} role="img" />
}
