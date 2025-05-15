
import React from 'react';
import VRTemplateCard from './VRTemplateCard';
import { VRSessionTemplate } from '@/types/types';
import { cn } from '@/lib/utils';

export interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  filter?: string;
  className?: string;
}

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({ 
  templates, 
  onSelect,
  filter = '',
  className = ''
}) => {
  const filteredTemplates = filter
    ? templates.filter(template => 
        template.title?.toLowerCase().includes(filter.toLowerCase()) || 
        template.name?.toLowerCase().includes(filter.toLowerCase()) ||
        template.description?.toLowerCase().includes(filter.toLowerCase()) ||
        template.emotion?.toLowerCase().includes(filter.toLowerCase())
      )
    : templates;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {filteredTemplates.map(template => (
        <VRTemplateCard 
          key={template.id} 
          template={template} 
          onClick={() => onSelect(template)} 
        />
      ))}
      
      {filteredTemplates.length === 0 && (
        <div className="col-span-full py-10 text-center text-muted-foreground">
          Aucun template VR ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
};

export default VRTemplateGrid;
