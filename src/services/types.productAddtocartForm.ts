export interface ProductAddToCartFormRoot {
  '#product_addtocart_form': ProductAddToCartForm;
}

interface ProductAddToCartForm {
  configurable: Configurable;
}

interface Configurable {
  spConfig: SpConfig;
  gallerySwitchStrategy: string;
}

export interface SpConfig {
  attributes: Attributes;
  template: string;
  currencyFormat: string;
  optionPrices: OptionPrices;
  priceFormat: PriceFormat;
  prices: Prices;
  productId: string;
  chooseText: string;
  images: Images;
  index: Index;
  salable: Salable;
  canDisplayShowOutOfStockStatus: boolean;
  stockqtys: Stockqtys;
  channel: string;
  salesChannelCode: string;
  sku: Sku;
  skus: Skus;
}

interface Attributes {
  [key: string]: SpConfigAttribute;
}

export interface SpConfigAttribute {
  id: string;
  code: string;
  label: string;
  options: SpConfigAttributeOption[];
  position: string;
  alert_products: AlertProducts;
}

export interface SpConfigAttributeOption {
  id: string;
  label: string;
  products: string[];
}

interface AlertProducts {
  [key: string]: string;
}

interface OptionPrices {
  [key: string]: string;
}

interface PriceFormat {
  pattern: string;
  precision: number;
  requiredPrecision: number;
  decimalSymbol: string;
  groupSymbol: string;
  groupLength: number;
  integerRequired: boolean;
}

interface Prices {
  baseOldPrice: Price;
  oldPrice: Price;
  basePrice: Price;
  finalPrice: Price;
}

interface Price {
  amount: number;
}

interface Images {
  [key: string]: Image;
}

interface Image {
  thumb: string;
  img: string;
  full: string;
  caption: string;
  position: string;
  isMain: boolean;
  type: string;
  videoUrl: unknown;
}

interface Index {
  [key: string]: { [key: string]: string };
}

interface Salable {
  [key: string]: { [key: string]: string[] };
}

interface Stockqtys {
  [key: string]: number;
}

interface Sku {
  [key: string]: string;
}

interface Skus {
  [key: string]: string;
}
