
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TranscriptDisplayProps {
  text: string;
  isPartial?: boolean;
  className?: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  text, 
  isPartial = false,
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState<string>(text);

  // Animate typing effect for partial transcripts
  useEffect(() => {
    if (isPartial && text) {
      setDisplayText('');
      let index = 0;
      const timer = setInterval(() => {
        setDisplayText(prev => prev + text.charAt(index));
        index++;
        if (index >= text.length) {
          clearInterval(timer);
        }
      }, 50);
      
      return () => clearInterval(timer);
    } else {
      setDisplayText(text);
    }
  }, [text, isPartial]);

  if (!text) return null;

  return (
    <Card className={`p-3 bg-muted/50 ${className}`}>
      <p className="text-sm leading-relaxed">
        {displayText}
        {isPartial && <span className="animate-pulse">▋</span>}
      </p>
      {isPartial && (
        <p className="text-xs text-muted-foreground mt-1 italic">
          Transcription en cours...
        </p>
      )}
    </Card>
  );
};

export default TranscriptDisplay;
