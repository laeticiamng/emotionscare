
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

export interface HRActionsTabProps {
  rhSuggestions: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  isLoading?: boolean;
}

const HRActionsTab: React.FC<HRActionsTabProps> = ({ rhSuggestions, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full col-span-1 md:col-span-2" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Suggestions IA</CardTitle>
          <CardDescription>Suggestions basées sur l'analyse des données</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rhSuggestions.map((suggestion, i) => (
              <div key={i} className="bg-white/80 rounded-xl p-5 hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{suggestion.icon}</div>
                <h3 className="text-h4 font-semibold mb-2">{suggestion.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                  Mettre en place
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Proposer un Atelier</CardTitle>
          <CardDescription>Planifier une activité pour les équipes</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input type="text" className="w-full p-2 rounded border" placeholder="Nom de l'activité" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" className="w-full p-2 rounded border" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea className="w-full p-2 rounded border h-24" placeholder="Décrivez l'activité..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Budget max</label>
              <input type="number" className="w-full p-2 rounded border" placeholder="€" />
            </div>
            <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
              Proposer l'atelier
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Sondage Express</CardTitle>
          <CardDescription>Recueillir les avis de l'équipe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white/80 p-4 rounded-xl">
              <p className="mb-4">Créez un sondage rapide pour prendre le pouls de vos équipes sur des sujets spécifiques.</p>
              <div className="flex gap-2 mb-4">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Simple</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Anonyme</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Rapide</div>
              </div>
            </div>
            <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
              Lancer un sondage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRActionsTab;
