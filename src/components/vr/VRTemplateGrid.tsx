
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import VRTemplateCard from './VRTemplateCard';
import { VRSessionTemplate } from '@/types';

interface VRTemplateGridProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
}

const VRTemplateGrid: React.FC<VRTemplateGridProps> = ({ templates, onSelectTemplate }) => {
  return (
    <>
      <Alert>
        <AlertTitle>Réduisez votre stress en 5 minutes</AlertTitle>
        <AlertDescription>
          Une pause VR peut diminuer votre niveau de stress de 20% et améliorer votre humeur.
          Choisissez un environnement ci-dessous pour commencer.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {templates.map((template) => (
          <VRTemplateCard
            key={template.template_id}
            template={template}
            onClick={onSelectTemplate}
          />
        ))}
      </div>
    </>
  );
};

export default VRTemplateGrid;
