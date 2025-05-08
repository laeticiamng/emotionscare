
import React from 'react';
import { VRSessionTemplate } from '@/types';
import VRSessionWithMusic from './VRSessionWithMusic';

interface VRActiveSessionProps {
  template: VRSessionTemplate;
  onComplete: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({ template, onComplete }) => {
  return (
    <VRSessionWithMusic
      template={template}
      onCompleteSession={onComplete}
    />
  );
};

export default VRActiveSession;
