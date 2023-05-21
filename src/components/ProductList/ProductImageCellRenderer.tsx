import { ICellRendererParams } from 'ag-grid-community';
import { Product } from '../../types';

export function ProductImageCellRenderer(props: ICellRendererParams<Product>) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={props.data?.sellerUrl}>
      <img src={props.data?.imageUrl} style={{ width: '90px' }} />
    </a>
  );
}
