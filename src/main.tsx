import React from 'react';
import ReactDOM from 'react-dom/client';
import packageJson from '../package.json';
import App from './App';
import './index.scss';
import './variables.scss';

console.log('******************************');
console.log(`version: ${packageJson.version}`);
console.log('******************************');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
