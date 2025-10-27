import React from 'react';
import Home from './pages/Home';
import './styles/global.css';
import { Analytics } from '@vercel/analytics/react';

/**
 * Composant App principal
 */
function App() {
  return (
    <>
      <Home />
      <Analytics />
    </>
  );
}

export default App;
