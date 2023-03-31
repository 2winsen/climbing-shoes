import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Header } from './components/Header/Header';
import { USE_MOCKS } from './conf';
import Landing from './pages/Landing';
import Search from './pages/Search';

function App() {
  return (
    <div className={styles.app}>
      {USE_MOCKS ? <h5 className={styles.mocksHeader}>DEV mode with MOCKS</h5> : null}
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
