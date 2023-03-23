import { flatten } from 'lodash-es';
import { Loading } from '../components/Loading/Loading';
import { Product } from '../types';
import { useEpicTv } from '../useEpicTv';
import { useOliunid } from '../useOliunid';
import { useVirsotne } from '../useVirsotne'
import { useTimeout } from '../utils';
import { ProductList } from '../components/ProductList';
import styles from './Search.module.scss';
import { useSearchParams } from 'react-router-dom';

function Search() {
  let [searchParams] = useSearchParams();
  const size = searchParams.get('size') ?? undefined;

  const queryVirsotne = useVirsotne({ size });
  // const queryOliunid = useOliunid({ size });
  // const queryEpicTv = useEpicTv({ size });
  const all = [queryVirsotne];
  const ready = all.every(([data, error]) => data || error);
  const readyTimeout = useTimeout(ready, 500);
  
  if (!readyTimeout) {
    return <Loading items={all} />
  }
  const products = flatten(
    all
      .filter(([data]) => data)
      .map(([data]) => data as Product[])
  )
  return (
    <div className={styles.search}>
      <ProductList products={products} />
    </div>
  )
}

export default Search
