import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { AuthProvider } from './lib/auth/context';
import { Router } from './router';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
);