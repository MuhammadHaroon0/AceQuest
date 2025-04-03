import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import ScrollToTop from './utils/ScrollToTop.ts';
import CustomSnackbarProvider from './utils/SnackbarStyles.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <ScrollToTop />
    <CustomSnackbarProvider>
      <App />
    </CustomSnackbarProvider>

  </BrowserRouter>
  // </StrictMode >,
)
