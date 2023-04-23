import { flatten } from 'lodash-es';
import { Loading } from '../components/Loading/Loading';
import { Product } from '../types';
import { ANY_SIZE, useTimeout } from '../utils';
import { ProductList } from '../components/ProductList/ProductList';
import styles from './Search.module.scss';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../services/useFetch';
import { createFetchVirsotne } from '../services/fetchVirsotne';
import { createFetchEpicTv } from '../services/fetchEpicTv';
import { createFetchOliunid } from '../services/fetchOliunid';

function Search() {
  let [searchParams] = useSearchParams();
  const sizeParam = searchParams.get('size');
  const size = sizeParam === ANY_SIZE || sizeParam == null ? undefined : sizeParam;

  const queryVirsotne = useFetch('virsotne.lv', { size }, createFetchVirsotne);
  const queryEpicTv = useFetch('epictv.com', { size }, createFetchEpicTv);
  const queryOliunid = useFetch('oliunid.com', { size }, createFetchOliunid);
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
