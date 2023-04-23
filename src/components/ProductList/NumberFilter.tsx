import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import styles from './NumberFilter.module.scss';
import { Product } from '../../types';
import { ChangeEvent } from 'react';

export const NumberFilter = forwardRef(function NumberFilter(props: IFilterParams<Product>, ref) {
  const [priceFilterValue, setPriceFilterValue] = useState<number>(0);

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

        if (priceFilterValue != 0 && value > priceFilterValue) {
          return false;
        }
        return true;
      },

      isFilterActive() {
        return priceFilterValue >= priceMinStep && priceFilterValue < priceMaxStep;
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null;
        }

        return { value: priceFilterValue };
      },

      setModel(model: any) {
        setPriceFilterValue(model == null ? null : model.value);
      },
    };
  });

  function getAllRows() {
    let products: Product[] = [];
    props.api.forEachNode((node) => (node.data ? products.push(node.data) : undefined));
    return products;
  }

  const prices = getAllRows().map((x) => x.price);

  const step = 10;
  const priceMax = Math.max(...prices);
  const priceMaxStep = priceMax + (step - (priceMax % step));

  const priceMin = Math.min(...prices);
  const priceMinStep = priceMin + (step - (priceMin % step));

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPriceFilterValue(Number(event.target.value));
  };

  useEffect(() => {
    props.filterChangedCallback();
  }, [priceFilterValue]);

  return (
    <div className={styles.container}>
      <div>Max price:</div>
      <input
        type="range"
        min={priceMinStep}
        max={priceMaxStep}
        value={priceFilterValue}
        step={step}
        onChange={changeHandler}
      />
      <span>{priceFilterValue}€</span>
    </div>
  );
});
