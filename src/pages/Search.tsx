import flatten from 'lodash/flatten';
import { lazy, Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../components/Loading/Loading';
import { SuspenseFallbackLoading } from '../components/SuspenseFallbackLoading/SuspenseFallbackLoading';
import { useFetch } from '../services/useFetch';
import { Product, SearchParams, Service } from '../types';
import { parseSearchQueryParam, useTimeout } from '../utils';
import styles from './Search.module.scss';
// import { ProductList } from '../components/ProductList/ProductList';
const ProductList = lazy(() => import('../components/ProductList/ProductList'));

interface Props {
  availableServices: Service[];
}

function Search({ availableServices }: Props) {
  const [searchParams] = useSearchParams();
  const searchQueryParam = searchParams.get('q');
  const memoizedParams: SearchParams = useMemo(() => parseSearchQueryParam(searchQueryParam), [searchQueryParam]);

  const serviceResults = availableServices
    .filter((s) => s.active)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    .map((s) => useFetch(s.name, memoizedParams, s.fetchHandler));
  const ready = serviceResults.every(([data, error]) => data || error);
  const readyTimeout = useTimeout(ready, 800);

  if (!readyTimeout) {
    return (
      <div className={styles.loadingWrapper}>
        <Loading items={serviceResults} />
      </div>
    );
  }
  const products = flatten(serviceResults.filter(([data]) => data).map(([data]) => data as Product[]));
  return (
    <Suspense fallback={<SuspenseFallbackLoading title="Rendering results..." />}>
      <div className={styles.searchWrapper}>
        <ProductList products={products} />
      </div>
    </Suspense>
  );
}

export default Search;
