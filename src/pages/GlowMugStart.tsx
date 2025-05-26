import React from 'react';
import { useNavigate } from 'react-router-dom';
import PastelButton from '@/components/PastelButton';
import Shell from '@/Shell';

const GlowMugStart: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/breath/glowmug/live');
  };

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Glow-Pulse Mug</h1>
        <p>Respirez avec votre mug pendant 2 minutes.</p>
        <PastelButton onClick={handleStart}>Commencer</PastelButton>
      </div>
    </Shell>
  );
};

export default GlowMugStart;
