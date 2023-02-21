import './App.css'
import { ProductList } from './ProductList';
import { useEpicTv } from './useEpicTv';
import { useOliunid } from './useOliunid';
import { useVirsotne } from './useVirsotne'

function App() {
  const [productsVirsotne, errorVirsotne] = useVirsotne({ brand: "", size: 0 });
  const [productsOliunid, errorOliunid] = useOliunid({ brand: "", size: 0 });
  const [productsEpicTv, errorEpicTv] = useEpicTv({ brand: "", size: 0 });

  if (productsVirsotne && productsOliunid && productsEpicTv) {
    return (
      <div className="App">
        <ProductList products={[...productsVirsotne, ...productsOliunid, ...productsEpicTv]} />
      </div>
    )
  }

}

export default App
