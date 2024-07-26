import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';

import { cloneDeep } from 'lodash';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DeviceContext } from '../../DeviceContext';
import { VERBOSE_LOGGING } from '../../conf';
import { Product } from '../../types';
import styles from './ProductList.module.scss';
import { produceListColumnDefs } from './productListColumnDefs';
import { useOrientation } from './useOrientation';

interface Props {
  products: Product[];
}

function ProductList({ products }: Props) {
  const [searchParams] = useSearchParams();
  const searchQueryParam = searchParams.get('q');
  const { isDesktop } = useContext(DeviceContext);
  const gridRef = useRef<AgGridReact<Product>>(null);

  const columnDefs = useMemo(() => produceListColumnDefs, []);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      suppressMovable: true,
    }),
    []
  );

  // Calculation are necessary to fix webpage scrollbar, scrollbar shout be only in ag-grid
  const howToFilterOffsetEm = isDesktop ? 0 : '0.8em;';
  const resultsOnQueryLabelOffsetEm = '1.1em';
  const containerStyle = useMemo(
    () => ({ width: '100%', height: `calc(100% - ${howToFilterOffsetEm}em - ${resultsOnQueryLabelOffsetEm})` }),
    [howToFilterOffsetEm, resultsOnQueryLabelOffsetEm]
  );
  const gridStyle = cloneDeep(containerStyle);

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
      <div style={{ fontSize: `${resultsOnQueryLabelOffsetEm}` }}>
        Results on query: <b>{searchQueryParam}</b>
      </div>
      {!isDesktop ? (
        <div className={styles.howToFilter} style={{ fontSize: `${howToFilterOffsetEm}` }}>
          **Tap and hold on header to filter.
        </div>
      ) : null}
      <div style={containerStyle}>
        <div className="ag-theme-alpine" style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={products}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onFirstDataRendered={onFirstDataRendered}
            rowHeight={100}
            enableCellTextSelection
          />
        </div>
      </div>
    </div>
  );
}

export default ProductList;
