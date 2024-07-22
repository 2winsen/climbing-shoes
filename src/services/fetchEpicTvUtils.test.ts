import { checkIfProductIsInStock } from './fetchEpicTvUtils';
import { ProductAddToCartFormRoot, SpConfig } from './types.productAddtocartForm';

function createProductStockSizesJson({
  stockqtys,
  customAttributeKey = '655',
}: {
  stockqtys: SpConfig['stockqtys'];
  customAttributeKey?: string;
}) {
  const productStockSizesJson = {
    '#product_addtocart_form': {
      configurable: {
        spConfig: {
          attributes: {
            [customAttributeKey]: {
              id: '777',
              code: 'scarpa_shoe_size',
              label: 'Shoe Size',
              options: [
                {
                  id: '17361',
                  label: '45 EU',
                  products: ['48239'],
                },
                { id: '17337', label: '41 EU / 7 UK', products: ['48248'] },
                {
                  id: '17340',
                  label: '41.5 EU / 7.5 UK',
                  products: ['48269'],
                },
              ],
              position: 'position1',
              alert_products: {},
            },
          } as SpConfig['attributes'],
          stockqtys,
        },
      },
    },
  } as ProductAddToCartFormRoot;
  return productStockSizesJson;
}

describe('checkIfProductIsInStock', () => {
  test('product by attribute[655] should be in stock', () => {
    const size = '45';
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48239: 10 },
    });
    expect(checkIfProductIsInStock(productStockSizesJson, size)).toBeTruthy();
  });

  test('product by attribute[655] should be in stock and NOT decimal one', () => {
    const size = '41';
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48248: 10, 48269: 0 },
    });
    expect(checkIfProductIsInStock(productStockSizesJson, size)).toBeTruthy();
  });

  test('product by attribute[655] and decimal size should be in stock', () => {
    const size = '41.5';
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48269: 10, 48248: 0 },
    });
    expect(checkIfProductIsInStock(productStockSizesJson, size)).toBeTruthy();
  });

  test('product by attribute[655] should NOT be in stock - 0', () => {
    const size = '45';
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48239: 0 },
    });
    expect(checkIfProductIsInStock(productStockSizesJson, size)).toBeFalsy();
  });

  test('product by attribute[655] should NOT be in stock - undefined', () => {
    const size = '45';
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: {},
    });
    expect(checkIfProductIsInStock(productStockSizesJson, size)).toBeFalsy();
  });

  test('product by custom attribute should be in stock', () => {
    const size = '45';
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48239: 1 },
      customAttributeKey: 'spongebob001',
    });
    expect(checkIfProductIsInStock(productStockSizesJson, size)).toBeTruthy();
  });
});
