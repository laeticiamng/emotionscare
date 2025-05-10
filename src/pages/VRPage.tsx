
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import VRPageHeader from '@/components/vr/VRPageHeader';
import VRTemplateGrid from '@/components/vr/VRTemplateGrid';
import VRTemplateDetail from '@/components/vr/VRTemplateDetail';
import VRSessionView from '@/components/vr/VRSessionView';
import VRSessionWithMusic from '@/components/vr/VRSessionWithMusic';
import VRActiveSession from '@/components/vr/VRActiveSession';
import VRSessionStats from '@/components/vr/VRSessionStats';
import VREmotionRecommendation from '@/components/vr/VREmotionRecommendation';
import { useVRSession } from '@/hooks/useVRSession';
import { VRSessionTemplate } from '@/types';
import { calculateAverageHeartRateReduction, calculateTotalMinutes } from '@/utils/vrUtils';
import { useToast } from '@/hooks/use-toast';

// Import des données simulées pour la démo
import { mockVRTemplatesData } from '@/data/mockVRTemplates';

const VRPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [templates, setTemplates] = useState<VRSessionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<VRSessionTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { 
    session,
    activeTemplate,
    isSessionActive,
    heartRate = { before: 80, after: 70 },
    isLoading: sessionLoading,
    startSession,
    completeSession
  } = useVRSession();
  
  // Charger les templates et les sessions
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Dans une application réelle, ces données viendraient d'une API
        // Pour l'instant, on utilise des données simulées
        setTemplates(mockVRTemplatesData);
        setSessions([
          { date: new Date().toISOString(), duration_seconds: 300, heart_rate_before: 85, heart_rate_after: 72 },
          { date: new Date(Date.now() - 86400000).toISOString(), duration_seconds: 600, heart_rate_before: 90, heart_rate_after: 75 }
        ]);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données VR:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les expériences VR",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  const handleSelectTemplate = (template: VRSessionTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("detail");
  };
  
  const handleBack = () => {
    setSelectedTemplate(null);
    setActiveTab("discover");
  };
  
  const handleStartSession = () => {
    if (!selectedTemplate) return;
    
    startSession(selectedTemplate);
    setActiveTab("session");
    
    toast({
      title: "Session démarrée",
      description: `Votre session "${selectedTemplate.title || selectedTemplate.theme}" a commencé`
    });
  };
  
  const handleCompleteSession = async () => {
    await completeSession();
    setActiveTab("stats");
  };
  
  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
        <span className="text-muted-foreground">Chargement des expériences VR...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <VRPageHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="discover" disabled={isSessionActive}>
            Découvrir
          </TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedTemplate || isSessionActive}>
            Détail
          </TabsTrigger>
          <TabsTrigger value="session" disabled={!isSessionActive}>
            Session en cours
          </TabsTrigger>
          <TabsTrigger value="stats">
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6">
          <VREmotionRecommendation emotion="calm" />
          <VRTemplateGrid templates={templates} onSelectTemplate={handleSelectTemplate} />
        </TabsContent>
        
        <TabsContent value="detail">
          {selectedTemplate && (
            <VRTemplateDetail
              template={selectedTemplate}
              heartRate={heartRate.before}
              onStartSession={handleStartSession}
              onBack={handleBack}
            />
          )}
        </TabsContent>
        
        <TabsContent value="session">
          {activeTemplate && (
            activeTemplate.is_audio_only ? (
              <VRSessionWithMusic
                template={activeTemplate}
                onCompleteSession={handleCompleteSession}
                onSessionComplete={handleCompleteSession}
                isAudioOnly={activeTemplate.is_audio_only}
                audioUrl={activeTemplate.audio_url || ''}
                emotion={activeTemplate.recommended_mood || 'calm'}
              />
            ) : (
              <VRSessionView
                template={activeTemplate}
                onCompleteSession={handleCompleteSession}
              />
            )
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {activeTemplate ? (
                <VRActiveSession
                  template={activeTemplate}
                  onComplete={handleCompleteSession}
                />
              ) : (
                <div className="p-8 bg-muted rounded-lg text-center">
                  <p>Aucune session VR active actuellement</p>
                </div>
              )}
            </div>
            <div>
              <VRSessionStats
                lastSession={sessions[0]}
                totalSessions={sessions.length}
                totalMinutes={calculateTotalMinutes(sessions)}
                averageHeartRateReduction={calculateAverageHeartRateReduction(sessions)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VRPage;
