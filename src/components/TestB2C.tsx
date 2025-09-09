/**
 * Test simple pour /b2c
 */
import React from 'react';

const TestB2C: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Route /b2c fonctionne !
        </h1>
        <p className="text-xl text-gray-600">
          Test de la route B2C réussi
        </p>
      </div>
    </div>
  );
};

export default TestB2C;