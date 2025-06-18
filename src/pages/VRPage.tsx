
import React from 'react';
import VRPageHeader from '@/components/vr/VRPageHeader';
import VRRecommendations from '@/components/vr/VRRecommendations';

const VRPage: React.FC = () => {
  const handleTemplateSelect = (template: any) => {
    console.log('Template sélectionné:', template);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <VRPageHeader />
      <VRRecommendations 
        templates={[]}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default VRPage;
