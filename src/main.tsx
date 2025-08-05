import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import the styles:
import '@visa/nova-styles/styles.css';
// Import your desired theme:
import '@visa/nova-styles/themes/visa-light/index.css';

// grabs the HTML element with the ID root
//The ! is a non-null assertion operator in TypeScript
ReactDOM.createRoot(document.getElementById('root')!).render(
  //Take my top-level <App /> React component, and render it inside the HTML element with ID root, using React 18’s new concurrent rendering system
  <React.StrictMode>
    <>
      <div className='background-gradient'></div>
      <App />
    </>
  </React.StrictMode>
);
