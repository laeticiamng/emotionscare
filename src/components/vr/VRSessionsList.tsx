
import React from 'react';
import { VRSessionTemplate } from '@/types/vr';

export interface VRSessionsListProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void; // Needed property
}

const VRSessionsList: React.FC<VRSessionsListProps> = ({ templates, onSelect }) => {
  return (
    <div>
      <h2>VR Sessions</h2>
      {templates.map(template => (
        <div key={template.id} onClick={() => onSelect(template)}>
          {template.name}
        </div>
      ))}
    </div>
  );
};

export default VRSessionsList;
