import { createContext, useContext, useReducer } from 'react';

const initialState = {
  cart: [],
  products: [],
};

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

const globalReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};