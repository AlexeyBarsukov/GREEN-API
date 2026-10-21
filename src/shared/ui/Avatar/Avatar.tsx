import { User } from 'lucide-react'
import styles from './Avatar.module.css'

// Gradients live in tokens.css as --avatar-gradient-0..5
const AVATAR_GRADIENT_COUNT = 6

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  id: string
  name: string | null
  size?: AvatarSize
}

// First letter of each word, skipping quotes, brackets and emoji: "«Ромашка» Доставка" -> "РД"
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

// Same chat always gets the same color
const getGradientClass = (id: string) => {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return styles[`gradient${hash % AVATAR_GRADIENT_COUNT}`]
}

export function Avatar({ id, name, size = 'lg' }: AvatarProps) {
  const initials = name ? getInitials(name) : ''
  const className = [styles.avatar, styles[size], getGradientClass(id)].join(' ')

  return (
    <div className={className} aria-hidden="true">
      {initials || <User className={styles.icon} strokeWidth={2} />}
    </div>
  )
}
