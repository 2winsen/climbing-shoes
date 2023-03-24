import { useEffect, useState } from "react";
import { VERBOSE_LOGGING } from "./conf";
import { Product, QueryResult, SearchParams } from "./types";
import { capitalize, fetchWrapper, knownManufacturers, withCorsProxy } from "./utils";

const NAME = "epictv.com";

function split(manufacturerAndProductName: string) {
  const manufacturer = knownManufacturers().find(available =>
    manufacturerAndProductName.toLocaleLowerCase().includes(available.toLowerCase()));
  const productName = manufacturerAndProductName.replace(manufacturer ?? "", "").trim();
  return [
    manufacturer ?? manufacturerAndProductName,
    productName ?? manufacturerAndProductName,
  ];
}

const sizeMap: Record<string, { paramValue: string }> = {
  "26": { paramValue: "7582" },
  "26-27": { paramValue: "7567" },
  "27/28": { paramValue: "7519" },
  "28": { paramValue: "7504" },
  "28-29": { paramValue: "7570" },
  "29": { paramValue: "7507" },
  "29/30": { paramValue: "7522" },
  "30": { paramValue: "7510" },
  "30-31": { paramValue: "7573" },
  "31": { paramValue: "7513" },
  "31/32": { paramValue: "7525" },
  "32": { paramValue: "7516" },
  "32-33": { paramValue: "7576" },
  "33": { paramValue: "7426" },
  "33.5": { paramValue: "7429" },
  "33/34": { paramValue: "7528" },
  "34": { paramValue: "7432" },
  "34-35": { paramValue: "7579" },
  "34.5": { paramValue: "7435" },
  "35": { paramValue: "7420" },
  "35.5": { paramValue: "7354" },
  "35/36": { paramValue: "7531" },
  "36": { paramValue: "7357" },
  "36.5": { paramValue: "7360" },
  "37": { paramValue: "7366" },
  "37.5": { paramValue: "7363" },
  "38": { paramValue: "7369" },
  "38.5": { paramValue: "7372" },
  "39": { paramValue: "7375" },
  "39.5": { paramValue: "7378" },
  "40": { paramValue: "7381" },
  "40.5": { paramValue: "7384" },
  "41": { paramValue: "7387" },
  "41.5": { paramValue: "7390" },
  "42": { paramValue: "7393" },
  "42.5": { paramValue: "7396" },
  "43": { paramValue: "7399" },
  "43.5": { paramValue: "7402" },
  "44": { paramValue: "7405" },
  "44.5": { paramValue: "7408" },
  "45": { paramValue: "7411" },
  "45.5": { paramValue: "7417" },
  "46": { paramValue: "7414" },
  "46.5": { paramValue: "7447" },
  "47": { paramValue: "7444" },
  "48": { paramValue: "7534" },
}

export function useEpicTv(searchParams: SearchParams): QueryResult {
  const [data, setData] = useState<Product[]>();
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchSinglePage(pageNumber: number) {
      const PRODUCT_LIST_LIMIT = 36;
      const products: Product[] = [];
      const url = new URL('https://epictv.com/footwear/climbing-shoes');
      if (searchParams.size) {
        const sizeMapParamValue = sizeMap[searchParams.size] ?? { paramValue: 'unknown' };
        if (searchParams.size) {
          url.searchParams.set('amshopby[shoe_size][]', sizeMapParamValue.paramValue);
        }
        url.searchParams.set('shopbyAjax', '1');
        url.searchParams.set('product_list_limit', PRODUCT_LIST_LIMIT.toString());
        if (pageNumber > 1) {
          url.searchParams.set('p', pageNumber.toString());
          url.searchParams.set('shoe_size', sizeMapParamValue.paramValue);
        }
      }
      const response = await fetchWrapper(withCorsProxy(url.toString()));
      const responseJson = await response.json();
      const { categoryProducts, productsCount } = responseJson;
      const totalPagesCount = Math.ceil((+productsCount) / PRODUCT_LIST_LIMIT);
      if (categoryProducts) {
        const el = document.createElement('html');
        el.innerHTML = categoryProducts;
        const productsToBeParsed = el.querySelectorAll(".products.list .product-item");
        for (const product of productsToBeParsed) {
          const manufacturerAndProductName = product.querySelector(".product-item-link")?.textContent;
          const sellerUrl = product.querySelector(".product-item-link")?.getAttribute("href");
          const price = product.querySelector(".price")?.textContent;
          const imageUrl = (product.querySelector(".product-image-photo") as HTMLElement)?.getAttribute("src");
          if (manufacturerAndProductName && price && imageUrl && sellerUrl) {
            const [manufacturer, productName] = split(
              manufacturerAndProductName
                .replace("Climbing Shoe", "")
                .trim()
            );
            products.push({
              imageUrl,
              manufacturer: capitalize(manufacturer),
              productName: capitalize(productName),
              price: parseFloat(String(price).slice(1)),
              sellerUrl,
              seller: new URL(sellerUrl).hostname,
            })
          } else {
            console.error(`Insufficient product data. Can't add. Most probably product is not available: ${NAME}`);
          }
        }
      }
      return { products, totalPagesCount };
    }

    async function fetchAllPages() {
      const { products = [], totalPagesCount = 1 } = await fetchSinglePage(1);
      if (totalPagesCount > 1) {
        let productsFromAllPages: Product[][] = [];
        productsFromAllPages.push(products);
        const restPages = Array(totalPagesCount)
          .fill(0)
          .map((_, idx) => idx + 1)
          .filter((_, idx) => idx !== 0)
          .map(x => fetchSinglePage(x))
        const restPagesValues = await Promise.all(restPages)
        restPagesValues.forEach(restPage => {
          productsFromAllPages.push(restPage.products);
        });
        return productsFromAllPages.flat();
      } else {
        return products;
      }
    }

    fetchAllPages()
    .then(products => {
      if (VERBOSE_LOGGING) {
        console.log(`${NAME}: ${products.length}`)
      }
      setData(products);
    })
      .catch(error => {
        console.error(error);
        setError(error);
      });
  }, [searchParams.size])


  return [data, error, NAME];
}