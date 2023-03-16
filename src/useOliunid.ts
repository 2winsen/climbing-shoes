import { useEffect, useState } from "react";
import { Product, QueryResult, SearchParams } from "./types";
import { capitalize, fetchMock, knownManufacturers } from "./utils";


const FETCH_URL = "https://www.oliunid.com/eu/footwear/climbing-shoes.html?amshopby%5Btaglia_scapette%5D%5B%5D=44&shopbyAjax=1";

function split(manufacturerAndProductName: string) {
  const manufacturer = knownManufacturers().find(available =>
    manufacturerAndProductName.toLocaleLowerCase().includes(available.toLowerCase()));
  const productName = manufacturerAndProductName.replace(manufacturer ?? "", "").trim();
  return [
    manufacturer ?? manufacturerAndProductName,
    productName ?? manufacturerAndProductName,
  ];
}

export function useOliunid(searchParams: SearchParams): QueryResult {
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
          const manufacturerAndProductName = product.querySelector(".product-item-name")?.textContent;
          const sellerUrl = product.querySelector(".product-item-name .product-item-link")?.getAttribute("href");
          const price = product.querySelector(".price")?.textContent;
          const imageUrl = (product.querySelector(".product-item-info source") as HTMLElement)?.dataset.srcset;
          if (manufacturerAndProductName && price && imageUrl && sellerUrl) {
            const [manufacturer, productName] = split(
              manufacturerAndProductName
                .replace("climbing shoes", "")
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
          }
        }
        setData(products);
      })
      .catch(error => {
        setError(error);
      })
  }, [searchParams.brand, searchParams.size])


  return [data, error, "oliunid.com"];
}