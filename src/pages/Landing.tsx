import cn from 'classnames';
import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceContext } from '../DeviceContext';
import { Chip } from '../components/Chip/Chip';
import { Service } from '../types';
import { ANY_SIZE } from '../utils';
import styles from './Landing.module.scss';

interface Props {
  availableServices: Service[];
  onAvailableServiceChange: (updated: Service[]) => void;
}

function Landing({ availableServices, onAvailableServiceChange }: Props) {
  const { isDesktop, orientation } = useContext(DeviceContext);
  const isMobileLandScape = !isDesktop && orientation === 'landscape';
  const [size, setSize] = useState<string>(ANY_SIZE);
  const navigate = useNavigate();

  function handleFind() {
    navigate({ pathname: '/search', search: `?size=${size}` });
  }

  function handleSizeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();
    setSize(value === '' ? ANY_SIZE : value);
  }

  function handleServiceChange(name: string) {
    const updated = availableServices.map((s) => {
      if (s.name === name) {
        return { ...s, active: !s.active };
      }
      return s;
    });
    onAvailableServiceChange(updated);
  }

  return (
    <div
      className={cn(styles.landing, {
        [styles.mobileLandscape]: isMobileLandScape,
      })}
    >
      <div className={styles.servicesSelector}>
        {availableServices.map((s) => (
          <Chip key={s.name} name={s.name} selected={s.active} onChange={handleServiceChange} />
        ))}
      </div>
      <div className={styles.heading}>Find cheap climbing shoes</div>
      <form className={styles.form} onSubmit={handleFind}>
        <input type="text" placeholder="size (eu)" onChange={handleSizeChange} />
        <button onClick={handleFind}>Find</button>
      </form>
    </div>
  );
}

export default Landing;
