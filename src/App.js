import RouterConfig from './components/routes/RouterConfig';
import { GlobalProvider } from './context/GlobalContext'; // ✅ Cambiado a GlobalContext

function App() {
  return (
    <GlobalProvider> {/* ✅ Cambiado a GlobalProvider */}
      <RouterConfig />
    </GlobalProvider>
  );
}

export default App;