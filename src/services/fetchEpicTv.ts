import { USE_MOCKS } from '../conf';
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
import { checkIfProductIsInStock } from './fetchEpicTvUtils';

function split(manufacturerAndProductName: string) {
  const manufacturer = knownManufacturers().find((available) =>
    manufacturerAndProductName.toLocaleLowerCase().includes(available.toLowerCase())
  );
  const productName = manufacturerAndProductName.replace(manufacturer ?? '', '').trim();
  return [manufacturer ?? manufacturerAndProductName, productName ?? manufacturerAndProductName];
}

const sizeMap: Record<string, { paramValue: string }> = {
  '26': { paramValue: '7582' },
  '26-27': { paramValue: '7567' },
  '27/28': { paramValue: '7519' },
  '28': { paramValue: '7504' },
  '28-29': { paramValue: '7570' },
  '29': { paramValue: '7507' },
  '29/30': { paramValue: '7522' },
  '30': { paramValue: '7510' },
  '30-31': { paramValue: '7573' },
  '31': { paramValue: '7513' },
  '31/32': { paramValue: '7525' },
  '32': { paramValue: '7516' },
  '32-33': { paramValue: '7576' },
  '33': { paramValue: '7426' },
  '33.5': { paramValue: '7429' },
  '33/34': { paramValue: '7528' },
  '34': { paramValue: '7432' },
  '34-35': { paramValue: '7579' },
  '34.5': { paramValue: '7435' },
  '35': { paramValue: '7420' },
  '35.5': { paramValue: '7354' },
  '35/36': { paramValue: '7531' },
  '36': { paramValue: '7357' },
  '36.5': { paramValue: '7360' },
  '37': { paramValue: '7366' },
  '37.5': { paramValue: '7363' },
  '38': { paramValue: '7369' },
  '38.5': { paramValue: '7372' },
  '39': { paramValue: '7375' },
  '39.5': { paramValue: '7378' },
  '40': { paramValue: '7381' },
  '40.5': { paramValue: '7384' },
  '41': { paramValue: '7387' },
  '41.5': { paramValue: '7390' },
  '42': { paramValue: '7393' },
  '42.5': { paramValue: '7396' },
  '43': { paramValue: '7399' },
  '43.5': { paramValue: '7402' },
  '44': { paramValue: '7405' },
  '44.5': { paramValue: '7408' },
  '45': { paramValue: '7411' },
  '45.5': { paramValue: '7417' },
  '46': { paramValue: '7414' },
  '46.5': { paramValue: '7447' },
  '47': { paramValue: '7444' },
  '48': { paramValue: '7534' },
};

export function createFetchEpicTv(name: string, searchParams: SearchParams) {
  return async function (pageNumber: number) {
    const PRODUCT_LIST_LIMIT = 36;
    const products: Product[] = [];
    const url = new URL('https://epictv.com/footwear/climbing-shoes');
    if (searchParams.size) {
      const sizeMapParamValue = sizeMap[searchParams.size] ?? {
        paramValue: 'unknown',
      };
      url.searchParams.set('shoe_size', sizeMapParamValue.paramValue);
    }
    url.searchParams.set('product_list_limit', PRODUCT_LIST_LIMIT.toString());
    if (pageNumber > 1) {
      url.searchParams.set('p', pageNumber.toString());
    }
    const response = await fetchWrapper(withProxy(url.toString()));
    const responseText = await response.text();
    const sliceStartTerm = '<body';
    const sliceStartIdx = responseText.indexOf(sliceStartTerm);
    const sliceEndTerm = '</body>';
    const sliceEndIdx = responseText.indexOf(sliceEndTerm);
    const body = responseText.substring(sliceStartIdx, sliceEndIdx + sliceEndTerm.length);
    const el = htmlToElement(body);
    const pagesItems = el.querySelectorAll('.pages li.item:not(.pages-item-next)');
    const lastPageItem = pagesItems[pagesItems.length - 1]?.textContent
      ?.replace(/\s+/g, ' ')
      ?.trim()
      ?.split(' ')
      .reverse()[0];
    const totalPagesCount = +(lastPageItem ?? 1);
    const productsToBeParsed = el.querySelectorAll('.products.list .product-item');
    for (const product of productsToBeParsed) {
      const manufacturerAndProductName = product.querySelector('.product-item-link')?.textContent;
      const sellerUrl = product.querySelector('.product-item-link')?.getAttribute('href');
      const priceStr = product.querySelector('.normal-price .price')?.textContent;
      const price = priceWithCurrencyToNumber(priceStr);
      const oldPrice = product.querySelector('.old-price .price-wrapper')?.textContent;
      const imageUrl = (product.querySelector('.product-image-photo') as HTMLElement)?.getAttribute('src');
      if (manufacturerAndProductName && price && imageUrl && sellerUrl) {
        const [manufacturer, productName] = split(manufacturerAndProductName.replace('Climbing Shoe', '').trim());
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
    if (!searchParams.size || USE_MOCKS) {
      return { products, totalPagesCount };
    }
    // Since EPIC TV has weird thing that filtered sizes in list mode are actually out of stock we have to check each shoe independently :(
    const sizeCode = sizeMap[searchParams.size];
    const everyPageUrl = products.map((p) => p.sellerUrl).map((url) => withProxy(url.toString()));
    const everyPagePromise = everyPageUrl.map(fetchWrapper);
    const productsPagesResponses = await Promise.all(everyPagePromise);
    const productsPagesTexts = await Promise.all(productsPagesResponses.map((r) => r.text()));
    const indicesWithoutSizeInStock: number[] = [];
    for (let idx = 0; idx < productsPagesTexts.length; idx++) {
      const pageText = productsPagesTexts[idx];
      const el = htmlToElement(pageText);
      const stockSizesScriptTagContents = el.querySelector(
        '.product-add-form .fieldset script[type="text/x-magento-init"]'
      ) as any;
      let stockSizesJson;
      try {
        stockSizesJson = JSON.parse(stockSizesScriptTagContents.text);
      } catch (e) {
        console.log(
          `${name}: Unable to parse available sizes for ${products[idx].sellerUrl}. Product most likely is unavailable.`
        );
        continue;
      }
      const isProductIsInStock = checkIfProductIsInStock(stockSizesJson, sizeCode);
      if (!isProductIsInStock) {
        indicesWithoutSizeInStock.push(idx);
        console.error(
          `${name}. Size ${searchParams.size} out of stock of: ${products[idx].manufacturer} ${products[idx].productName}`
        );
      }
    }
    const productsWithStockSizes = products.filter((_, idx) => !indicesWithoutSizeInStock.includes(idx));
    return { products: productsWithStockSizes, totalPagesCount };
  };
}
