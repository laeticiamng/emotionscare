import React from 'react';
import { Link } from 'react-router-dom';
import PastelButton from '@/components/PastelButton';
import Shell from '@/Shell';

const BreathHome: React.FC = () => {
  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Respirer</h1>
        <div className="flex gap-4">
          <Link to="/breath/flowwalk">
            <PastelButton>Flow-Field Walk</PastelButton>
          </Link>
          <Link to="/breath/glowmug">
            <PastelButton>Glow-Pulse Mug</PastelButton>
          </Link>
        </div>
      </div>
    </Shell>
  );
};

export default BreathHome;
