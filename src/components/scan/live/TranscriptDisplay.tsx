// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  if (!transcript) return null;
  
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-3">
        <p className="text-sm font-medium mb-1">Transcript:</p>
        <p className="text-sm italic">{transcript}</p>
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
