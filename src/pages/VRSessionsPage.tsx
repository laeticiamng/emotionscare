
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVRSession } from '@/hooks/useVRSession';
import VRTemplateGrid from '@/components/vr/VRTemplateGrid';
import { Separator } from '@/components/ui/separator';

const VRSessionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { templates, heartRate, recentSessions } = useVRSession("00000000-0000-0000-0000-000000000000");

  useEffect(() => {
    document.title = 'Micro-pauses VR';
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Micro-pause Immersive</h1>
          <p className="text-muted-foreground">Prenez 3–5 minutes pour vous recentrer</p>
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeft size={16} />
          Retour au tableau de bord
        </Button>
      </div>
      
      <Alert className="mb-8 border-l-4 border-l-primary">
        <AlertTitle>Mesurez l'effet de vos micro-pauses</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Votre rythme cardiaque actuel: {heartRate.before} BPM</p>
          <p>Les sessions VR réduisent en moyenne le rythme cardiaque de 8% et augmentent le bien-être général.</p>
        </AlertDescription>
      </Alert>
      
      {templates && (
        <VRTemplateGrid 
          templates={templates} 
          onSelectTemplate={(template) => {
            navigate(`/vr-sessions/${template.template_id}`);
          }} 
        />
      )}
      
      {recentSessions && recentSessions.length > 0 && (
        <>
          <Separator className="my-8" />
          <div className="mt-12">
            <h2 className="text-2xl font-medium mb-4">Historique de vos sessions</h2>
            <p className="text-muted-foreground mb-6">
              Vous avez complété {recentSessions.length} session(s) ce mois-ci
            </p>
            <div className="grid grid-cols-1 gap-4">
              {recentSessions.slice(0, 3).map((session, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.duration} minutes - Impact sur le rythme cardiaque: 
                      {session.heart_rate_before && session.heart_rate_after && 
                       ` ${Math.round(100 * (session.heart_rate_before - session.heart_rate_after) / session.heart_rate_before)}% d'amélioration`}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/vr-sessions/${session.template_id}`)}
                  >
                    Rejouer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VRSessionsPage;
