import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import styles from './CheckBoxFilter.module.scss';
import { Product } from '../../types';
import { uniq } from 'lodash-es';

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

        return filter[value.toString().toLowerCase()];
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

      setModel(model: any) {
        setFilter(model == null ? null : model.value);
      },
    };
  });

  function getAllRows() {
    let products: Product[] = [];
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
    setFilter((filter) => ({ ...filter, [value.toLowerCase()]: Boolean(event.target.checked) }));
  };

  useEffect(() => {
    props.filterChangedCallback();
  }, [filter]);

  return (
    <div className={styles.checkboxList}>
      {uniqColumnValues.map((value) => (
        <div key={value} className={styles.checkboxItem}>
          <label>
            <input type="checkbox" checked={filter[value]} onChange={changeHandler(value)} />
            <span>{value}</span>
          </label>
        </div>
      ))}
    </div>
  );
});
