
import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  isConfidential?: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, isConfidential = false }) => {
  if (!transcript) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Transcription</h3>
      <p className="p-3 bg-muted/50 rounded-md">
        {isConfidential ? '***** Contenu confidentiel *****' : transcript}
      </p>
    </div>
  );
};

export default TranscriptDisplay;
