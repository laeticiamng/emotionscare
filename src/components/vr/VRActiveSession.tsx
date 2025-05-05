
import React from 'react';
import { VRSessionTemplate } from '@/types';
import VRSessionWithMusic from './VRSessionWithMusic';

interface VRActiveSessionProps {
  template: VRSessionTemplate;
  onCompleteSession: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({ template, onCompleteSession }) => {
  return (
    <VRSessionWithMusic
      template={template}
      onCompleteSession={onCompleteSession}
    />
  );
};

export default VRActiveSession;
