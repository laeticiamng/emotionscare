
import React from 'react';
import { VRTemplateDetailProps } from '@/types/vr';
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
