import React from 'react';
import { SystemHealthDashboard } from '@/components/system/SystemHealthDashboard';

/**
 * Page de santé système avec monitoring automatique
 * Accessible via /system-health
 */
const SystemHealthPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <SystemHealthDashboard />
    </div>
  );
};

export default SystemHealthPage;
