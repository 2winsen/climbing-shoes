import { LoadingItem } from './LoadingItem';
import styles from './Loading.module.scss';
import { QueryResult } from '../../types';

interface Props {
  items: QueryResult[];
}

export function Loading({
  items
}: Props) {
  return (
    <div className={styles.loading}>
      {items.map(([data, error, title]) => <LoadingItem key={title} title={title} data={data} error={error} />)}
    </div>
  )
}
