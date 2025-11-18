import React from 'react';
import { createRoot } from 'react-dom/client';
// Fix: Added the '.tsx' extension to be more explicit.
import App from './App.tsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    console.error("Root element with id 'root' not found.");
}