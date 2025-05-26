import React from 'react';
import Shell from '@/Shell';
import { useBreathStore } from '@/store/breathSlice';
import HrvDeltaChip from '@/components/HrvDeltaChip';

const FlowWalkSummary: React.FC = () => {
  const { flowWalk } = useBreathStore();
  const coherencePct = 0; // placeholder

  React.useEffect(() => {
    // analytics placeholder
    console.log('flowwalk_end', coherencePct, flowWalk.rpmSeries.length);
  }, []);

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Résumé Flow Walk</h1>
        <HrvDeltaChip delta={flowWalk.rpmSeries.length} />
      </div>
    </Shell>
  );
};

export default FlowWalkSummary;
