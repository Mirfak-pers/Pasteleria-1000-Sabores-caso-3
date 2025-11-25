// // src/App.test.js
// import { render } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';

// // Mock Firebase
// jest.mock('./config/firebase.js', () => ({
//   db: {},
//   auth: { currentUser: null },
//   storage: {},
//   default: {}
// }));

// // Mock UserContext
// jest.mock('./contexts/UserContext', () => ({
//   UserContext: {
//     Provider: ({ children }) => children,
//   },
//   UserProvider: ({ children }) => children
// }));

// test('renders app without crashing', () => {
//   const { container } = render(
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
  
//   // Verifica que el componente se renderice
//   expect(container).toBeInTheDocument();
// });

// test('app renders with router', () => {
//   render(
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   );
  
//   // Test básico: verifica que el body existe
//   expect(document.body).toBeTruthy();
// });