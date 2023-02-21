import {
  ICellRendererParams
} from 'ag-grid-community';
import { Product } from './types';

export function ProductImageCellRenderer(props: ICellRendererParams<Product>) {
  return (
    <img src={props.data?.imageUrl} style={{width: "90px"}} />
  )
}
