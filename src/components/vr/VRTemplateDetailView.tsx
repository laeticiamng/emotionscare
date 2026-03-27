// @ts-nocheck
import React from 'react';
import { VRSessionTemplate } from '@/types/vr';

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart: () => void;
  onBack: () => void;
  heartRate?: number;
}
import VRTemplateDetail from './VRTemplateDetail';

interface VRTemplateDetailViewProps {
  template: VRTemplateDetailProps['template'];
  onStart: VRTemplateDetailProps['onStart'];
  onBack: VRTemplateDetailProps['onBack'];
  heartRate?: number;
}

const VRTemplateDetailView: React.FC<VRTemplateDetailViewProps> = ({ 
  template, 
  onStart, 
  onBack,
  heartRate 
}) => {
  return (
    <VRTemplateDetail 
      template={template} 
      onStart={onStart} 
      onBack={onBack}
      heartRate={heartRate}
    />
  );
};

export default VRTemplateDetailView;
