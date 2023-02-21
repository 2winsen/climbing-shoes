import {
  ICellRendererParams
} from 'ag-grid-community';
import { Product } from './types';

export function SellerUrlCellRenderer(props: ICellRendererParams<Product>) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={props.data?.sellerUrl}>{props.data?.sellerUrl}</a>
  )
}
