import { flatten } from 'lodash-es';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../components/Loading/Loading';
import { ProductList } from '../components/ProductList/ProductList';
import { createFetchEpicTv } from '../services/fetchEpicTv';
import { createFetchOliunid } from '../services/fetchOliunid';
import { createFetchVirsotne } from '../services/fetchVirsotne';
import { useFetch } from '../services/useFetch';
import { Product } from '../types';
import { ANY_SIZE, useTimeout } from '../utils';
import styles from './Search.module.scss';

function Search() {
  const [searchParams] = useSearchParams();
  const sizeParam = searchParams.get('size');
  const size = sizeParam === ANY_SIZE || sizeParam == null ? undefined : sizeParam;

  const fetchSearchParams = useMemo(() => ({ size }), [size]);

  const queryVirsotne = useFetch('virsotne.lv', fetchSearchParams, createFetchVirsotne);
  const queryEpicTv = useFetch('epictv.com', fetchSearchParams, createFetchEpicTv);
  const queryOliunid = useFetch('oliunid.com', fetchSearchParams, createFetchOliunid);
  const all = [queryVirsotne, queryEpicTv, queryOliunid];

  const ready = all.every(([data, error]) => data || error);
  const readyTimeout = useTimeout(ready, 800);

  if (!readyTimeout) {
    return (
      <div className={styles.loadingWrapper}>
        <Loading items={all} />
      </div>
    );
  }
  const products = flatten(all.filter(([data]) => data).map(([data]) => data as Product[]));
  return (
    <div className={styles.searchWrapper}>
      <ProductList products={products} />
    </div>
  );
}

export default Search;
