import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANY_SIZE } from '../utils';
import styles from './Landing.module.scss';

function Landing() {
  const [size, setSize] = useState<string>(ANY_SIZE);
  const navigate = useNavigate();

  function handleFind() {
    navigate({ pathname: '/search', search: `?size=${size}` });
  }

  function handleSizeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();
    setSize(value === '' ? ANY_SIZE : value);
  }

  return (
    <div className={styles.landing}>
      <h2>Find cheap climbing shoes</h2>
      <form className={styles.form} onSubmit={handleFind}>
        <input type="text" placeholder="size (eu)" onChange={handleSizeChange} />
        <button onClick={handleFind}>Find</button>
      </form>
    </div>
  );
}

export default Landing;
