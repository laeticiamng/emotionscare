// @ts-nocheck
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BreathRow } from '@/services/breathApi';

interface Props {
  data: BreathRow[];
  height?: number;
}

const BreathTrendChart: React.FC<Props> = ({ data, height = 200 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[0, 'dataMax']} aria-label="Breath KPIs" />
          <Tooltip />
          <Line type="monotone" dataKey="hrv_stress_idx" stroke="#ef4444" name="HRV" />
          <Line type="monotone" dataKey="coherence_avg" stroke="#22c55e" name="Coherence" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BreathTrendChart;
