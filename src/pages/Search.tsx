import flatten from 'lodash/flatten';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../components/Loading/Loading';
import { ProductList } from '../components/ProductList/ProductList';
import { useFetch } from '../services/useFetch';
import { Product, Service } from '../types';
import { ANY_SIZE, useTimeout } from '../utils';
import styles from './Search.module.scss';

interface Props {
  availableServices: Service[];
}

function Search({ availableServices }: Props) {
  const [searchParams] = useSearchParams();
  const sizeParam = searchParams.get('size');
  const size = sizeParam === ANY_SIZE || sizeParam == null ? undefined : sizeParam;

  const fetchSearchParams = useMemo(() => ({ size }), [size]);

  const serviceResults = availableServices
    .filter((s) => s.active)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    .map((s) => useFetch(s.name, fetchSearchParams, s.fetchHandler));
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
    <div className={styles.searchWrapper}>
      <ProductList products={products} />
    </div>
  );
}

export default Search;
