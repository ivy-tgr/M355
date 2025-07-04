import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme/variables.css';
import './App.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);