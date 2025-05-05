
import React from 'react';
import { VRSessionTemplate, VRSession } from '@/types';
import VRTemplateDetail from './VRTemplateDetail';
import VRSessionHistory from './VRSessionHistory';

interface VRTemplateDetailViewProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onStartSession?: () => void;
  onBack?: () => void;
  recentSessions?: VRSession[];
}

const VRTemplateDetailView: React.FC<VRTemplateDetailViewProps> = ({
  template,
  heartRate = 75,
  onStartSession = () => {},
  onBack = () => {},
  recentSessions = []
}) => {
  return (
    <div className="space-y-6">
      <VRTemplateDetail
        template={template}
        heartRate={heartRate}
        onStartSession={onStartSession}
        onBack={onBack}
      />
      
      <VRSessionHistory sessions={recentSessions} />
    </div>
  );
};

export default VRTemplateDetailView;
