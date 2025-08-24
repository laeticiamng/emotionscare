import React from 'react';
import PlatformCompletionAuditor from '@/components/audit/PlatformCompletionAuditor';

const PlatformAuditPage: React.FC = () => {
  return (
    <div data-testid="page-root">
      <PlatformCompletionAuditor />
    </div>
  );
};

export default PlatformAuditPage;