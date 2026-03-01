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
  return `Izmērs-${size}`;
}

export function createFetchVirsotne(name: string, searchParams: SearchParams) {
  return async function (pageNumber: number) {
    const products: Product[] = [];
    const url = new URL('https://virsotne.lv/lv/72-klinsu-kurpes');
    if (searchParams.size) {
      url.searchParams.set('q', formatSize(searchParams.size));
    }
    if (pageNumber > 1) {
      url.searchParams.set('page', pageNumber.toString());
    }
    const response = await fetchWrapper(withProxy(url.toString()));
    const responseText = await response.text();
    const body1Idx = responseText.indexOf('<body');
    const body2Term = '</body>';
    const body2Idx = responseText.indexOf(body2Term);
    const body = responseText.substring(body1Idx, body2Idx + body2Term.length);
    const el = htmlToElement(body);
    const productsToBeParsed = el.querySelectorAll('.products-grid.products article');
    for (const product of productsToBeParsed) {
      const productContent = product.querySelector('.product-content');
      const productNameRaw = productContent?.querySelector('.product-title')?.textContent;
      const manufacturer = productContent?.querySelector('.product-info')?.textContent;
      const sellerUrl = product.querySelector('a')?.getAttribute('href');
      const priceStr = productContent?.querySelector('.product-cost .current')?.textContent;
      const price = priceWithCurrencyToNumber(priceStr);
      const oldPriceStr = productContent?.querySelector('.product-cost .previous')?.textContent;
      const oldPrice = priceWithCurrencyToNumber(oldPriceStr);
      const imageSelector = product.querySelector('picture img');
      const imageUrl = imageSelector?.getAttribute('src');
      if (productNameRaw && manufacturer && price && imageUrl && sellerUrl) {
        const productName = productNameRaw
          .trim()
          .replace('Klinšu kurpes', '')
          .replace('Bērnu klinšu kurpes', '')
          .trim();
        products.push({
          imageUrl,
          manufacturer: startCaseLowerCase(manufacturer),
          productName: startCaseLowerCase(productName),
          price,
          oldPrice,
          sellerUrl,
          seller: removeWww(new URL(sellerUrl).hostname),
        });
      } else {
        console.error(
          `WARNING ${name}. Insufficient product data. Can't add. Most probably product is not available.`,
          `${manufacturer}, ${productNameRaw}, price: ${price} imageUrl: ${imageUrl}, sellerUrl: ${sellerUrl}`
        );
      }
    }
    // Let's assume there are never more than 10 pages for easy of implementation
    return { products, totalPagesCount: 10 };
  };
}
