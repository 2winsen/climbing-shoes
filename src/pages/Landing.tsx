import { redirect, useNavigate } from 'react-router-dom';
import styles from './Landing.module.scss';

function Landing() {
  const navigate = useNavigate();

  function handleFind() {
    navigate("/search");
  }

  return (
    <div className={styles.landing}>
      <h1>Find cheap climbing shoes</h1>
      <button onClick={handleFind}>Find</button>
    </div>
  )
}

export default Landing
