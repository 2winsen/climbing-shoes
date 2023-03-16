import {
  ColDef,
  ColGroupDef
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';

import { useCallback, useMemo, useRef } from 'react';
import { Product } from '../types';
import { ProductImageCellRenderer } from './ProductImageCellRenderer';
import { SellerUrlCellRenderer } from './SellerUrlCellRenderer';

interface Props {
  products: Product[];
}

export function ProductList({ products }: Props) {
  const gridRef = useRef<AgGridReact<Product>>(null);
  const containerStyle = useMemo(() => ({ maxWidth: "900px", width: '100%', height: '100vh' }), []);
  const gridStyle = useMemo(() => ({ maxWidth: "900px", width: '100%', height: '100vh' }), []);

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => ([
    { field: 'imageUrl', sortable: false, filter: false, cellRenderer: ProductImageCellRenderer },
    { field: 'manufacturer' },
    { field: 'productName' },
    {
      field: 'price',
      maxWidth: 155,
      headerName: "Price €",
      sort: 'asc',
      valueFormatter: (param) => Number(param.value).toFixed(2),
    },
    { field: 'seller' },
    { field: 'sellerUrl', cellRenderer: SellerUrlCellRenderer },
  ]), []);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={products}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          onFirstDataRendered={onFirstDataRendered}
          rowHeight={100}
          enableCellTextSelection
        />
      </div>
    </div>
  )
}
