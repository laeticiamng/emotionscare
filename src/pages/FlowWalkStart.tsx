import React from 'react';
import { useNavigate } from 'react-router-dom';
import PastelButton from '@/components/PastelButton';
import Shell from '@/Shell';
import { useBreathStore } from '@/store/breathSlice';

const FlowWalkStart: React.FC = () => {
  const navigate = useNavigate();
  const setFlowWalk = useBreathStore(state => state.setFlowWalk);

  const handleStart = () => {
    setFlowWalk({ start: new Date() });
    navigate('/breath/flowwalk/live');
  };

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Flow-Field Walk</h1>
        <p>Marchez 3 minutes en synchronisant votre souffle.</p>
        <PastelButton onClick={handleStart}>Commencer</PastelButton>
      </div>
    </Shell>
  );
};

export default FlowWalkStart;
