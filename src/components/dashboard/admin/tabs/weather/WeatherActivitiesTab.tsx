
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WeatherSourcesConfig from './WeatherSourcesConfig';
import ActivityRulesList from './ActivityRulesList';
import ActivitiesCatalog from './ActivitiesCatalog';
import SuggestionsPreview from './SuggestionsPreview';
import SuggestionsHistory from './SuggestionsHistory';

const WeatherActivitiesTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('sources');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Météo & Activités</h2>
        <p className="text-muted-foreground mt-2">
          Configurez les suggestions d'activités basées sur les conditions météorologiques pour vos utilisateurs.
        </p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Sources Météo</TabsTrigger>
          <TabsTrigger value="rules">Règles de Suggestion</TabsTrigger>
          <TabsTrigger value="catalog">Catalogue d'Activités</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <WeatherSourcesConfig />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <ActivityRulesList />
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <ActivitiesCatalog />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <SuggestionsPreview />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <SuggestionsHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherActivitiesTab;
