
import React, { useState } from 'react';
import { VRSessionTemplate } from '@/types/vr';
import VRTemplateGrid from './VRTemplateGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface VRSelectionViewProps {
  templates: VRSessionTemplate[];
  onSelect: (template: VRSessionTemplate) => void;
  title?: string;
  showSearch?: boolean;
}

export const VRSelectionView: React.FC<VRSelectionViewProps> = ({
  templates,
  onSelect,
  title = "Sessions VR",
  showSearch = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (template.tags && template.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        
        {showSearch && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                &times;
              </Button>
            )}
          </div>
        )}
      </div>
      
      <VRTemplateGrid 
        templates={filteredTemplates} 
        onSelect={onSelect} 
        filter={searchTerm}
      />
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucune session trouvée pour "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default VRSelectionView;
