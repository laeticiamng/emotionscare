import React from 'react';
import dayjs from 'dayjs';
import Shell from '@/Shell';
import BreathSummaryCards from '@/components/breath/BreathSummaryCards';
import BreathTrendChart from '@/components/breath/BreathTrendChart';
import { useBreathDataStore } from '@/store/useBreathStore';

const BreathUserPage: React.FC = () => {
  const [rows, setRows] = React.useState([]);
  const getWeekly = useBreathDataStore(s => s.getUserWeekly);

  React.useEffect(() => {
    getWeekly(dayjs().subtract(4, 'week')).then(setRows);
  }, [getWeekly]);

  const latest = rows[rows.length - 1] || null;

  return (
    <Shell>
      <div className="space-y-6 py-4">
        <h1 className="text-2xl font-bold">Respiration</h1>
        <BreathSummaryCards data={latest} />
        <BreathTrendChart data={rows} />
      </div>
    </Shell>
  );
};

export default BreathUserPage;
