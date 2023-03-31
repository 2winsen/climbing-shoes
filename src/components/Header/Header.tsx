import styles from './Header.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <a href='/'>
        <h1>
          Climbing shoes
        </h1>
      </a>
    </div>
  )
}
