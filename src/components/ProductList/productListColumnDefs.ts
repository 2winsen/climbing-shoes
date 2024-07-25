import { ColDef, ValueGetterParams } from 'ag-grid-community';
import { Product } from '../../types';
import { CheckBoxFilter } from './CheckBoxFilter';
import { NumberFilter } from './NumberFilter';
import { PriceCellRenderer } from './PriceCellRenderer';
import { ProductImageCellRenderer } from './ProductImageCellRenderer';
import { SellerUrlCellRenderer } from './SellerUrlCellRenderer';

function sellerUrlValueGetter(params: ValueGetterParams<Product>) {
  return params.data?.seller;
}

const wrapTextCellStyle = { whiteSpace: 'normal', lineHeight: 1.8, paddingTop: '0.4em' };

export const produceListColumnDefs: ColDef[] = [
  {
    field: 'imageUrl',
    headerName: 'Image',
    sortable: false,
    filter: false,
    cellRenderer: ProductImageCellRenderer,
    minWidth: 130,
  },
  {
    field: 'price',
    minWidth: 100,
    headerName: '€',
    sort: 'asc',
    cellRenderer: PriceCellRenderer,
    filter: NumberFilter,
    cellStyle: wrapTextCellStyle,
  },
  {
    field: 'manufacturer',
    minWidth: 120,
    headerTooltip: 'Manufacturer',
    filter: CheckBoxFilter,
    cellStyle: wrapTextCellStyle,
  },
  {
    field: 'productName',
    headerName: 'Model',
    tooltipField: 'productName',
    autoHeight: true,
    minWidth: 120,
    filterParams: { filterOptions: ['contains'] },
    cellStyle: wrapTextCellStyle,
  },
  {
    field: 'sellerUrl',
    headerName: 'URL',
    cellRenderer: SellerUrlCellRenderer,
    cellRendererParams: {
      field: 'seller',
    },
    valueGetter: sellerUrlValueGetter,
    minWidth: 130,
    filter: CheckBoxFilter,
  },
];
