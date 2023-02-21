import { useEffect, useState } from "react";
import { Product, SearchParams } from "./types";
import { fetchMock } from "./utils";

const FETCH_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes.html?amshopby%5Btaglia_scapette%5D%5B%5D=44&shopbyAjax=1";

export function useOliunid(searchParams: SearchParams) {
  const [data, setData] = useState<Product[]>();
  const [error, setError] = useState();

  useEffect(() => {
    fetchMock(FETCH_URL)
    .then(response => response.json())
    .then(data => data.categoryProducts)
    .then(productList => {
      const el = document.createElement('html');
      el.innerHTML = productList;
      const productsToBeParsed = el.querySelectorAll(".products.list .product-item");
      const products: Product[] = [];
      for (const product of productsToBeParsed) {
        const manufacturer = product.querySelector(".product-item-name")?.textContent;
        const productName = product.querySelector(".product-item-name")?.textContent;
        const sellerUrl = product.querySelector(".product-item-name .product-item-link")?.getAttribute("href");
        const price = product.querySelector(".price")?.textContent;
        const imageUrl = (product.querySelector(".product-item-info source") as HTMLElement)?.dataset.srcset;
        if (manufacturer && productName && price && imageUrl && sellerUrl) {
          products.push({
            imageUrl,
            manufacturer,
            productName,
            price: parseFloat(String(price).slice(1)),
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