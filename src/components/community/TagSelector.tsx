
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getRecommendedTags } from '@/lib/communityService';
import { X } from 'lucide-react';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange, maxTags }) => {
  const recommendedTags = getRecommendedTags();

  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Badge key={tag} className="flex items-center gap-1 bg-primary">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-primary-foreground/80" 
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">Aucun tag sélectionné</div>
        )}
      </div>

      <div className="mt-2">
        <p className="text-sm mb-2">Tags recommandés:</p>
        <div className="flex flex-wrap gap-2">
          {recommendedTags.map((tag) => (
            <Badge 
              key={tag}
              variant="outline" 
              className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                selectedTags.includes(tag) ? 'opacity-50' : ''
              }`}
              onClick={() => handleSelectTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
