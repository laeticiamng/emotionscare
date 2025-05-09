
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mic } from 'lucide-react';

export interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  if (!transcript) return null;
  
  return (
    <Card className="border-none bg-secondary/20">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2">
          <Mic className="h-4 w-4 mt-1 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm mb-1">Transcription</p>
            <p className="text-sm italic">{transcript}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
