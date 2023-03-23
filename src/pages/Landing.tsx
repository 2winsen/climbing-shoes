import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.scss';

function Landing() {
  const [size, setSize] = useState<string>("any");
  const navigate = useNavigate();

  function handleFind() {
    navigate({ pathname: '/search', search: `?size=${size}` });
  }

  function handleSizeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();
    setSize(value === "" ? "any" : value);
  }

  return (
    <div className={styles.landing}>
      <h1>Find cheap climbing shoes</h1>
      <form className={styles.form} onSubmit={handleFind}>
        <input type="text" placeholder="size (eu)" onChange={handleSizeChange} />
        <button onClick={handleFind}>Find</button>
      </form>
    </div>
  )
}

export default Landing
