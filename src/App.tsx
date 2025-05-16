
import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  return <AppRouter />;
}

export default App;
