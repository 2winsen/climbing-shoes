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
import { useEffect, useState } from 'react';

function Search() {
  let [searchParams] = useSearchParams();
  const [size] = useState<number>(() => {
    const sizeInt = parseInt(searchParams.get('size') ?? "", 10);
    return isNaN(sizeInt) ? 0 : sizeInt;
  });

  const queryV = useVirsotne({ size });
  const queryO = useOliunid({ size });
  const queryE = useEpicTv({ size });
  const all = [queryV, queryO, queryE];
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
