import { ColDef, ColGroupDef, ValueGetterParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';

import { useCallback, useContext, useMemo, useRef } from 'react';
import { Product } from '../../types';
import { ProductImageCellRenderer } from './ProductImageCellRenderer';
import { SellerUrlCellRenderer } from './SellerUrlCellRenderer';
import { VERBOSE_LOGGING } from '../../conf';
import styles from './ProductList.module.scss';
import { CheckBoxFilter } from './CheckBoxFilter';
import { NumberFilter } from './NumberFilter';
import { DeviceContext } from '../../DeviceContext';

interface Props {
  products: Product[];
}

function sellerUrlValueGetter(params: ValueGetterParams<Product>) {
  return params.data?.seller;
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
        minWidth: 100,
        headerName: '€',
        sort: 'asc',
        valueFormatter: (param) => Number(param.value).toFixed(2),
        filter: NumberFilter,
      },
      { field: 'manufacturer', minWidth: 120, headerTooltip: 'Manufacturer', filter: CheckBoxFilter },
      {
        field: 'productName',
        headerName: 'Product',
        minWidth: 120,
        filterParams: { filterOptions: ['contains'] },
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
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const isDesktop = useContext(DeviceContext);
  const howToFilterOffset = isDesktop ? 0 : 1;
  const containerStyle = useMemo(
    () => ({ width: '100%', height: `calc(100% - ${howToFilterOffset}em)` }),
    [howToFilterOffset]
  );
  const gridStyle = useMemo(
    () => ({ width: '100%', height: `calc(100% - ${howToFilterOffset}em)` }),
    [howToFilterOffset]
  );

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, [products]);

  if (VERBOSE_LOGGING) {
    console.log(`total products: ${products.length}`);
  }

  return (
    <div className={styles.productList}>
      {!isDesktop ? <div className={styles.howToFilter}>**Tap and hold on column name to filter.</div> : null}
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
