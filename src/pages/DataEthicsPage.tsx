import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import PrivacySettings from '@/components/settings/PrivacySettings';
import PersonalActivityLogs from '@/components/account/PersonalActivityLogs';
import { ShieldCheck } from 'lucide-react';

const DataEthicsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <PageHeader
          title="Données & éthique"
          description="Contrôlez vos informations et découvrez nos engagements."
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <PrivacySettings />
        <PersonalActivityLogs />
      </div>
    </DashboardLayout>
  );
};

export default DataEthicsPage;
