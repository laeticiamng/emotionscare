
import React from 'react';
import { VRSessionTemplate, VRSession } from '@/types/vr';

export interface VRHistoryListProps {
  sessions?: VRSession[];
  onSelect: (template: VRSessionTemplate) => void;
}

const VRHistoryList: React.FC<VRHistoryListProps> = ({ sessions = [], onSelect }) => {
  return (
    <div>
      <h2>VR History</h2>
      {sessions.map(session => (
        session.template && (
          <div key={session.id} onClick={() => onSelect(session.template!)}>
            {session.template.name}
          </div>
        )
      ))}
    </div>
  );
};

export default VRHistoryList;
