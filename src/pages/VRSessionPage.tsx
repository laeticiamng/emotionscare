
import React from 'react';
import { useParams } from 'react-router-dom';

const VRSessionPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Session VR #{id}</h1>
      <p className="mb-4">
        Détails de la session VR. Cette page est en cours de construction.
      </p>
    </div>
  );
};

export default VRSessionPage;
