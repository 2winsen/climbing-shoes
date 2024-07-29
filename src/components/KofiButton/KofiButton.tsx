import styles from './KofiButton.module.scss';

interface Props {
  title: string;
  userId: string;
}

export function KofiButton({ userId, title }: Props) {
  return (
    <a
      className={styles.kofiButton}
      title="Support me on ko-fi.com"
      style={{ backgroundColor: '#29abe0' }}
      href={`https://ko-fi.com/${userId}`}
      target="_blank"
      rel="noreferrer"
    >
      {' '}
      <span className={styles.kofiText}>
        <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" className={styles.kofiImg} />
        {title}
      </span>
    </a>
  );
}
