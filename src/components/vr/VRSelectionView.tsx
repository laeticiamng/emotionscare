
import React from 'react';
import { VRSessionTemplate } from '@/types';
import VRTemplateGrid from './VRTemplateGrid';
import { ChatInterface } from '@/components/chat/ChatInterface';

interface VRSelectionViewProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
}

const VRSelectionView: React.FC<VRSelectionViewProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="space-y-6">
      <VRTemplateGrid
        templates={templates}
        onSelectTemplate={onSelectTemplate}
      />
      
      {/* Assistant Chat Interface */}
      <ChatInterface />
    </div>
  );
};

export default VRSelectionView;
