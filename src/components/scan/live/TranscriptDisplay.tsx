
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <Card className="border-none bg-accent/30">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Transcription
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <p className="text-sm italic">{transcript}</p>
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
