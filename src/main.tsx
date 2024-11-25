import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { PolardexProviders } from './providers';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PolardexProviders>
      <App />
    </PolardexProviders>
  </StrictMode>
);
