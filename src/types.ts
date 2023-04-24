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

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type QueryResult = [Product[] | undefined, any, string];

export type CreateFetchSinglePage = (
  name: string,
  searchParams: SearchParams
) => (page: number) => Promise<{ products: Product[]; totalPagesCount: number }>;
