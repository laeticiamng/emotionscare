import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useBreathStore } from '@/store/breathSlice';
import usePedometer from '@/hooks/usePedometer';
import useBreathMic from '@/hooks/useBreathMic';
import useHRStream from '@/hooks/useHRStream';
import BreathGauge from '@/components/BreathGauge';

const FlowWalkLive: React.FC = () => {
  const navigate = useNavigate();
  const { cadence } = usePedometer();
  const { rpm } = useBreathMic();
  const { hrPre, hrv } = useHRStream();
  const setFlowWalk = useBreathStore(state => state.setFlowWalk);

  const coherence = Math.abs(cadence - rpm * 6) <= cadence * 0.1;

  useEffect(() => {
    const id = setInterval(() => {
      setFlowWalk(prev => ({ rpmSeries: [...(prev.rpmSeries || []), rpm], cadenceSeries: [...(prev.cadenceSeries || []), cadence] }));
    }, 1000);
    return () => clearInterval(id);
  }, [rpm, cadence, setFlowWalk]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/breath/flowwalk/summary');
    }, 180000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Marche en cours</h1>
        <BreathGauge coherence={coherence} />
        <div>Cadence: {cadence} spm</div>
        <div>Rythme: {rpm} rpm</div>
        <div>HRV: {hrv}</div>
        <div>HR pré: {hrPre}</div>
      </div>
    </Shell>
  );
};

export default FlowWalkLive;
