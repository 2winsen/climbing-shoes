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
                  id: '7411',
                  label: '45 EU',
                  products: ['48239'],
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
    const sizeCode = {
      paramValue: '7411', // code for size 45
    };
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48239: 10 },
    });
    expect(checkIfProductIsInStock(productStockSizesJson, sizeCode)).toBeTruthy();
  });

  test('product by attribute[655] should NOT be in stock - 0', () => {
    const sizeCode = {
      paramValue: '7411', // code for size 45
    };
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48239: 0 },
    });
    expect(checkIfProductIsInStock(productStockSizesJson, sizeCode)).toBeFalsy();
  });

  test('product by attribute[655] should NOT be in stock - undefined', () => {
    const sizeCode = {
      paramValue: '7411', // code for size 45
    };
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: {},
    });
    expect(checkIfProductIsInStock(productStockSizesJson, sizeCode)).toBeFalsy();
  });

  test('product by custom attribute should be in stock', () => {
    const sizeCode = {
      paramValue: '7411', // code for size 45
    };
    const productStockSizesJson = createProductStockSizesJson({
      stockqtys: { 48239: 1 },
      customAttributeKey: 'spongebob001',
    });
    expect(checkIfProductIsInStock(productStockSizesJson, sizeCode)).toBeTruthy();
  });
});
