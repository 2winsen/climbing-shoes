import { Indicator } from '../Loading/Indicator';
import styles from './SuspenseFallbackLoading.module.scss';

interface Props {
  title: string;
}

export function SuspenseFallbackLoading({ title }: Props) {
  return (
    <div className={styles.suspenseFallbackLoading}>
      <div className={styles.item}>
        <span className={styles.title}>{title}</span>
        <span className={styles.indicator}>
          <Indicator />
        </span>
      </div>
    </div>
  );
}
