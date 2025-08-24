import React from 'react';
import CompleteSystemAuditor from '@/components/audit/CompleteSystemAuditor';

const CompleteSystemAuditPage: React.FC = () => {
  return (
    <div data-testid="page-root">
      <CompleteSystemAuditor />
    </div>
  );
};

export default CompleteSystemAuditPage;