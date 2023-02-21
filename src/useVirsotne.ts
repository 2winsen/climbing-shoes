import { useEffect, useState } from "react";
import { Product, SearchParams } from "./types";
import { capitalize, fetchMock } from "./utils";

const FETCH_URL = "https://virsotne.lv/modules/blocklayered/blocklayered-ajax.php?layered_id_attribute_group_4344=4344_9&id_category_layered=72&layered_weight_slider=0_510&layered_price_slider=39_155&orderby=date_add&orderway=desc&asd=&_=1676913420204";

export function useVirsotne(searchParams: SearchParams) {
  const [data, setData] = useState<Product[]>();
  const [error, setError] = useState();

  useEffect(() => {
    fetchMock(FETCH_URL)
    .then(response => response.json())
    .then(data => data.productList)
    .then(productList => {
      const el = document.createElement('html');
      el.innerHTML = productList;
      const productsToBeParsed = el.getElementsByClassName("product-container");
      const products: Product[] = [];
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
          })
        }
      }
      setData(products);
    })
    .catch(error => {
      setError(error);
    })
  }, [searchParams.brand, searchParams.size])


  return [data, error];
}