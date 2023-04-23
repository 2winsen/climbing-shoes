import styles from './ProgressBar.module.scss';

interface Props {
  progress: number;
}

export function ProgressBar({ progress }: Props) {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar} style={{ transform: `translateX(${progress}%)` }}></div>
    </div>
  );
}
