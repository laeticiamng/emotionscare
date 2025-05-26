import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import useHaptics from '@/hooks/useHaptics';

const GlowMugLive: React.FC = () => {
  const navigate = useNavigate();
  const { pattern } = useHaptics();

  useEffect(() => {
    pattern([0, 5000, 5000]);
    const timer = setTimeout(() => {
      navigate('/breath/glowmug/summary');
    }, 120000);
    return () => clearTimeout(timer);
  }, [navigate, pattern]);

  return (
    <Shell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Glow Mug</h1>
        <p>Vibration active...</p>
      </div>
    </Shell>
  );
};

export default GlowMugLive;
