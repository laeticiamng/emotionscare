
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { getRecommendedTags } from '@/lib/communityService';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: React.Dispatch<React.SetStateAction<string[]>>;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 5
}) => {
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRecommendedTags = async () => {
      setIsLoading(true);
      try {
        const tags = await getRecommendedTags();
        setSuggestedTags(tags);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendedTags();
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !selectedTags.includes(trimmedTag) &&
      selectedTags.length < maxTags
    ) {
      onTagsChange([...selectedTags, trimmedTag]);
    }
    setTagInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="px-2 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive focus:outline-none"
            >
              <X size={14} />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(tagInput.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleInputKeyDown}
            placeholder={
              selectedTags.length >= maxTags
                ? `Maximum ${maxTags} tags atteint`
                : "Ajouter un tag..."
            }
            disabled={selectedTags.length >= maxTags}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => addTag(tagInput)}
            disabled={!tagInput.trim() || selectedTags.length >= maxTags}
          >
            <Plus size={16} />
            <span className="sr-only">Add tag</span>
          </Button>
        </div>

        {showSuggestions && suggestedTags.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {suggestedTags
                .filter(
                  tag =>
                    tag.toLowerCase().includes(tagInput.toLowerCase()) &&
                    !selectedTags.includes(tag)
                )
                .slice(0, 5)
                .map((tag) => (
                  <li
                    key={tag}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {suggestedTags.slice(0, 5).map(tag => (
          <Button
            key={tag}
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => addTag(tag)}
            disabled={selectedTags.includes(tag) || selectedTags.length >= maxTags}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;
