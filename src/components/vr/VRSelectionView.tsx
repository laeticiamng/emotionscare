
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import VRTemplateGrid from './VRTemplateGrid';
import { VRSessionTemplate } from '@/types';

interface VRSelectionViewProps {
  templates: VRSessionTemplate[];
  onSelectTemplate: (template: VRSessionTemplate) => void;
  className?: string;
}

const VRSelectionView: React.FC<VRSelectionViewProps> = ({
  templates,
  onSelectTemplate,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher par nom, émotion ou catégorie..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        <VRTemplateGrid 
          templates={templates} 
          onSelect={onSelectTemplate}
          filter={searchTerm}
        />
      </ScrollArea>
    </div>
  );
};

export default VRSelectionView;
