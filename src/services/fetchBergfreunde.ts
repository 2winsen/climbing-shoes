import { Product, SearchParams } from '../types';
import {
  fetchWrapper,
  htmlToElement,
  priceWithCurrencyToNumber,
  removeWww,
  startCaseLowerCase,
  withProxy,
} from '../utils';

function formatSize(size: string) {
  const isDecimal = parseFloat(size) % 1 !== 0;
  if (isDecimal) {
    return `${parseInt(size)}c5`;
  }
  return size;
}

export function createFetchBergfreunde(name: string, searchParams: SearchParams) {
  return async function (pageNumber: number) {
    const products: Product[] = [];
    let urlString = 'https://www.bergfreunde.eu/climbing-shoes/';
    if (searchParams.size) {
      urlString += `size--${formatSize(searchParams.size)}/`;
    }
    if (pageNumber > 1) {
      urlString += `${pageNumber}/`;
    }
    const url = new URL(urlString);
    const response = await fetchWrapper(withProxy(url.toString()));
    const responseText = await response.text();
    const body1Idx = responseText.indexOf('<body');
    const body2Term = '</body>';
    const body2Idx = responseText.indexOf(body2Term);
    const body = responseText.substring(body1Idx, body2Idx + body2Term.length);
    const el = htmlToElement(body);
    const pagesItems = el.querySelectorAll('[data-codecept="pagination"] a');
    const lastPageItem = pagesItems[pagesItems.length - 1]?.textContent
      ?.replace(/\s+/g, ' ')
      ?.trim()
      ?.split(' ')
      .reverse()[0];
    if (!lastPageItem) {
      console.error(`WARNING. Only first page is loaded: ${name} (might be missing products)`);
    }
    const totalPagesCount = +(lastPageItem ?? 1);
    const productsToBeParsed = el.querySelectorAll('#product-list .product-item');
    for (const product of productsToBeParsed) {
      const manufacturer = product.querySelector('.product-infobox .manufacturer-title')?.textContent;
      const productName = product.querySelectorAll('.product-infobox .product-title span')[0]?.textContent;
      const sellerUrl = product.querySelector('.product-link')?.getAttribute('href');
      const priceStr = product.querySelector('.product-price .price')?.textContent;
      const price = priceWithCurrencyToNumber(priceStr);
      const oldPrice = product.querySelector('.product-price .uvp')?.textContent;
      const imageUrl = (product.querySelector('.product-image') as HTMLElement)?.getAttribute('src');
      if (manufacturer && productName && price && imageUrl && sellerUrl) {
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
          `${manufacturer}, productName: ${productName}, price: ${price} imageUrl: ${imageUrl}, sellerUrl: ${sellerUrl}`
        );
      }
    }
    return { products, totalPagesCount };
  };
}
