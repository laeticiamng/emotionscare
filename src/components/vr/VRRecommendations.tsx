
import React from 'react';
import { VRSessionTemplate } from '@/types';

export interface VRRecommendationsProps {
  templates: VRSessionTemplate[];
  currentTemplateId?: string; // Added property
  showHeading?: boolean;
  onSelect: (template: VRSessionTemplate) => void; // Added property
}

const VRRecommendations: React.FC<VRRecommendationsProps> = ({ 
  templates, 
  onSelect, 
  currentTemplateId, 
  showHeading = true 
}) => {
  return (
    <div>
      {showHeading && <h2>VR Recommendations</h2>}
      {templates.map(template => (
        <div key={template.id} onClick={() => onSelect(template)}>
          {template.name || template.title}
        </div>
      ))}
    </div>
  );
};

export default VRRecommendations;
