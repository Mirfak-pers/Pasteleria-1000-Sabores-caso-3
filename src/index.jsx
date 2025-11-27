import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext'; // Importa el proveedor global
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider> {/* Envuelve App con GlobalProvider */}
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
);