import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Intercept and suppress benign internal Monaco Editor cancellation exceptions
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = reason?.message || reason?.name || String(reason || '');
    if (msg.includes('Canceled') || reason?.name === 'Canceled') {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || event?.error?.message || '';
    if (typeof msg === 'string' && msg.includes('Canceled')) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
