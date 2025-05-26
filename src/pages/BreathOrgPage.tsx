import React from 'react';
import dayjs from 'dayjs';
import Shell from '@/Shell';
import BreathHeatmap from '@/components/breath/BreathHeatmap';
import MembersSparkBar from '@/components/breath/MembersSparkBar';
import { useBreathDataStore } from '@/store/useBreathStore';

const ORG_ID = '1';

const BreathOrgPage: React.FC = () => {
  const [rows, setRows] = React.useState([]);
  const getOrg = useBreathDataStore(s => s.getOrgWeekly);

  React.useEffect(() => {
    getOrg(ORG_ID, dayjs().subtract(8, 'week')).then(setRows);
  }, [getOrg]);

  return (
    <Shell>
      <div className="space-y-6 py-4">
        <h1 className="text-2xl font-bold">Breath KPIs</h1>
        <MembersSparkBar data={rows} />
        <BreathHeatmap data={rows} />
      </div>
    </Shell>
  );
};

export default BreathOrgPage;
