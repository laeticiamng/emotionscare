
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareQuote } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  if (!transcript) return null;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Transcription</h3>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-md">
          <p className="text-sm italic">"{transcript}"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
