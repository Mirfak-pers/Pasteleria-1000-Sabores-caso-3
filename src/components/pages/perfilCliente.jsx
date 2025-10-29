// src/components/pages/perfilCliente.jsx
import React from 'react';
import { useUser } from '../../context/UserContext'; // Importa el hook

export default function PerfilCliente() {
  const { user } = useUser(); // Obtiene el usuario del contexto

  if (!user) {
    // Opcional: Redirigir al login si no hay usuario
    // return <Navigate to="/login" />;
    return <p>Debes iniciar sesión para ver tu perfil.</p>;
  }

  return (
    <div>
      <h2>Perfil del Cliente</h2>
      <p>Nombre: {user.nombre}</p>
      <p>Email: {user.email}</p>
      {/* Muestra más datos del usuario aquí */}
    </div>
  );
}