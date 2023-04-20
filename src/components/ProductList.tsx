import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';

import { useCallback, useMemo, useRef } from 'react';
import { Product } from '../types';
import { ProductImageCellRenderer } from './ProductImageCellRenderer';
import { SellerUrlCellRenderer } from './SellerUrlCellRenderer';
import { VERBOSE_LOGGING } from '../conf';
import styles from './ProductList.module.scss';

interface Props {
  products: Product[];
}

export function ProductList({ products }: Props) {
  const gridRef = useRef<AgGridReact<Product>>(null);

  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(
    () => [
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
        minWidth: 90,
        headerName: '€',
        sort: 'asc',
        valueFormatter: (param) => Number(param.value).toFixed(2),
      },
      { field: 'manufacturer', minWidth: 120, headerTooltip: 'Manufacturer' },
      { field: 'productName', headerName: 'Product', minWidth: 120 },
      {
        field: 'sellerUrl',
        headerName: 'URL',
        cellRenderer: SellerUrlCellRenderer,
        minWidth: 130,
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  const width = columnDefs.length * 8;
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, [products]);

  if (VERBOSE_LOGGING) {
    console.log(`total products: ${products.length}`);
  }

  return (
    <div className={styles.productList}>
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
    </div>
  );
}
