import cn from 'classnames';
import { ChangeEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceContext } from '../DeviceContext';
import { Chip } from '../components/Chip/Chip';
import { Service } from '../types';
import { ANYTHING } from '../utils';
import styles from './Landing.module.scss';

interface Props {
  availableServices: Service[];
  onAvailableServiceChange: (updated: Service[]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

function Landing({ availableServices, onAvailableServiceChange, searchQuery, onSearchQueryChange }: Props) {
  const { isDesktop, orientation } = useContext(DeviceContext);
  const isMobileLandScape = !isDesktop && orientation === 'landscape';

  const navigate = useNavigate();

  function handleFind() {
    navigate({ pathname: '/search', search: `?q=${searchQuery}` });
  }

  function handleSearchQueryChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    onSearchQueryChange(value === '' ? ANYTHING : value);
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
      <form className={styles.form} onSubmit={handleFind}>
        <div className={styles.formInner}>
          <input
            type="search"
            placeholder="Search for your next shoes"
            onChange={handleSearchQueryChange}
            value={searchQuery === ANYTHING ? '' : searchQuery}
          />
          <button type="submit" className={styles.inlineButton}>
            🔎
          </button>
        </div>
        <a
          className={styles.referLink}
          href="https://www.digitalocean.com/?refcode=94d4e01d1f0a&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
        >
          <img
            src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%202.svg"
            alt="DigitalOcean Referral Badge"
          />
        </a>
      </form>
    </div>
  );
}

export default Landing;
