import cn from 'classnames';
import styles from './Chip.module.scss';

interface Props {
  name: string;
  selected: boolean;
  onChange: (name: string) => void;
}

export function Chip(props: Props) {
  function handleClick() {
    props.onChange(props.name);
  }

  return (
    <div
      className={cn(styles.chip, {
        [styles.selected]: props.selected,
      })}
      onClick={handleClick}
    >
      {props.name}
    </div>
  );
}
