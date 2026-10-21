import maxLogo from '../../../assets/MAX.svg'
import styles from './Logo.module.css'

export function Logo() {
  return (
    <div className={styles.logo}>
      <img className={styles.icon} src={maxLogo} alt="" />
      <span className={styles.text}>MAX Chat</span>
    </div>
  )
}
