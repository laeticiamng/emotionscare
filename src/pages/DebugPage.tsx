
import React from 'react';
import { Container } from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import ApiDebugPanel from '@/components/debug/ApiDebugPanel';

const DebugPage: React.FC = () => {
  return (
    <Container className="py-8">
      <PageHeader
        title="Debug Panel"
        description="Outils de débogage pour vérifier l'intégration backend"
      />
      
      <div className="flex justify-center mt-8">
        <ApiDebugPanel />
      </div>
    </Container>
  );
};

export default DebugPage;
