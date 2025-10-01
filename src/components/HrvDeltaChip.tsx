// @ts-nocheck
import React from 'react';

interface HrvDeltaChipProps {
  delta: number;
}

export const HrvDeltaChip: React.FC<HrvDeltaChipProps> = ({ delta }) => {
  const sign = delta >= 0 ? '+' : '';
  return (
    <span className="px-2 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
      {sign}{delta} RMSSD
    </span>
  );
};

export default HrvDeltaChip;
