import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import ReactSlider from 'react-slider';
import { Product } from '../../types';
import styles from './NumberFilter.module.scss';

export const NumberFilter = forwardRef(function NumberFilter(props: IFilterParams<Product>, ref) {
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

        const [filterValue1, filterValue2] = priceFilterValue;
        if (value >= filterValue1 && value <= filterValue2) {
          return true;
        }
        return false;
      },

      isFilterActive() {
        const [value1, value2] = priceFilterValue;
        return value1 > priceMinStep || value2 < priceMaxStep;
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null;
        }

        return { value: priceFilterValue };
      },

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      setModel(model: any) {
        setPriceFilterValue(model == null ? null : model.value);
      },
    };
  });

  function getAllRows() {
    const products: Product[] = [];
    props.api.forEachNode((node) => (node.data ? products.push(node.data) : undefined));
    return products;
  }

  const prices = getAllRows().map((x) => x.price);

  const step = 1;
  const priceMax = Math.max(...prices);
  // Max value in regard to step to be integer
  const priceMaxStep = priceMax + (step - (priceMax % step));

  const priceMin = Math.min(...prices);
  // Min value in regard to step to be integer
  const priceMinStep = priceMin + (step - (priceMin % step));

  const [priceFilterValue, setPriceFilterValue] = useState<[number, number]>([0, priceMax]);

  const changeHandler = ([value1, value2]: number[]) => {
    setPriceFilterValue([value1, value2]);
  };

  useEffect(() => {
    props.filterChangedCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceFilterValue]);

  return (
    <div className={styles.container}>
      <ReactSlider
        className={styles.horizontalSlider}
        thumbClassName={styles.horizontalSliderThumb}
        trackClassName={styles.horizontalSliderTrack}
        defaultValue={[priceMinStep, priceMaxStep]}
        min={priceMinStep}
        max={priceMaxStep}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className={styles.horizontalSliderValue}>{state.valueNow}</div>
          </div>
        )}
        pearling
        minDistance={10}
        onChange={changeHandler}
        value={priceFilterValue}
      />
    </div>
  );
});
