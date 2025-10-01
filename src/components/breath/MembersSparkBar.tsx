// @ts-nocheck
import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Row { week: string; member_count: number; }

interface Props { data: Row[]; }

const MembersSparkBar: React.FC<Props> = ({ data }) => (
  <div style={{ width: '100%', height: 80 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <XAxis dataKey="week" hide />
        <Tooltip />
        <Bar dataKey="member_count" fill="#60a5fa" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default MembersSparkBar;
