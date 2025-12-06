// @ts-nocheck

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VRTemplateGrid from './VRTemplateGrid';

const VR_TEMPLATES = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Une expérience de méditation apaisante dans une forêt luxuriante avec des sons de la nature.',
    duration: 15,
    tags: ['Méditation', 'Nature', 'Débutant', 'Relaxation'],
    environment: 'forest',
    thumbnailUrl: '/images/vr/forest-meditation.jpg',
    emotionTarget: 'calm',
    category: 'Méditation'
  },
  {
    id: '2',
    title: 'Plage au coucher de soleil',
    description: 'Relaxez-vous sur une plage tranquille au coucher du soleil avec le son des vagues.',
    duration: 20,
    tags: ['Relaxation', 'Plage', 'Coucher de soleil', 'Apaisant'],
    environment: 'beach',
    thumbnailUrl: '/images/vr/sunset-beach.jpg',
    emotionTarget: 'peaceful',
    category: 'Relaxation'
  }
];

const VRSelectionView = () => {
  const handleSelectTemplate = (template: any) => {
    // Template selected - silent
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Expériences VR immersives</h1>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="meditation">Méditation</TabsTrigger>
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          <TabsTrigger value="focus">Concentration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <VRTemplateGrid 
            templates={VR_TEMPLATES} 
            onSelectTemplate={handleSelectTemplate} 
          />
        </TabsContent>
        
        <TabsContent value="meditation">
          <VRTemplateGrid 
            templates={VR_TEMPLATES.filter(t => t.category === 'Méditation')} 
            onSelectTemplate={handleSelectTemplate} 
          />
        </TabsContent>
        
        <TabsContent value="relaxation">
          <VRTemplateGrid 
            templates={VR_TEMPLATES.filter(t => t.category === 'Relaxation')} 
            onSelectTemplate={handleSelectTemplate} 
          />
        </TabsContent>
        
        <TabsContent value="focus">
          <p className="text-muted-foreground">Aucune expérience disponible dans cette catégorie pour le moment.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VRSelectionView;
