import { ProductAddToCartFormRoot } from './types.productAddtocartForm';

export function checkIfProductIsInStock(
  productStockSizesJson: ProductAddToCartFormRoot,
  sizeCode: { paramValue: string }
) {
  const productAddToCartForm = productStockSizesJson['#product_addtocart_form'];
  if (productAddToCartForm) {
    const spConfig = productAddToCartForm.configurable.spConfig;
    const stockqtysKeys = Object.entries(spConfig.attributes)
      .map(([, value]) => value.options.filter((o) => o.id === sizeCode.paramValue).map((o) => o.products[0]))
      .flat();
    const isQtyInStock = Object.entries(spConfig.stockqtys)
      .filter(([key]) => stockqtysKeys.includes(key))
      .filter(([, value]) => value).length;
    return isQtyInStock;
  }
}
