import React from 'react';
import AppProviders from './app/providers/AppProviders';
import AppRoutes from './app/routes/AppRoutes';
import './styles/globals.css';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;