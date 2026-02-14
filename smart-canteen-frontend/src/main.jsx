import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';

console.log("Smart Canteen Frontend - Mounting...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Root element not found! Make sure <div id='root'></div> exists in index.html");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
