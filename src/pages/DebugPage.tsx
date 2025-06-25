
import React from 'react';
import Container from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import ApiDebugPanel from '@/components/debug/ApiDebugPanel';

const DebugPage: React.FC = () => {
  return (
    <Container>
      <PageHeader 
        title="Debug Panel"
        description="Outils de débogage pour les développeurs"
      />
      <div className="space-y-6">
        <ApiDebugPanel />
      </div>
    </Container>
  );
};

export default DebugPage;
