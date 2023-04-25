import { ICellRendererParams } from 'ag-grid-community';
import { Product } from '../../types';
import styles from './PriceCellRenderer.module.scss';

export function PriceCellRenderer(props: ICellRendererParams<Product>) {
  const price = props.data?.price;
  const oldPrice = props.data?.oldPrice;

  function format(value: number | undefined) {
    return value ? Number(value).toFixed(2) : undefined;
  }

  return (
    <>
      <div>{format(price)}</div>
      {oldPrice ? <div className={styles.oldPrice}>{format(oldPrice)}</div> : null}
    </>
  );
}
