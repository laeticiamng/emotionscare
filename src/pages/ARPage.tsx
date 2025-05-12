
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import ARExperience from '@/components/ar/ARExperience';
import ARVoiceInterface from '@/components/ar/ARVoiceInterface';
import { Box, MusicIcon, Mic } from 'lucide-react';

const ARPage: React.FC = () => {
  const [emotionState, setEmotionState] = useState<string>('calm');
  const [intensityState, setIntensityState] = useState<number>(50);
  
  // Handle commands from voice interface
  const handleVoiceCommand = (command: string) => {
    console.log("Voice command received in AR Page:", command);
    
    // You can add global command handling here if needed
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <PageHeader 
        title="Réalité Augmentée"
        description="Expériences immersives pour votre bien-être émotionnel"
        icon={<Box className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <Tabs defaultValue="experience" className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              <span className="hidden sm:inline">Expérience AR</span>
              <span className="sm:hidden">AR</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Commandes vocales</span>
              <span className="sm:hidden">Voix</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <MusicIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Ambiance sonore</span>
              <span className="sm:hidden">Musique</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="experience" className="space-y-6">
            <ARExperience 
              emotion={emotionState}
              intensity={intensityState}
            />
          </TabsContent>
          
          <TabsContent value="voice">
            <ARVoiceInterface 
              enabled={true}
              onCommand={handleVoiceCommand} 
            />
          </TabsContent>
          
          <TabsContent value="music">
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-4">Ambiance sonore</h3>
              <p className="text-muted-foreground">
                L'ambiance sonore s'adapte automatiquement à l'expérience AR active.
                Utilisez les commandes vocales ou les contrôles dans l'expérience pour
                ajuster le volume ou changer de piste.
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">Commandes disponibles</h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>"Lecture" - Démarrer la musique</li>
                  <li>"Pause" - Mettre en pause</li>
                  <li>"Plus fort" - Augmenter le volume</li>
                  <li>"Moins fort" - Diminuer le volume</li>
                  <li>"Suivant" - Passer à la piste suivante</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ARPage;
