import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { PolardexProviders } from './providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PolardexProviders>
      <App />
    </PolardexProviders>
  </StrictMode>
);
