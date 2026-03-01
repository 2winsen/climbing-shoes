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
  return `productSize[0]=${size}&sizeScale=1`;
}

export function createFetchBike24(name: string, searchParams: SearchParams) {
  return async function (pageNumber: number) {
    const SHOP_URL = 'https://www.bike24.com';
    const products: Product[] = [];
    const url = new URL(`${SHOP_URL}/climbing-shoes.html`);
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
    const productsToBeParsed = el.querySelectorAll('.product-tile-list__grid .product-tile');
    for (const product of productsToBeParsed) {
      const productContent = product.querySelector('.product-tile__content-wrapper');
      const productNameRaw = productContent?.querySelector('.product-tile__name')?.textContent;
      const manufacturerRaw = productContent?.querySelector('.product-tile__brand')?.textContent;
      const productLink = product.querySelector('.product-tile__anchor')?.getAttribute('href');
      const sellerUrl = `${SHOP_URL}/${productLink}`;
      const priceStr = productContent?.querySelector('.product-tile-price__value')?.textContent;
      const price = priceWithCurrencyToNumber(priceStr);
      const oldPriceStr = productContent?.querySelector('.product-tile-comparison-price__value')?.textContent;
      const oldPrice = priceWithCurrencyToNumber(oldPriceStr);
      const imageSelector = product.querySelector('img');
      const imageUrl = imageSelector?.getAttribute('src');
      if (productNameRaw && manufacturerRaw && price && imageUrl && sellerUrl) {
        // NIAD VCS Climbing Shoes Men - Core Black / Core Black / Cloud White
        const productName = productNameRaw.trim().split('Climbing Shoes')[0].trim();
        const manufacturer = manufacturerRaw.trim();
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
          `${manufacturerRaw}, ${productNameRaw}, price: ${price} imageUrl: ${imageUrl}, sellerUrl: ${sellerUrl}`
        );
      }
    }
    // Let's assume there are never more than 10 pages for easy of implementation
    return { products, totalPagesCount: 10 };
  };
}
