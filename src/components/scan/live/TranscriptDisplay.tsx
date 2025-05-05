
import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  if (!transcript) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Transcription</h3>
      <p className="p-3 bg-muted/50 rounded-md">{transcript}</p>
    </div>
  );
};

export default TranscriptDisplay;
