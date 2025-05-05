
import React from 'react';
import VRTemplateGrid from './VRTemplateGrid';
import { VRSessionTemplate } from '@/types';

interface VRSelectionViewProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
}

const VRSelectionView: React.FC<VRSelectionViewProps> = ({ templates, onSelectTemplate }) => {
  return <VRTemplateGrid templates={templates} onSelectTemplate={onSelectTemplate} />;
};

export default VRSelectionView;
