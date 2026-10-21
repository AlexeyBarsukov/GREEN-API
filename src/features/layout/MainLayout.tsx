import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { ChatPanel } from '../chats/ChatPanel'
import { ChatSidebar } from '../chats/ChatSidebar'
import { selectActiveChatId } from '../chats/chatsSlice'
import { SettingsSidebar } from '../settings/SettingsSidebar'
import styles from './MainLayout.module.css'
import { NavRail, type Section } from './NavRail'

export function MainLayout() {
  const [section, setSection] = useState<Section>('chats')
  const activeChatId = useAppSelector(selectActiveChatId)

  return (
    <div className={styles.layout} data-chat-open={activeChatId !== null}>
      <div className={styles.rail}>
        <NavRail section={section} onChange={setSection} />
      </div>
      <div className={styles.sidebar}>
        {section === 'chats' ? <ChatSidebar /> : <SettingsSidebar />}
      </div>
      <main className={styles.main}>
        <ChatPanel />
      </main>
    </div>
  )
}
