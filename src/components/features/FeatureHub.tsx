
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const FeatureHub: React.FC = () => {
  const features = [
    {
      id: 'vr',
      title: 'VR Immersive',
      description: 'Expériences de réalité virtuelle pour un bien-être profond',
      comingSoon: true
    },
    {
      id: 'ai-coach',
      title: 'Coach IA Avancé',
      description: 'Coaching personnalisé basé sur vos données émotionnelles',
      comingSoon: false
    },
    {
      id: 'team-analytics',
      title: 'Analytiques d\'équipe',
      description: 'Visualisez le bien-être collectif de votre équipe',
      comingSoon: true
    }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Fonctionnalités</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(feature => (
            <Card 
              key={feature.id} 
              className={`${feature.comingSoon ? 'opacity-70' : ''}`}
            >
              <CardContent className="p-4">
                <h3 className="font-medium flex items-center">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Bientôt</span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={feature.comingSoon}
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    {feature.comingSoon ? 'Notifier' : 'Explorer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureHub;
