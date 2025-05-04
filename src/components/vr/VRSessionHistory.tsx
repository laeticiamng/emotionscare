
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VRSession } from '@/types';
import { Headphones } from 'lucide-react';

interface VRSessionHistoryProps {
  sessions: VRSession[];
}

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Impact de vos sessions précédentes</h3>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {session.is_audio_only && <Headphones className="h-4 w-4 text-purple-500" />}
                  <div>
                    <p className="font-medium">Session du {new Date(session.date).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.duration_seconds / 60} minutes
                      {session.is_audio_only && " (audio uniquement)"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Rythme cardiaque</div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-red-500">{session.heart_rate_before} bpm</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-green-500">{session.heart_rate_after} bpm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionHistory;
