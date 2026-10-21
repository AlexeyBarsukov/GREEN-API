import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { ChatPanel } from '../chats/ChatPanel'
import { ChatSidebar } from '../chats/ChatSidebar'
import { selectActiveChatId } from '../chats/chatsSlice'
import { ProfilePanel } from '../settings/ProfilePanel'
import { SettingsSidebar } from '../settings/SettingsSidebar'
import styles from './MainLayout.module.css'
import { NavRail, type Section } from './NavRail'

export function MainLayout() {
  const [section, setSection] = useState<Section>('chats')
  const [isProfileOpen, setProfileOpen] = useState(false)
  const activeChatId = useAppSelector(selectActiveChatId)

  const isChats = section === 'chats'
  const isPanelOpen = isChats ? activeChatId !== null : isProfileOpen

  const handleSectionChange = (nextSection: Section) => {
    setSection(nextSection)
    setProfileOpen(nextSection === 'settings')
  }

  const handleProfileOpen = () => {
    setProfileOpen(true)
  }

  const handleProfileClose = () => {
    setProfileOpen(false)
  }

  return (
    <div className={styles.layout} data-panel-open={isPanelOpen}>
      <div className={styles.rail}>
        <NavRail section={section} onChange={handleSectionChange} />
      </div>
      <div className={styles.sidebar}>
        {isChats ? (
          <ChatSidebar />
        ) : (
          <SettingsSidebar profileOpen={isProfileOpen} onProfileOpen={handleProfileOpen} />
        )}
      </div>
      <main className={styles.main}>
        {isChats ? <ChatPanel /> : <ProfilePanel onClose={handleProfileClose} />}
      </main>
    </div>
  )
}
