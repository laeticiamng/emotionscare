
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QuickSuggestionsProps {
  suggestions: string[];
}

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ suggestions }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setActiveQuestion(suggestion);
    
    try {
      // Try to find the input element with a more reliable selector
      const input = document.querySelector('input[placeholder*="message"], input[placeholder*="Message"]') as HTMLInputElement;
      const form = input?.closest('form');
      const button = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
      
      if (input && button) {
        // Set input value and trigger React's change event
        input.value = suggestion;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        // Use a short timeout to ensure React has processed the state update
        setTimeout(() => {
          button.click();
          setIsProcessing(false);
          setActiveQuestion(null);
        }, 50);
      } else {
        // Fallback: navigate to coach chat with the question
        toast({
          title: "Question posée",
          description: suggestion
        });
        navigate('/coach-chat', { state: { initialQuestion: suggestion } });
        setIsProcessing(false);
        setActiveQuestion(null);
      }
    } catch (error) {
      console.error('Error processing suggestion:', error);
      // Ensure we reset processing state even on error
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande",
        variant: "destructive"
      });
      setIsProcessing(false);
      setActiveQuestion(null);
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
            className={`text-xs ${activeQuestion === suggestion ? 'bg-primary/10' : ''}`}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isProcessing}
            aria-busy={isProcessing && activeQuestion === suggestion}
          >
            {suggestion}
            {isProcessing && activeQuestion === suggestion && (
              <span className="ml-1 animate-pulse">...</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;
