
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getRecommendedTags } from '@/lib/communityService';

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  selectedTags, 
  setSelectedTags, 
  maxTags = 5 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load suggested tags when input changes
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const tags = await getRecommendedTags(inputValue);
        setSuggestedTags(
          tags.filter(tag => !selectedTags.includes(tag))
        );
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (inputValue.length >= 2) {
      fetchTags();
    } else {
      setSuggestedTags([]);
    }
  }, [inputValue, selectedTags]);
  
  const addTag = (tag: string) => {
    if (
      tag &&
      !selectedTags.includes(tag) &&
      selectedTags.length < maxTags
    ) {
      setSelectedTags([...selectedTags, tag]);
      setInputValue('');
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTag(inputValue.trim().toLowerCase());
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ajouter un tag${selectedTags.length >= maxTags ? ' (max atteint)' : ''}`}
            disabled={selectedTags.length >= maxTags}
          />
          
          {suggestedTags.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg p-2">
              {suggestedTags.slice(0, 5).map(tag => (
                <div
                  key={tag}
                  className="p-1 cursor-pointer hover:bg-accent rounded"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={!inputValue.trim() || selectedTags.length >= maxTags}
        >
          Ajouter
        </Button>
      </form>
    </div>
  );
};

export default TagSelector;
