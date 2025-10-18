// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

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
      // Essayer de trouver l'élément d'entrée avec un sélecteur plus fiable
      const input = document.querySelector('input[placeholder*="message"], input[placeholder*="Message"], input[type="text"]') as HTMLInputElement;
      const form = input?.closest('form');
      const button = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
      
      if (input && button) {
        // Définir la valeur d'entrée et déclencher l'événement de changement de React
        input.value = suggestion;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        // Utiliser un petit délai pour s'assurer que React a traité la mise à jour de l'état
        setTimeout(() => {
          button.click();
          
          toast({
            title: "Question envoyée",
            description: suggestion,
          });
          
          setTimeout(() => {
            setIsProcessing(false);
            setActiveQuestion(null);
          }, 300);
        }, 100);
      } else {
        // Solution de repli: naviguer vers le chat coach avec la question
        toast({
          title: "Redirection vers le coach",
          description: suggestion
        });
        navigate('/coach-chat', { state: { initialQuestion: suggestion } });
        setIsProcessing(false);
        setActiveQuestion(null);
      }
    } catch (error) {
      logger.error('Erreur lors du traitement de la suggestion', error as Error, 'UI');
      // S'assurer que nous réinitialisons l'état de traitement même en cas d'erreur
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande. Veuillez réessayer.",
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
            className={`text-xs transition-all duration-200 ${activeQuestion === suggestion ? 'bg-primary/10' : ''}`}
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
