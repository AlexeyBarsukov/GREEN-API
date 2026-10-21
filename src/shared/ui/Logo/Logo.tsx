import styles from './Logo.module.css'

export function Logo() {
  return (
    <div className={styles.logo}>
      <svg className={styles.icon} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" className={styles.stopStart} />
            <stop offset="50%" className={styles.stopMiddle} />
            <stop offset="100%" className={styles.stopEnd} />
          </linearGradient>
        </defs>
        <path
          d="M20 3C10.6 3 3 10.2 3 19.2c0 4.3 1.8 8.2 4.6 11.1L6 37l7.2-3.1c2.1.8 4.4 1.2 6.8 1.2 9.4 0 17-7.2 17-16S29.4 3 20 3Z"
          fill="url(#logo-gradient)"
        />
        <circle cx="20" cy="19" r="7" fill="none" stroke="currentColor" strokeWidth="3.5" />
      </svg>
      <span className={styles.text}>MAX Chat</span>
    </div>
  )
}
