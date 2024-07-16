import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { DeviceContext, deviceContextDefaultValue } from './DeviceContext';
import { Header } from './components/Header/Header';
import { useOrientation } from './components/ProductList/useOrientation';
import { USE_MOCKS } from './conf';
import Landing from './pages/Landing';
import Search from './pages/Search';
import { createFetchBergfreunde } from './services/fetchBergfreunde';
import { createFetchEpicTv } from './services/fetchEpicTv';
import { createFetchOliunid } from './services/fetchOliunid';
import { createFetchVirsotne } from './services/fetchVirsotne';
import { Device, Service } from './types';
import { ANYTHING } from './utils';

function App() {
  const [availableServices, setAvailableServices] = useState<Service[]>([
    { name: 'epictv.com', fetchHandler: createFetchEpicTv, active: true },
    { name: 'oliunid.com', fetchHandler: createFetchOliunid, active: true },
    { name: 'bergfreunde.eu', fetchHandler: createFetchBergfreunde, active: true },
    { name: 'virsotne.lv', fetchHandler: createFetchVirsotne, active: true },
  ]);
  const [searchQuery, setSearchQuery] = useState<string>(ANYTHING);

  const LandingPage = (
    <Landing
      availableServices={availableServices}
      onAvailableServiceChange={handleAvailableServiceChange}
      searchQuery={searchQuery}
      onSearchQueryChange={handleSearchQueryChange}
    />
  );
  const [device, setDevice] = useState<Device>(deviceContextDefaultValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
      setDevice((device) => ({ ...device, isDesktop: true }));
    }
  }, []);

  const orientation = useOrientation();
  useEffect(() => {
    setDevice((device) => ({ ...device, orientation }));
  }, [orientation]);

  function handleAvailableServiceChange(updated: Service[]) {
    setAvailableServices(updated);
  }

  function handleSearchQueryChange(query: string) {
    setSearchQuery(query);
  }

  return (
    <DeviceContext.Provider value={device}>
      <div className={styles.app}>
        {USE_MOCKS ? <span className={styles.mocksHeader}>DEV mode with MOCKS</span> : null}
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={LandingPage} />
            <Route path="/search" element={<Search availableServices={availableServices} />} />
            <Route path="*" element={LandingPage} />
          </Routes>
        </BrowserRouter>
      </div>
    </DeviceContext.Provider>
  );
}

export default App;
