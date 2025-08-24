import React from 'react';
import FinalPlatformReport from '@/components/audit/FinalPlatformReport';

const FinalAuditPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-root">
      <FinalPlatformReport />
    </div>
  );
};

export default FinalAuditPage;