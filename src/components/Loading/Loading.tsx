import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MAX_WAIT } from '../../conf';
import { QueryResult } from '../../types';
import styles from './Loading.module.scss';
import { LoadingItem } from './LoadingItem';
import { ProgressBar } from './ProgressBar';

interface Props {
  items: QueryResult[];
}

export function Loading({ items }: Props) {
  const [progress, setProgress] = useState(0);
  const [searchParams] = useSearchParams();
  const searchQueryParam = searchParams.get('q');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((progress) => progress + 100 / MAX_WAIT);
    }, 1000);
    const ready = items.every(([data, error]) => data || error);
    if (ready) {
      setProgress(100);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [items]);

  return (
    <div className={styles.loading}>
      <div className={styles.searchingForLabel}>
        Searching for: <b>{searchQueryParam}</b>
      </div>
      {items.map(([data, error, title]) => (
        <LoadingItem key={title} title={title} data={data} error={error} />
      ))}
      <span className={styles.footnote}>{`*Sometimes loading might take ~${MAX_WAIT} seconds or less`}</span>
      <ProgressBar progress={progress} />
    </div>
  );
}
