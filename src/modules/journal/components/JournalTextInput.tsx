/**
 * JournalTextInput - Composant de saisie texte pour le journal
 * Day 41 - Module 21: Journal UI Components
 */

import { memo, useState, useCallback, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';

interface JournalTextInputProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

/**
 * Composant de saisie de texte pour créer des entrées de journal
 */
export const JournalTextInput = memo<JournalTextInputProps>(({
  onSubmit,
  isLoading = false,
  placeholder = "Écrivez votre pensée du jour...",
  maxLength = 5000,
  className = '',
}) => {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = useCallback((value: string) => {
    if (value.length <= maxLength) {
      setText(value);
      setCharCount(value.length);
    }
  }, [maxLength]);

  const handleSubmit = useCallback(async () => {
    const trimmedText = text.trim();
    
    if (!trimmedText || isLoading) {
      return;
    }

    try {
      await onSubmit(trimmedText);
      setText('');
      setCharCount(0);
    } catch (error) {
      console.error('Erreur soumission:', error);
    }
  }, [text, isLoading, onSubmit]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter pour soumettre
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const isSubmitDisabled = !text.trim() || isLoading;
  const isNearLimit = charCount > maxLength * 0.9;

  return (
    <Card className={`journal-text-input ${className}`}>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="min-h-[120px] resize-none"
            aria-label="Saisie de journal"
            maxLength={maxLength}
          />
          
          <div className="flex items-center justify-between">
            <span 
              className={`text-xs ${
                isNearLimit 
                  ? 'text-destructive' 
                  : 'text-muted-foreground'
              }`}
              aria-live="polite"
            >
              {charCount} / {maxLength}
            </span>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Astuce : Utilisez Ctrl+Entrée pour enregistrer rapidement
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

JournalTextInput.displayName = 'JournalTextInput';

export default JournalTextInput;
