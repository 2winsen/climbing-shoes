import styles from './Header.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <a href="/">
        <span className={styles.headerText}>Climbing shoes</span>
      </a>
    </div>
  );
}
