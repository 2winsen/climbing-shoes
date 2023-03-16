import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import Landing from './pages/Landing';
import Search from './pages/Search';

function App() {
  return (
    <div className={styles.app}>
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
