
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QuickSuggestionsProps {
  suggestions: string[];
}

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ suggestions }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuggestionClick = (suggestion: string) => {
    const input = document.querySelector('input[placeholder*="message"]') as HTMLInputElement;
    const button = input?.closest('form')?.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (input && button) {
      input.value = suggestion;
      // Use event to trigger React state updates
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
      setTimeout(() => button.click(), 10);
    } else {
      toast({
        title: "Question posée",
        description: suggestion
      });
      // Fallback: navigate to coach chat with the question
      navigate('/coach-chat', { state: { initialQuestion: suggestion } });
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;
