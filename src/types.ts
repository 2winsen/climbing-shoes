export interface SearchParams {
  size?: string;
}

export interface Product {
  manufacturer: string;
  productName: string;
  price: number;
  imageUrl: string;
  sellerUrl: string;
  seller: string;
}

export type QueryResult = [Product[] | undefined, any, string];