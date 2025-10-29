// src/App.jsx
import React from 'react';
import Header from './components/organisms/Header'; // Asumiendo que tienes este componente
import RouterConfig from './components/routes/RouterConfig'; // Importa tu RouterConfig actualizado
import 'bootstrap/dist/css/bootstrap.min.css'; // Si usas Bootstrap CSS
// Opcional: importa un archivo de estilos general si lo tienes
// import './App.css';

function App() {
  return (
    <div className="App">
      <Header /> {/* Tu barra de navegación */}
      <main>
        <RouterConfig /> {/* Tus rutas definidas aquí */}
      </main>
    </div>
  );
}

export default App;