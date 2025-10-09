import logo from './logo.svg';
import './App.css';

import RouterConfig from './components/routes/RouterConfig';
import { UserProvider } from './context/UserContext';

function App(){//agregamos userProvider para envolver la app y proporcionar el contexto de usuario

    return(
        <UserProvider>
          <Router>
            <RouterConfig />
          </Router>
        </UserProvider>) 
  }
export default App;