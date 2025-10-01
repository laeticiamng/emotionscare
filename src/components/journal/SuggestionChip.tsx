// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuggestionChipProps {
  suggestion?: string;
  className?: string;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({
  suggestion,
  className,
}) => {
  const navigate = useNavigate();

  if (!suggestion) return null;

  const handleClick = () => {
    // Parse suggestion to route to appropriate module
    if (suggestion.toLowerCase().includes('silk')) {
      navigate('/screen-silk');
    } else if (suggestion.toLowerCase().includes('glow')) {
      navigate('/flash-glow'); 
    } else if (suggestion.toLowerCase().includes('vr')) {
      navigate('/vr-galaxy');
    } else {
      // Default to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-lg">
        <div>
          <div className="text-xs font-medium text-primary mb-1">
            Suggestion
          </div>
          <div className="text-sm text-gray-700">
            {suggestion}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClick}
          className="text-primary hover:text-primary/80 flex-shrink-0"
          aria-label={`Suivre la suggestion: ${suggestion}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};