
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VRSessionsList from '@/components/vr/VRSessionsList';
import VRSessionPlayer from '@/components/vr/VRSessionPlayer';
import VRRecommendations from '@/components/vr/VRRecommendations';
import VRHistoryList from '@/components/vr/VRHistoryList';
import { VRSessionTemplate } from '@/types/vr';
import { useVRSession } from '@/hooks/useVRSession';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft } from 'lucide-react';

// Import from the correct export name
import { mockVRTemplates } from '@/data/mockVRTemplates';

const VRPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'discover';
  const isMobile = useIsMobile();
  
  const [activeTemplate, setActiveTemplate] = useState<VRSessionTemplate | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { startSession, completeSession } = useVRSession('user-id'); // Pass a userId
  
  // Effect to load recommended template if specified in URL
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = mockVRTemplates.find(t => t.id === templateId);
      if (template) {
        setActiveTemplate(template);
      }
    }
  }, [searchParams]);
  
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  
  const handleSelectTemplate = (template: VRSessionTemplate) => {
    setActiveTemplate(template);
    setIsPlaying(false);
  };
  
  const handleStartSession = () => {
    if (activeTemplate) {
      startSession(activeTemplate);
      setIsPlaying(true);
    }
  };
  
  const handleEndSession = () => {
    if (activeTemplate) {
      completeSession();
      setIsPlaying(false);
    }
  };
  
  const handleBackToList = () => {
    setActiveTemplate(null);
    setIsPlaying(false);
  };
  
  if (isPlaying && activeTemplate) {
    return (
      <VRSessionPlayer 
        template={activeTemplate}
        onComplete={handleEndSession}
      />
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      {activeTemplate ? (
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={handleBackToList}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{activeTemplate.title}</h2>
            <p className="text-muted-foreground mb-6">{activeTemplate.description}</p>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                {activeTemplate.preview_url && !activeTemplate.is_audio_only && (
                  <div className="rounded-lg overflow-hidden bg-muted aspect-video mb-4">
                    <img 
                      src={activeTemplate.preview_url} 
                      alt={activeTemplate.title || ''} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Durée</h4>
                    <p>{activeTemplate.duration} min</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Catégorie</h4>
                    <p className="capitalize">{activeTemplate.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Difficulté</h4>
                    <p className="capitalize">{activeTemplate.difficulty}</p>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Bénéfices</h4>
                    <p>{(activeTemplate.benefits || []).join(', ')}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <Button 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={handleStartSession}
                >
                  Commencer la session
                </Button>
                
                {activeTemplate.tags && activeTemplate.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeTemplate.tags.map((tag) => (
                        <div key={tag} className="px-2 py-1 bg-secondary rounded text-xs">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Vous pourriez aussi aimer</h3>
            <VRRecommendations 
              currentTemplateId={activeTemplate.id}
              onSelect={handleSelectTemplate}
              templates={mockVRTemplates}
            />
          </div>
        </div>
      ) : (
        <Tabs defaultValue={tab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className={isMobile ? "grid w-full grid-cols-2" : "grid w-full grid-cols-3"}>
            <TabsTrigger value="discover">Découvrir</TabsTrigger>
            <TabsTrigger value="recommended">Recommandés</TabsTrigger>
            {!isMobile && <TabsTrigger value="history">Historique</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="discover">
            <VRSessionsList 
              templates={mockVRTemplates} 
              onSelect={handleSelectTemplate}
            />
          </TabsContent>
          
          <TabsContent value="recommended">
            <VRRecommendations 
              onSelect={handleSelectTemplate}
              templates={mockVRTemplates.filter(t => t.category === 'relaxation')}
              showHeading={false}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <VRHistoryList 
              onSelect={handleSelectTemplate}
              templates={[]}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default VRPage;
