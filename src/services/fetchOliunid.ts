import { Product, SearchParams } from '../types';
import {
  fetchWrapper,
  htmlToElement,
  knownManufacturers,
  priceWithCurrencyToNumber,
  removeWww,
  startCaseLowerCase,
  withCorsProxy,
} from '../utils';

function split(manufacturerAndProductName: string) {
  const manufacturer = knownManufacturers().find((available) =>
    manufacturerAndProductName.toLocaleLowerCase().includes(available.toLowerCase())
  );
  const productName = manufacturerAndProductName.replace(manufacturer ?? '', '').trim();
  return [manufacturer ?? manufacturerAndProductName, productName ?? manufacturerAndProductName];
}

export function createFetchOliunid(name: string, searchParams: SearchParams) {
  return async function (pageNumber: number) {
    const products: Product[] = [];
    const url = new URL('https://www.oliunid.com/eu/footwear/climbing-shoes.html');
    if (searchParams.size) {
      url.searchParams.set('amshopby[taglia_scapette][]', searchParams.size);
    }
    if (pageNumber > 1) {
      url.searchParams.set('p', pageNumber.toString());
    }
    const response = await fetchWrapper(withCorsProxy(url.toString()));
    const responseText = await response.text();
    const body1Idx = responseText.indexOf('<body');
    const body2Term = '</body>';
    const body2Idx = responseText.indexOf(body2Term);
    const body = responseText.substring(body1Idx, body2Idx + body2Term.length);
    const el = htmlToElement(body);
    const pagesSummaryEl = el.querySelector('.pages .items .summary')?.textContent?.split(' ').reverse()[0];
    const totalPagesCount = +(pagesSummaryEl ?? 1);
    const productsToBeParsed = el.querySelectorAll('.products.list .product-item');
    for (const product of productsToBeParsed) {
      const manufacturerAndProductName = product.querySelector('.product-item-name')?.textContent;
      const sellerUrl = product.querySelector('.product-item-name .product-item-link')?.getAttribute('href');
      const priceStr = product.querySelector('.normal-price .price')?.textContent;
      const price = priceWithCurrencyToNumber(priceStr);
      const oldPrice = product.querySelector('.old-price .price')?.textContent;
      const imageUrl = (product.querySelector('.product-item-info source') as HTMLElement)?.dataset.srcset;
      if (manufacturerAndProductName && price && imageUrl && sellerUrl) {
        const [manufacturer, productName] = split(manufacturerAndProductName.replace('climbing shoes', '').trim());
        products.push({
          imageUrl,
          manufacturer: startCaseLowerCase(manufacturer),
          productName: startCaseLowerCase(productName),
          price,
          oldPrice: priceWithCurrencyToNumber(oldPrice),
          sellerUrl,
          seller: removeWww(new URL(sellerUrl).hostname),
        });
      } else {
        console.error(`Insufficient product data. Can't add. Most probably product is not available: ${name}`);
      }
    }
    return { products, totalPagesCount };
  };
}
