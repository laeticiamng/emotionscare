
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, RefreshCcw, Mic, MicOff, Wand2 } from 'lucide-react';

interface CoachChatInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
  onRegenerate?: () => void;
  isLoading: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  canRegenerate?: boolean;
  className?: string;
  placeholder?: string;
}

const CoachChatInput: React.FC<CoachChatInputProps> = ({
  message,
  setMessage,
  onSend,
  onRegenerate,
  isLoading,
  onKeyDown,
  canRegenerate = false,
  className = '',
  placeholder = "Écrivez votre message..."
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // In a real implementation, we would start/stop speech recognition here
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setMessage(message + " (transcription simulée)");
        setIsRecording(false);
      }, 2000);
    }
  };

  const suggestionPrompts = [
    "Comment puis-je gérer mon stress ?",
    "J'ai besoin de motivation aujourd'hui",
    "Un exercice de respiration rapide"
  ];

  return (
    <div className={`rounded-lg border bg-background p-3 ${className}`}>
      {canRegenerate && (
        <div className="flex justify-center mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading || !onRegenerate}
            className="text-xs"
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
            Régénérer la réponse
          </Button>
        </div>
      )}

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestionPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => setMessage(prompt)}
            className="text-xs"
          >
            <Wand2 className="mr-1 h-3 w-3" />
            {prompt}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          className="resize-none pr-20"
          disabled={isLoading}
        />
        
        <div className="absolute right-1.5 bottom-1.5 flex gap-1.5">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={handleMicClick}
            title={isRecording ? "Stop recording" : "Start recording"}
            disabled={isLoading}
            data-recording={isRecording}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4 text-red-500" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={onSend}
            disabled={isLoading || message.trim() === ''}
          >
            {isLoading ? (
              <div className="loading-dots">
                <div className="bg-white"></div>
                <div className="bg-white"></div>
                <div className="bg-white"></div>
              </div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachChatInput;
