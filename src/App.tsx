import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Header } from './components/Header/Header';
import { USE_MOCKS } from './conf';
import Landing from './pages/Landing';
import Search from './pages/Search';
import { useEffect, useState } from 'react';
import { DeviceContext } from './DeviceContext';

function App() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
      setIsDesktop(true);
    }
  });

  return (
    <DeviceContext.Provider value={isDesktop}>
      <div className={styles.app}>
        {USE_MOCKS ? <span className={styles.mocksHeader}>DEV mode with MOCKS</span> : null}
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </div>
    </DeviceContext.Provider>
  );
}

export default App;
