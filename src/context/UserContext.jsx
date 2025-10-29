// src/contexts/UserContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial del usuario
const initialState = {
  user: null,
  // Puedes agregar más propiedades aquí si es necesario
  // isLoading: false,
  // error: null,
};

// Reducer para manejar diferentes tipos de acciones
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT_USER':
      return { ...state, user: null };
    // Puedes añadir más casos si necesitas actualizar otros campos
    default:
      return state;
  }
};

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Funciones para interactuar con el estado
  const setUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const logoutUser = () => {
    dispatch({ type: 'LOGOUT_USER' });
    // Opcional: Limpiar datos de localStorage o sessionStorage
    // localStorage.removeItem('user');
    // localStorage.removeItem('token');
  };

  // El valor que estarán disponibles para los componentes hijos
  const value = {
    user: state.user,
    setUser,
    logoutUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};