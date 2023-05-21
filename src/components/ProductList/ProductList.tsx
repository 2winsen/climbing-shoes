import { ColDef, ColGroupDef, ValueGetterParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { DeviceContext } from '../../DeviceContext';
import { VERBOSE_LOGGING } from '../../conf';
import { Product } from '../../types';
import { CheckBoxFilter } from './CheckBoxFilter';
import { NumberFilter } from './NumberFilter';
import { PriceCellRenderer } from './PriceCellRenderer';
import { ProductImageCellRenderer } from './ProductImageCellRenderer';
import styles from './ProductList.module.scss';
import { SellerUrlCellRenderer } from './SellerUrlCellRenderer';
import { useOrientation } from './useOrientation';

interface Props {
  products: Product[];
}

function sellerUrlValueGetter(params: ValueGetterParams<Product>) {
  return params.data?.seller;
}

const wrapTextCellStyle = { whiteSpace: 'normal', lineHeight: 1.8, paddingTop: '0.4em' };

export function ProductList({ products }: Props) {
  const isDesktop = useContext(DeviceContext);
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
        headerName: 'Product',
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
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      suppressMovable: true,
    }),
    []
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  if (VERBOSE_LOGGING) {
    console.log(`total products: ${products.length}`);
  }

  const orientation = useOrientation();
  useEffect(() => {
    const api = gridRef.current?.api;
    if (api) {
      api.sizeColumnsToFit();
    }
  }, [orientation]);

  return (
    <div className={styles.productList}>
      {!isDesktop ? <div className={styles.howToFilter}>**Tap and hold on header to filter.</div> : null}
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
