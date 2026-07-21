import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { Toaster } from 'react-hot-toast';

const savedTheme = localStorage.getItem('smartDelivery.theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && prefersDark));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '14px', padding: '14px 16px', color: '#0f172a' } }} />
    </BrowserRouter>
  </React.StrictMode>,
);
