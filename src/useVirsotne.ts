import { useEffect, useState } from "react";
import { Product, QueryResult, SearchParams } from "./types";
import { capitalize, fetchWrapper } from "./utils";

const sizeMap: Record<string, { paramName: string, paramValue: string }> = {
  "26": { paramName: 'layered_id_attribute_group_5493', paramValue: '5493_9' },
  "27": { paramName: 'layered_id_attribute_group_5493', paramValue: '5493_9' },
  "28": { paramName: 'layered_id_attribute_group_5494', paramValue: '5494_9' },
  "29": { paramName: 'layered_id_attribute_group_5494', paramValue: '5494_9' },
  "30": { paramName: 'layered_id_attribute_group_5495', paramValue: '5495_9' },
  "31": { paramName: 'layered_id_attribute_group_5495', paramValue: '5495_9' },
  "32": { paramName: 'layered_id_attribute_group_4815', paramValue: '4815_9' },
  "33": { paramName: 'layered_id_attribute_group_4815', paramValue: '4815_9' },
  "33.5": { paramName: 'layered_id_attribute_group_4730', paramValue: '4730_9' },
  "34": { paramName: 'layered_id_attribute_group_4367', paramValue: '4367_9' },
  "34.5": { paramName: 'layered_id_attribute_group_4512', paramValue: '4512_9' },
  "35": { paramName: 'layered_id_attribute_group_4511', paramValue: '4511_9' },
  "35.5": { paramName: 'layered_id_attribute_group_4509', paramValue: '4509_9' },
  "36": { paramName: 'layered_id_attribute_group_4377', paramValue: '4377_9' },
  "36.5": { paramName: 'layered_id_attribute_group_4510', paramValue: '4510_9' },
  "37": { paramName: 'layered_id_attribute_group_4349', paramValue: '4349_9' },
  "37.5": { paramName: 'layered_id_attribute_group_4350', paramValue: '4350_9' },
  "38": { paramName: 'layered_id_attribute_group_4340', paramValue: '4340_9' },
  "38.5": { paramName: 'layered_id_attribute_group_4341', paramValue: '4341_9' },
  "39": { paramName: 'layered_id_attribute_group_4342', paramValue: '4342_9' },
  "39.5": { paramName: 'layered_id_attribute_group_4343', paramValue: '4343_9' },
  "40": { paramName: 'layered_id_attribute_group_4344', paramValue: '4344_9' },
  "40.5": { paramName: 'layered_id_attribute_group_4345', paramValue: '4345_9' },
  "41": { paramName: 'layered_id_attribute_group_4346', paramValue: '4346_9' },
  "41.5": { paramName: 'layered_id_attribute_group_4347', paramValue: '4347_9' },
  "42": { paramName: 'layered_id_attribute_group_4330', paramValue: '4330_9' },
  "42.5": { paramName: 'layered_id_attribute_group_4335', paramValue: '4335_9' },
  "43": { paramName: 'layered_id_attribute_group_4325', paramValue: '4325_9' },
  "43.5": { paramName: 'layered_id_attribute_group_4331', paramValue: '4331_9' },
  "44": { paramName: 'layered_id_attribute_group_4326', paramValue: '4326_9' },
  "44.5": { paramName: 'layered_id_attribute_group_4327', paramValue: '4327_9' },
  "45": { paramName: 'layered_id_attribute_group_4328', paramValue: '4328_9' },
  "45.5": { paramName: 'layered_id_attribute_group_4332', paramValue: '4332_9' },
  "46": { paramName: 'layered_id_attribute_group_4329', paramValue: '4329_9' },
  "46.5": { paramName: 'layered_id_attribute_group_4348', paramValue: '4348_9' },
  "47": { paramName: 'layered_id_attribute_group_4333', paramValue: '4333_9' },
  "47.5": { paramName: 'layered_id_attribute_group_4351', paramValue: '4351_9' },
  "48": { paramName: 'layered_id_attribute_group_4334', paramValue: '4334_9' },
  "49": { paramName: 'layered_id_attribute_group_4353', paramValue: '4353_9' },
}

export function useVirsotne(searchParams: SearchParams): QueryResult {
  const [data, setData] = useState<Product[]>();
  const [error, setError] = useState();

  useEffect(() => {
    let page = 1;
    async function fetchData() {
      const products: Product[] = [];
      const url = new URL('https://virsotne.lv/modules/blocklayered/blocklayered-ajax.php?id_category_layered=72');
      if (searchParams.size) {
        const sizeMapParamValue = sizeMap[searchParams.size] ?? { paramName: 'unknown', paramValue: 'unknown' };
        url.searchParams.set(sizeMapParamValue.paramName, sizeMapParamValue.paramValue);
      }
      while (true) {
        url.searchParams.set('p', page.toString());
        const response = await fetchWrapper(url.toString());
        const responseJson = await response.json();
        const productList = responseJson.productList;
        if (!productList) {
          break;
        }
        const el = document.createElement('html');
        el.innerHTML = productList;
        const productsToBeParsed = el.getElementsByClassName("product-container");
        for (const product of productsToBeParsed) {
          const manufacturer = product.querySelector(".product-manufacturer img")?.getAttribute("title");
          const productName = product.querySelector(".product-name")?.getAttribute("title");
          const sellerUrl = product.querySelector(".product-name")?.getAttribute("href");
          const price = product.querySelector(".content_price .price")?.textContent;
          const imageUrl = product.querySelector(".product-image-container .img-responsive")?.getAttribute("src");
          if (manufacturer && productName && price && imageUrl && sellerUrl) {
            products.push({
              imageUrl,
              manufacturer: capitalize(manufacturer),
              productName: capitalize(productName.replace(/^Klin.*kurpes /g, "").trim()),
              price: parseFloat(price),
              sellerUrl,
              seller: new URL(sellerUrl).hostname,
            });
          }
        }
        page++;
      };
      return products;
    }
    fetchData()
      .then(products => {
        setData(products);
      })
      .catch(error => {
        setError(error);
      })
  }, [searchParams.size])


  return [data, error, "virsotne.lv"];
}