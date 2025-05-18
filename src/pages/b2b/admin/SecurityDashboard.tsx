import React from 'react';
import ComplianceTab from '@/components/dashboard/admin/tabs/ComplianceTab';
import ActivityLogsTab from '@/components/dashboard/admin/tabs/ActivityLogsTab';
import { complianceData } from '@/components/dashboard/admin/data/mockData';

const SecurityDashboardPage: React.FC = () => {
  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">Synthèse sécurité</h1>
      <ComplianceTab complianceData={complianceData} />
      <ActivityLogsTab showAll />
    </div>
  );
};

export default SecurityDashboardPage;
