// ❌ EXEMPLES DE VIOLATIONS - Ces patterns déclencheront des erreurs ESLint

import React from 'react';

// Dummy function for the example
const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("data"), 1000);
  });
};

// ESLint devrait détecter ces violations des règles des hooks

export const BadComponent1 = ({ condition }: { condition: boolean }) => {
  // ❌ Hook dans un if - INTERDIT
  if (condition) {
    // const [state] = useState(0); // Uncomment to test ESLint error
  }
  return null;
};

export const BadComponent2 = () => {
  try {
    // ❌ Hook dans un try - INTERDIT  
    // const [data] = useState(null); // Uncomment to test ESLint error
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const BadComponent3 = ({ mode }: { mode: string }) => {
  switch (mode) {
    case 'active':
      // ❌ Hook dans un switch - INTERDIT
      // const [active] = useState(true); // Uncomment to test ESLint error
      break;
    default:
      break;
  }
  return null;
};

// ✅ EXEMPLES CORRECTS - Hooks au top level

export const GoodComponent1 = ({ condition }: { condition: boolean }) => {
  // ✅ Hook au top level - CORRECT
  const [state, setState] = React.useState(0);
  
  if (!condition) {
    return null;
  }
  
  return React.createElement('div', { 
    onClick: () => setState(s => s + 1) 
  }, state);
};

export const GoodComponent2 = () => {
  // ✅ Hooks au top level - CORRECT
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<any>(null);
  
  React.useEffect(() => {
    try {
      // Logique dans l'effet, pas le hook lui-même
      fetchData().then(setData).catch(setError);
    } catch (err) {
      setError(err);
    }
  }, []);
  
  if (error) {
    return React.createElement('div', null, `Erreur: ${error.message}`);
  }
  
  return React.createElement('div', null, data || 'Chargement...');
};