import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MainRoutes from './Routes';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </StrictMode>
);
