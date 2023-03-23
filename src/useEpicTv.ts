import { useEffect, useState } from "react";
import { Product, QueryResult, SearchParams } from "./types";
import { capitalize, fetchWrapper, knownManufacturers, withCorsProxy } from "./utils";


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
    const url = new URL('https://epictv.com/footwear/climbing-shoes');
    if (searchParams.size) {
      const sizeMapParamValue = sizeMap[searchParams.size] ?? { paramValue: 'unknown' };
      url.searchParams.set('amshopby[shoe_size][]', sizeMapParamValue.paramValue);
      url.searchParams.set('shopbyAjax', '1');
    }
    fetch(withCorsProxy(url.toString()))
      .then(response => response.json())
      .then(data => data.categoryProducts)
      .then(productList => {
        const el = document.createElement('html');
        el.innerHTML = productList;
        const productsToBeParsed = el.querySelectorAll(".products.list .product-item");
        const products: Product[] = [];
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
          }
        }
        setData(products);
      })
      .catch(error => {
        setError(error);
      })
  }, [searchParams.size])


  return [data, error, "epictv.com"];
}