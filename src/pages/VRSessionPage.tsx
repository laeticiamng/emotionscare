
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Heart, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { mockVRTemplates } from '@/data/mockData';
import type { VRSessionTemplate, VRSession } from '@/types';
import { useToast } from '@/hooks/use-toast';

const VRSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<VRSessionTemplate | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [heartRate, setHeartRate] = useState({ before: 82, after: null as number | null });
  const [recentSessions, setRecentSessions] = useState<VRSession[]>([]);
  
  // Load templates from mock data
  const availableTemplates = mockVRTemplates;

  // Handle template selection
  const handleSelectTemplate = (template: VRSessionTemplate) => {
    setSelectedTemplate(template);
    setSessionTimeRemaining(template.duration);
    // Reset heart rate tracking
    setHeartRate({ before: Math.floor(75 + Math.random() * 15), after: null });
  };

  // Handle session start
  const handleStartSession = () => {
    if (!selectedTemplate) return;
    
    toast({
      title: "Session VR démarrée",
      description: `Profitez de votre session de ${selectedTemplate.duration} minutes.`,
    });
    
    setIsSessionActive(true);
    
    // Simulate session completion after duration
    setTimeout(() => {
      handleCompleteSession();
    }, 5000); // Shortened for demo purposes (normally would be template.duration * 60 * 1000)
  };
  
  // Handle session completion
  const handleCompleteSession = () => {
    if (!selectedTemplate) return;
    
    // Simulate heart rate decrease after relaxation
    const afterHeartRate = Math.max(60, heartRate.before - Math.floor(5 + Math.random() * 10));
    setHeartRate({ ...heartRate, after: afterHeartRate });
    
    // Create a new session record
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: 'current-user',
      date: new Date().toISOString(),
      duration_seconds: selectedTemplate.duration * 60,
      location_url: selectedTemplate.preview_url,
      heart_rate_before: heartRate.before,
      heart_rate_after: afterHeartRate
    };
    
    // Update recent sessions
    setRecentSessions([newSession, ...recentSessions]);
    
    setIsSessionActive(false);
    
    toast({
      title: "Session VR terminée",
      description: `Votre rythme cardiaque a diminué de ${heartRate.before - afterHeartRate} bpm.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Micro-pauses VR</h1>
          <p className="text-muted-foreground">
            Accordez-vous un moment de détente immersive
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Button>
      </div>
      
      {isSessionActive ? (
        /* Active Session View */
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4 text-center">
              <h2 className="text-xl font-semibold">{selectedTemplate?.theme}</h2>
              
              <div className="relative rounded-xl overflow-hidden border border-muted">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={selectedTemplate?.preview_url} 
                    alt={selectedTemplate?.theme}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-6xl font-semibold tracking-wider mb-4">5:00</div>
                      <p className="text-white/80">Session en cours...</p>
                    </div>
                  </div>
                </AspectRatio>
              </div>
              
              <Button 
                onClick={handleCompleteSession}
                className="mt-4"
              >
                Terminer la session
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : selectedTemplate ? (
        /* Template Details View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={selectedTemplate.preview_url} 
                      alt={selectedTemplate.theme}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                  </AspectRatio>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold">{selectedTemplate.theme}</h2>
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{selectedTemplate.duration} minutes</span>
                    </div>
                    <Button 
                      className="mt-4 flex items-center" 
                      onClick={handleStartSession}
                    >
                      <Play className="h-4 w-4 mr-2" /> Démarrer la session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-2">Bénéfices</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                      <span>Réduction du stress</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                      <span>Amélioration de la concentration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                      <span>Récupération mentale</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Suivi santé</h3>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Rythme cardiaque: {heartRate.before} bpm</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Retour aux templates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {recentSessions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Impact de vos sessions précédentes</h3>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Session du {new Date(session.date).toLocaleDateString('fr-FR')}</p>
                          <p className="text-sm text-muted-foreground">{session.duration_seconds / 60} minutes</p>
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
          )}
        </div>
      ) : (
        /* Template Selection View */
        <>
          <Alert>
            <AlertTitle>Réduisez votre stress en 5 minutes</AlertTitle>
            <AlertDescription>
              Une pause VR peut diminuer votre niveau de stress de 20% et améliorer votre humeur.
              Choisissez un environnement ci-dessous pour commencer.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {availableTemplates.map((template) => (
              <Card 
                key={template.template_id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="p-0">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={template.preview_url}
                      alt={template.theme}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                  </AspectRatio>
                  <div className="p-4">
                    <h3 className="font-medium">{template.theme}</h3>
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{template.duration} minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VRSessionPage;
