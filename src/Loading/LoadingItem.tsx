import { Product } from "../types";
import { Indicator } from "./Indicator";
import styles from './LoadingItem.module.scss';

interface Props {
  data: Product[] | undefined;
  error: any;
  title: string;
}

export function LoadingItem({
  data,
  error,
  title,
}: Props) {
  let indicator: React.ReactNode = <Indicator />;
  if (data) {
    indicator = "✔️";
  } else if (error) {
    indicator = "❌";
  }
  return (
    <div className={styles.item}>
      <span className={styles.title}>{title}</span>
      <span className={styles.indicator}>{indicator}</span>
    </div>
  )
}
