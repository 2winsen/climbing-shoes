export interface SearchParams {
  size?: string;
  model?: string;
}

export interface Product {
  manufacturer: string;
  productName: string;
  oldPrice?: number;
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

export type Orientation = 'landscape' | 'portrait';

export interface Service {
  name: string;
  fetchHandler: CreateFetchSinglePage;
  active: boolean;
}

export interface Device {
  isDesktop: boolean;
  orientation: Orientation;
}
