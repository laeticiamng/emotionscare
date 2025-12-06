/**
 * JournalTextInput - Composant de saisie texte pour le journal
 * Day 41 - Module 21: Journal UI Components
 */

import { memo, useState, useCallback, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Send, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { JournalPromptCard } from './JournalPromptCard';
import type { JournalPrompt } from '@/services/journalPrompts';
import { logger } from '@/lib/logger';
import { useSpeechDictation } from '@/hooks/useSpeechDictation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface JournalTextInputProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  showPromptSuggestion?: boolean;
  currentPrompt?: JournalPrompt | null;
  onRequestNewPrompt?: () => void;
  onDismissPrompt?: () => void;
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
  showPromptSuggestion = false,
  currentPrompt = null,
  onRequestNewPrompt,
  onDismissPrompt,
}) => {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  // Speech dictation
  const handleDictationTranscript = useCallback((transcript: string) => {
    const newText = text ? `${text} ${transcript}` : transcript;
    if (newText.length <= maxLength) {
      setText(newText);
      setCharCount(newText.length);
    }
  }, [text, maxLength]);

  const dictation = useSpeechDictation({
    lang: 'fr-FR',
    onTranscript: handleDictationTranscript,
    continuous: true,
    interimResults: false,
  });

  // Show toast for dictation errors
  useCallback(() => {
    if (dictation.error) {
      const errorMessages = {
        not_supported: 'La dictée vocale n\'est pas supportée par votre navigateur',
        permission_denied: 'Permission microphone refusée',
        no_microphone: 'Aucun microphone détecté',
        transcription_error: 'Erreur lors de la transcription',
        idle: '',
      };
      const message = errorMessages[dictation.error];
      if (message) {
        toast({
          title: 'Erreur de dictée',
          description: message,
          variant: 'destructive',
        });
      }
    }
  }, [dictation.error, toast])();

  const handleUsePrompt = useCallback((promptText: string) => {
    setText(promptText);
    setCharCount(promptText.length);
    if (onDismissPrompt) onDismissPrompt();
  }, [onDismissPrompt]);

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
      logger.error('Failed to submit journal text', { error }, 'JOURNAL');
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
      {showPromptSuggestion && currentPrompt && (
        <CardHeader className="pb-4">
          <JournalPromptCard
            prompt={currentPrompt}
            onUsePrompt={handleUsePrompt}
            onDismiss={onRequestNewPrompt}
          />
        </CardHeader>
      )}
      
      <CardContent className="pt-6">
        {showPromptSuggestion && !currentPrompt && onRequestNewPrompt && (
          <Button
            variant="outline"
            className="w-full mb-4 gap-2"
            onClick={onRequestNewPrompt}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            Obtenir une suggestion d'écriture
          </Button>
        )}

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

            <div className="flex items-center gap-2">
              {dictation.supported && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dictation.isDictating
                      ? dictation.stopDictation()
                      : dictation.startDictation()
                  }
                  disabled={isLoading}
                  className={cn(
                    'gap-2 transition-colors',
                    dictation.isDictating && 'border-destructive text-destructive',
                  )}
                  aria-label={dictation.isDictating ? 'Arrêter la dictée' : 'Démarrer la dictée'}
                >
                  {dictation.isDictating ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      <span className="hidden sm:inline">Arrêter</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      <span className="hidden sm:inline">Dicter</span>
                    </>
                  )}
                </Button>
              )}

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
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
            <p>Astuce : Utilisez Ctrl+Entrée pour enregistrer rapidement</p>
            {dictation.supported && (
              <p className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                Dictée vocale disponible
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JournalTextInput.displayName = 'JournalTextInput';

export default JournalTextInput;
