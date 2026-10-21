import { User } from 'lucide-react'
import { useState } from 'react'
import styles from './Avatar.module.css'

// Gradients live in tokens.css as --avatar-gradient-0..5
const AVATAR_GRADIENT_COUNT = 6

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  id: string
  name: string | null
  src?: string
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

export function Avatar({ id, name, src, size = 'lg' }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const initials = name ? getInitials(name) : ''
  const className = [styles.avatar, styles[size], getGradientClass(id)].join(' ')
  const showImage = Boolean(src) && src !== failedSrc

  const handleImageError = () => {
    setFailedSrc(src ?? null)
  }

  return (
    <div className={className} aria-hidden="true">
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={handleImageError} />
      ) : (
        initials || <User className={styles.icon} strokeWidth={2} />
      )}
    </div>
  )
}
