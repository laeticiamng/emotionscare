import React from 'react';
import Shell from '@/Shell';
import { useBreathStore } from '@/store/breathSlice';

const GlowMugSummary: React.FC = () => {
  const { glowMug } = useBreathStore();

  React.useEffect(() => {
    console.log('glowmug_end');
  }, []);

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Résumé Glow Mug</h1>
        <div>HR post: {glowMug.hrPost}</div>
      </div>
    </Shell>
  );
};

export default GlowMugSummary;
