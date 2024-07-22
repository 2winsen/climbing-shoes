import cn from 'classnames';
import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceContext } from '../DeviceContext';
import { Chip } from '../components/Chip/Chip';
import { Service } from '../types';
import { ANYTHING } from '../utils';
import InfoPanel from './InfoPanel';
import styles from './Landing.module.scss';

interface Props {
  availableServices: Service[];
  onAvailableServiceChange: (updated: Service[]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

function Landing({ availableServices, onAvailableServiceChange, searchQuery, onSearchQueryChange }: Props) {
  const { isDesktop, orientation } = useContext(DeviceContext);
  const [infoPanelActive, setInfoPanelActive] = useState(false);
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

  function toggleInfoPanel() {
    setInfoPanelActive((active) => !active);
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
          <button type="button" className={styles.infoButton} title="Info Button" onClick={toggleInfoPanel}>
            <svg fill="#000000" fillRule="nonzero" viewBox="-1 0 19 19" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="10" r="6" fill="#fff" />
              <path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zM9.64 5.78a1.136 1.136 0 1 0-1.136 1.135A1.136 1.136 0 0 0 9.64 5.781zm-.344 2.884a.792.792 0 1 0-1.583 0v5.203a.792.792 0 0 0 1.583 0z" />
            </svg>
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
      {infoPanelActive ? <InfoPanel onClick={toggleInfoPanel} targetClassName={styles.infoButton} /> : null}
    </div>
  );
}

export default Landing;
