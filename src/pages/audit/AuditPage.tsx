
import React from 'react';
import AuditDashboard from '@/components/admin/AuditDashboard';
import Shell from '@/Shell';

const AuditPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto p-6">
        <AuditDashboard />
      </div>
    </Shell>
  );
};

export default AuditPage;
