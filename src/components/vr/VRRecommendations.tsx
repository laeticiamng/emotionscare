// @ts-nocheck

import React from 'react';
import { VRSessionTemplate } from '@/types';

export interface VRRecommendationsProps {
  templates: VRSessionTemplate[];
  currentTemplateId?: string;
  showHeading?: boolean;
  onSelect: (template: VRSessionTemplate) => void;
}

const VRRecommendations: React.FC<VRRecommendationsProps> = ({ 
  templates = [], 
  onSelect, 
  currentTemplateId, 
  showHeading = true 
}) => {
  // Ensure templates is always an array
  const safeTemplates = Array.isArray(templates) ? templates : [];

  return (
    <div>
      {showHeading && <h2>VR Recommendations</h2>}
      {safeTemplates.map(template => (
        <div 
          key={template.id} 
          onClick={() => onSelect(template)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(template);
            }
          }}
          aria-label={`Sélectionner ${template.title || template.name}`}
          className="cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
        >
          {template.title || template.name}
        </div>
      ))}
      {safeTemplates.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          Aucune recommandation disponible pour le moment
        </div>
      )}
    </div>
  );
};

export default VRRecommendations;
