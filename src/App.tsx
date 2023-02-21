import './App.css'
import { useVirsotne } from './useVirsotne'

function App() {
  const [data, error] = useVirsotne({ brand: "", size: 0 });
  console.log(data);

  return (
    <div className="App">
    </div>
  )
}

export default App
