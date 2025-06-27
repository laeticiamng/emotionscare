
import React from 'react';
import EmergencyDiagnostics from '@/components/diagnostics/EmergencyDiagnostics';

const EmergencyPage: React.FC = () => {
  console.log('🚨 EmergencyPage - Rendering emergency diagnostics');
  
  return (
    <div className="min-h-screen bg-background">
      <EmergencyDiagnostics />
    </div>
  );
};

export default EmergencyPage;
