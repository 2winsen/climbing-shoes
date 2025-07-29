import { Product, SearchParams } from '../types';
import {
  fetchWrapper,
  htmlToElement,
  knownManufacturers,
  priceWithCurrencyToNumber,
  removeWww,
  startCaseLowerCase,
  withProxy,
} from '../utils';

function split(manufacturerAndProductName: string) {
  const manufacturer = knownManufacturers().find((available) =>
    manufacturerAndProductName.toLocaleLowerCase().includes(available.toLowerCase())
  );
  const productName = manufacturerAndProductName.replace(manufacturer ?? '', '').trim();
  return [manufacturer ?? manufacturerAndProductName, productName ?? manufacturerAndProductName];
}

function formatSize(size: string) {
  const isDecimal = parseFloat(size) % 1 !== 0;
  if (isDecimal) {
    return `${parseInt(size)}+½`;
  }
  return size;
}

export function createFetchOliunid(name: string, searchParams: SearchParams) {
  return async function (pageNumber: number) {
    const products: Product[] = [];
    const url = new URL('https://www.oliunid.com/eu/footwear/climbing-shoes.html');
    if (searchParams.size) {
      url.searchParams.set('taglia_scapette', formatSize(searchParams.size));
    }
    if (pageNumber > 1) {
      url.searchParams.set('p', pageNumber.toString());
    }
    // Small hack: oliunid returns nothing is we use %2B
    const urlPlusSign = url.toString().replace('%2B', '+');
    const response = await fetchWrapper(withProxy(urlPlusSign));
    const responseText = await response.text();
    const body1Idx = responseText.indexOf('<body');
    const body2Term = '</body>';
    const body2Idx = responseText.indexOf(body2Term);
    const body = responseText.substring(body1Idx, body2Idx + body2Term.length);
    const el = htmlToElement(body);
    const productsToBeParsed = el.querySelectorAll('.products.list .product-item');
    for (const product of productsToBeParsed) {
      const manufacturerAndProductName = product.querySelector('.product-item-name')?.textContent;
      const sellerUrl = product.querySelector('.product-item-name .product-item-link')?.getAttribute('href');
      const priceStr = product.querySelector('.normal-price .price')?.textContent;
      const price = priceWithCurrencyToNumber(priceStr);
      const oldPrice = product.querySelector('.old-price .price')?.textContent;
      const imageSelector = product.querySelector('.product-item-info img');
      const imageUrl = ['data-amsrc', 'data-src'].map((attr) => imageSelector?.getAttribute(attr)).find(Boolean);
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
        console.error(
          `WARNING ${name}. Insufficient product data. Can't add. Most probably product is not available.`,
          `${manufacturerAndProductName}, price: ${price} imageUrl: ${imageUrl}, sellerUrl: ${sellerUrl}`
        );
      }
    }
    // Oliunid implemented lazy load of pages navigation so we need to manually check pages (assuming there are no more than 10 pages)
    return { products, totalPagesCount: 10 };
  };
}
