
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Plus, LibrarySquare, Palette, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExpandedTabs, ExpandedTabsList, ExpandedTabsTrigger, ExpandedTabsContent } from '@/components/ui/expanded-tabs';
import MusicCreator from '@/components/music/MusicCreator';
import CreationsList from '@/components/music/CreationsList';
import MoodBasedRecommendations from '@/components/music/MoodBasedRecommendations';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';

const MusicGenerationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommend');
  const { loadUserCreations } = useMusicalCreation();

  // Load user creations when component mounts
  useEffect(() => {
    loadUserCreations();
  }, [loadUserCreations]);

  const handleBackClick = () => {
    navigate('/music');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Générateur Musical IA</h1>
          <p className="text-muted-foreground">
            Créez votre propre musique libre de droits adaptée à vos besoins
          </p>
        </div>
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la musicothérapie
        </Button>
      </div>
      
      {/* Promotional banner */}
      <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-0 shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Générateur de musique IA gratuit</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-2">✓</span>
                Créez de la musique personnalisée en quelques secondes
              </li>
              <li className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-2">✓</span>
                Générez des paroles et des chansons de haute qualité
              </li>
              <li className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-2">✓</span>
                Choisissez parmi plusieurs genres et styles
              </li>
              <li className="flex items-center">
                <span className="bg-primary/20 p-1 rounded-full mr-2">✓</span>
                Idéal pour les créateurs et professionnels
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/images/music-wave.svg" 
              alt="Music Wave" 
              className="max-h-32 opacity-80"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </Card>
      
      {/* Main Content */}
      <ExpandedTabs className="w-full">
        <ExpandedTabsList className="mb-4">
          <ExpandedTabsTrigger 
            active={activeTab === 'recommend'} 
            onClick={() => setActiveTab('recommend')}
          >
            <Music className="h-4 w-4 mr-2" />
            Recommandations
          </ExpandedTabsTrigger>
          
          <ExpandedTabsTrigger 
            active={activeTab === 'create'} 
            onClick={() => setActiveTab('create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Création avancée
          </ExpandedTabsTrigger>
          
          <ExpandedTabsTrigger 
            active={activeTab === 'library'} 
            onClick={() => setActiveTab('library')}
          >
            <LibrarySquare className="h-4 w-4 mr-2" />
            Ma bibliothèque
          </ExpandedTabsTrigger>
          
          <ExpandedTabsTrigger 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          >
            <Sliders className="h-4 w-4 mr-2" />
            Paramètres
          </ExpandedTabsTrigger>
        </ExpandedTabsList>
        
        <ExpandedTabsContent active={activeTab === 'recommend'} className="mt-6">
          <MoodBasedRecommendations />
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'create'} className="mt-6">
          <MusicCreator />
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'library'} className="mt-6">
          <CreationsList />
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'settings'} className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres de génération</h3>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                Les paramètres de génération musicale permettent de personnaliser davantage le processus de création.
                Cette section sera disponible prochainement avec des options supplémentaires.
              </p>
              
              <div className="space-y-4 opacity-60 pointer-events-none">
                <div className="flex items-center justify-between">
                  <span>Qualité audio</span>
                  <span>Haute qualité (192kbps)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Durée maximale</span>
                  <span>3 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Modèle IA</span>
                  <span>TopMedia v3.5</span>
                </div>
              </div>
            </Card>
          </div>
        </ExpandedTabsContent>
      </ExpandedTabs>
    </div>
  );
};

export default MusicGenerationPage;
