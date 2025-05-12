import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Plus, LibrarySquare, Palette, Sliders, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExpandedTabs, ExpandedTabsList, ExpandedTabsTrigger, ExpandedTabsContent } from '@/components/ui/expanded-tabs';
import MusicCreator from '@/components/music/MusicCreator';
import CreationsList from '@/components/music/CreationsList';
import MoodBasedRecommendations from '@/components/music/MoodBasedRecommendations';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';
import { useToast } from '@/hooks/use-toast';

const MusicGenerationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommend');
  const { loadUserCreations, creations } = useMusicalCreation();
  const { toast } = useToast();

  // Load user creations when component mounts
  useEffect(() => {
    loadUserCreations();
  }, [loadUserCreations]);

  const handleBackClick = () => {
    navigate('/music');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Show appropriate toast based on tab selection
    if (tab === 'create') {
      toast({
        title: "Mode création activé",
        description: "Créez votre propre composition musicale personnalisée",
      });
    } else if (tab === 'library' && creations.length === 0) {
      toast({
        title: "Bibliothèque vide",
        description: "Commencez à créer de la musique pour remplir votre bibliothèque",
        variant: "default",
      });
    }
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
            onClick={() => handleTabChange('recommend')}
          >
            <Music className="h-4 w-4 mr-2" />
            Recommandations
          </ExpandedTabsTrigger>
          
          <ExpandedTabsTrigger 
            active={activeTab === 'create'} 
            onClick={() => handleTabChange('create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Création avancée
          </ExpandedTabsTrigger>
          
          <ExpandedTabsTrigger 
            active={activeTab === 'library'} 
            onClick={() => handleTabChange('library')}
          >
            <LibrarySquare className="h-4 w-4 mr-2" />
            Ma bibliothèque
          </ExpandedTabsTrigger>
          
          <ExpandedTabsTrigger 
            active={activeTab === 'settings'} 
            onClick={() => handleTabChange('settings')}
          >
            <Sliders className="h-4 w-4 mr-2" />
            Paramètres
          </ExpandedTabsTrigger>
        </ExpandedTabsList>
        
        <ExpandedTabsContent active={activeTab === 'recommend'} className="mt-6">
          <MoodBasedRecommendations mood="neutral" />
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'create'} className="mt-6">
          <MusicCreator />
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'library'} className="mt-6">
          <CreationsList />
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'settings'} className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Paramètres de génération</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Qualité audio</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Standard</Button>
                      <Button variant="default" size="sm">HD</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Durée maximale</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">1 min</Button>
                      <Button variant="default" size="sm">3 min</Button>
                      <Button variant="outline" size="sm">5 min</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Modèle IA</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Standard</Button>
                      <Button variant="default" size="sm">TopMedia v3.5</Button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Préférences d'export</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Format audio</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="default" size="sm">MP3</Button>
                      <Button variant="outline" size="sm">WAV</Button>
                      <Button variant="outline" size="sm">FLAC</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Métadonnées</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="default" size="sm">Inclure</Button>
                      <Button variant="outline" size="sm">Exclure</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Gestion des droits</h3>
              
              <p className="text-muted-foreground mb-6">
                Toutes les musiques générées sont libres de droits pour un usage personnel et commercial. 
                Vous pouvez les utiliser dans vos projets créatifs sans restrictions.
              </p>
              
              <Button className="w-full">Télécharger la licence Creative Commons</Button>
            </Card>
          </div>
        </ExpandedTabsContent>
      </ExpandedTabs>
    </div>
  );
};

export default MusicGenerationPage;
