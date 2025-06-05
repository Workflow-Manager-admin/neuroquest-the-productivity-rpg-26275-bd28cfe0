import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React.StrictMode ensures best-practices checks and error visibility
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
