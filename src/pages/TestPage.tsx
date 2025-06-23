
import React from 'react';

const TestPage: React.FC = () => {
  console.log('TestPage is rendering');
  
  return (
    <div data-testid="page-root" className="p-8 bg-red-100 min-h-screen">
      <h1 className="text-4xl font-bold text-red-800">PAGE DE TEST - VISIBLE ?</h1>
      <p className="text-xl mt-4">Si vous voyez cette page, le routage fonctionne !</p>
      <div className="mt-8 p-4 bg-white border border-red-300 rounded">
        <p>Cette page sert à tester l'affichage. Elle devrait être très visible avec un fond rouge.</p>
      </div>
    </div>
  );
};

export default TestPage;
