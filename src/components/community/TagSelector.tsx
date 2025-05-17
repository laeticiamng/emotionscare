
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { getRecommendedTags } from '@/lib/communityService';

export interface TagSelectorProps {
  selectedTags: string[];
  maxTags?: number;
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  recommendedTags?: string[];
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 5,
  placeholder = "Ajouter un tag...",
  recommendedTags = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showRecommended, setShowRecommended] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (recommendedTags && recommendedTags.length > 0) {
      setRecommendations(recommendedTags);
    } else {
      // Load recommended tags if none provided
      const loadRecommendations = async () => {
        try {
          const tags = await getRecommendedTags();
          setRecommendations(tags || []);
        } catch (error) {
          console.error('Failed to load tag recommendations', error);
          setRecommendations([]);
        }
      };
      
      loadRecommendations();
    }
  }, [recommendedTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setShowRecommended(true);
    } else {
      setShowRecommended(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return;
    
    const formattedTag = tag.trim().toLowerCase();
    
    if (
      selectedTags.includes(formattedTag) ||
      selectedTags.length >= maxTags
    ) {
      return;
    }
    
    const newTags = [...selectedTags, formattedTag];
    onTagsChange?.(newTags);
    setInputValue('');
    setShowRecommended(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    onTagsChange?.(newTags);
  };

  const filteredRecommendations = inputValue
    ? recommendations.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedTags.includes(tag.toLowerCase())
      )
    : [];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="py-1 px-3">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {selectedTags.length < maxTags && (
          <div className="relative w-full">
            <div className="flex items-center">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => handleAddTag(inputValue)}
                  className="absolute right-2 text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {showRecommended && filteredRecommendations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 p-2 bg-background border rounded-md shadow-md">
                <div className="text-xs text-muted-foreground mb-2">Suggestions :</div>
                <div className="flex flex-wrap gap-1">
                  {filteredRecommendations.slice(0, 5).map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        {selectedTags.length} / {maxTags} tags utilisés
      </div>
    </div>
  );
};

export default TagSelector;
