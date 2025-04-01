import { useEffect, useMemo, useState } from 'react';
import { VERBOSE_LOGGING } from '../conf';
import { CreateFetchSinglePage, Product, QueryResult, SearchParams } from '../types';

function filterByModel(model: string | undefined) {
  return (product: Product) => {
    if (model) {
      return `${product.manufacturer} ${product.productName}`.toUpperCase().includes(model.toUpperCase());
    }
    return true;
  };
}

export function useFetch(
  name: string,
  searchParams: SearchParams,
  createFetchSinglePage: CreateFetchSinglePage
): QueryResult {
  const [data, setData] = useState<Product[]>();
  const [error, setError] = useState<unknown>();

  const fetchSinglePage = useMemo(
    () => createFetchSinglePage(name, searchParams),
    [createFetchSinglePage, name, searchParams]
  );

  useEffect(() => {
    async function fetchAllPages() {
      const { products = [], totalPagesCount = 1 } = await fetchSinglePage(1);
      if (VERBOSE_LOGGING) {
        console.log(`${name}: Total PAGES count: ${totalPagesCount}`);
      }
      if (totalPagesCount > 1) {
        const productsFromAllPages: Product[][] = [];
        productsFromAllPages.push(products);
        const restPages = Array(totalPagesCount)
          .fill(0)
          .map((_, idx) => idx + 1)
          .filter((_, idx) => idx !== 0)
          .map((x) => fetchSinglePage(x));
        const restPagesValues = await Promise.all(restPages);
        restPagesValues.forEach((restPage) => {
          productsFromAllPages.push(restPage.products);
        });
        return productsFromAllPages.flat();
      } else {
        return products;
      }
    }

    fetchAllPages()
      .then((products) => {
        if (VERBOSE_LOGGING) {
          console.log(`${name}: Total PRODUCTS count: ${products.length}`);
        }
        setData(products.filter(filterByModel(searchParams.model)));
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [fetchSinglePage, name, searchParams.model]);

  return [data, error, name];
}
