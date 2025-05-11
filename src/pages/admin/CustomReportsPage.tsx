
import React from 'react';
import Shell from '@/Shell';
import ReportsDashboard from '@/components/admin/reports/ReportsDashboard';

const CustomReportsPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <ReportsDashboard />
      </div>
    </Shell>
  );
};

export default CustomReportsPage;
