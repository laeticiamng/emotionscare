import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmotionResult } from '@/types/emotion';
import { Calendar, Clock } from 'lucide-react';

interface ScanHistoryViewerProps {
  history: EmotionResult[];
}

const ScanHistoryViewer: React.FC<ScanHistoryViewerProps> = ({ history }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Historique des Scans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.slice(0, 10).map((result) => (
            <div key={result.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {result.emotion === 'happy' ? '😊' : 
                   result.emotion === 'calm' ? '😌' : 
                   result.emotion === 'excited' ? '🤩' : '😐'}
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize">{result.emotion}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {result.confidence.overall.toFixed(1)}%
                </Badge>
                <p className="text-xs text-muted-foreground capitalize">{result.source}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanHistoryViewer;