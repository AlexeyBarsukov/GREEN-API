import { type LucideIcon, MessageCircle, Settings } from 'lucide-react'
import styles from './NavRail.module.css'

export type Section = 'chats' | 'settings'

interface NavItem {
  section: Section
  label: string
  icon: LucideIcon
}

const TOP_ITEMS: NavItem[] = [{ section: 'chats', label: 'Чаты', icon: MessageCircle }]
const BOTTOM_ITEMS: NavItem[] = [{ section: 'settings', label: 'Настройки', icon: Settings }]

interface NavRailProps {
  section: Section
  onChange: (section: Section) => void
}

export function NavRail({ section, onChange }: NavRailProps) {
  const renderList = (items: NavItem[]) => (
    <ul className={styles.list}>
      {items.map((item) => (
        <NavRailItem
          key={item.section}
          item={item}
          active={item.section === section}
          onSelect={onChange}
        />
      ))}
    </ul>
  )

  return (
    <nav className={styles.rail} aria-label="Разделы">
      {renderList(TOP_ITEMS)}
      {renderList(BOTTOM_ITEMS)}
    </nav>
  )
}

interface NavRailItemProps {
  item: NavItem
  active: boolean
  onSelect: (section: Section) => void
}

function NavRailItem({ item, active, onSelect }: NavRailItemProps) {
  const { section, label, icon: Icon } = item

  const handleSectionSelect = () => {
    onSelect(section)
  }

  return (
    <li>
      <button
        type="button"
        className={active ? `${styles.item} ${styles.active}` : styles.item}
        onClick={handleSectionSelect}
        aria-current={active ? 'page' : undefined}
      >
        <Icon size={24} strokeWidth={active ? 2.25 : 1.75} />
        <span className={styles.label}>{label}</span>
      </button>
    </li>
  )
}
