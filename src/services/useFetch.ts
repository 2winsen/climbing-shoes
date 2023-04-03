import { useEffect, useState } from 'react';
import { VERBOSE_LOGGING } from '../conf';
import { CreateFetchSinglePage, Product, QueryResult, SearchParams } from '../types';

export function useFetch(
  name: string,
  searchParams: SearchParams,
  createFetchSinglePage: CreateFetchSinglePage
): QueryResult {
  const [data, setData] = useState<Product[]>();
  const [error, setError] = useState<unknown>();

  const fetchSinglePage = createFetchSinglePage(name, searchParams);

  useEffect(() => {
    async function fetchAllPages() {
      try {
        const { products = [], totalPagesCount = 1 } = await fetchSinglePage(1);
        if (totalPagesCount > 1) {
          let productsFromAllPages: Product[][] = [];
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
      } catch (e) {
        throw e;
      }
    }

    fetchAllPages()
      .then((products) => {
        if (VERBOSE_LOGGING) {
          console.log(`${name}: ${products.length}`);
        }
        setData(products);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [searchParams.size]);

  return [data, error, name];
}
