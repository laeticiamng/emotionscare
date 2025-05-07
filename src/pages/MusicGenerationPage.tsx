
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Plus, LibrarySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MusicCreator from '@/components/music/MusicCreator';
import CreationsList from '@/components/music/CreationsList';

const MusicGenerationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Génération musicale</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos compositions musicales personnalisées
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/music')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la musicothérapie
        </Button>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Créer une composition
          </TabsTrigger>
          <TabsTrigger value="library">
            <LibrarySquare className="h-4 w-4 mr-2" />
            Ma bibliothèque
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <MusicCreator />
        </TabsContent>
        
        <TabsContent value="library" className="mt-6">
          <CreationsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicGenerationPage;
