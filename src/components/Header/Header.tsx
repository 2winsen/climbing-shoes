import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <Link to="/">
        <span className={styles.headerText}>Climbing shoes</span>
      </Link>
    </div>
  );
}
