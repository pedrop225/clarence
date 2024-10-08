import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import '@fontsource/roboto'; // Importa la fuente Roboto
import './index.css'; // Si tienes estilos globales

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);