import React from 'react';

interface BreathGaugeProps {
  coherence: boolean;
}

export const BreathGauge: React.FC<BreathGaugeProps> = ({ coherence }) => {
  const color = coherence ? 'border-green-400' : 'border-blue-500';
  return (
    <div
      role="presentation"
      className={`w-16 h-16 rounded-full border-8 ${color} transition-colors`}
    ></div>
  );
};

export default BreathGauge;
