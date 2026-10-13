import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';
import Explorer from '../src/pages/public/Explorer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter>
      <Explorer />
    </MemoryRouter>
  </StrictMode>,
);
