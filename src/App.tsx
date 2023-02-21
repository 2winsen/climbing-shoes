import './App.css'
import { ProductList } from './ProductList';
import { useOliunid } from './useOliunid';
import { useVirsotne } from './useVirsotne'

function App() {
  const [productsVirsotne, errorVirsotne] = useVirsotne({ brand: "", size: 0 });
  const [productsOliunid, errorOliunid] = useOliunid({ brand: "", size: 0 });

  if (productsVirsotne && productsOliunid) {
    return (
      <div className="App">
        <ProductList products={[...productsVirsotne, ...productsOliunid]} />
      </div>
    )
  }

}

export default App
