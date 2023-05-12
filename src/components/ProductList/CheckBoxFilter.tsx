import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { snakeCase, uniq } from 'lodash-es';
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Product } from '../../types';
import styles from './CheckBoxFilter.module.scss';

function toFilterValue(value: any) {
  return snakeCase(value.toString().toLowerCase());
}

export const CheckBoxFilter = forwardRef(function CheckBoxFilter(props: IFilterParams<Product>, ref) {
  const [filter, setFilter] = useState<Record<string, boolean>>({});

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams) {
        const { api, colDef, column, columnApi, context } = props;
        const { node } = params;

        const value = props.valueGetter({
          api,
          colDef,
          column,
          columnApi,
          context,
          data: node.data,
          getValue: (field) => node.data[field],
          node,
        });

        // No filter means select all
        if (Object.values(filter).every((x) => !x)) {
          return true;
        }

        return filter[toFilterValue(value)];
      },

      isFilterActive() {
        return Object.values(filter).some((x) => x);
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null;
        }

        return { value: filter };
      },

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      setModel(model: any) {
        setFilter(model == null ? null : model.value);
      },
    };
  });

  function getAllRows() {
    const products: Product[] = [];
    props.api.forEachNode((node) => (node.data ? products.push(node.data) : undefined));
    return products;
  }

  const uniqColumnValues = uniq(
    getAllRows()
      .map((x) => {
        const field: keyof Product = props.colDef.cellRendererParams?.field ?? props.colDef.field;
        return field ? x[field] : undefined;
      })
      .filter((x) => x != null) as (keyof Product)[]
  );

  const changeHandler = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFilter((filter) => ({ ...filter, [toFilterValue(value)]: Boolean(event.target.checked) }));
  };

  useEffect(() => {
    props.filterChangedCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className={styles.checkboxList}>
      {uniqColumnValues.map((value) => (
        <div key={value} className={styles.checkboxItem}>
          <label>
            <input type="checkbox" checked={filter[toFilterValue(value)] ?? false} onChange={changeHandler(value)} />
            <span>{value}</span>
          </label>
        </div>
      ))}
    </div>
  );
});
