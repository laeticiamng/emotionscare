// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AI_MODEL_CONFIG } from '@/lib/coach/types';
import { logger } from '@/lib/logger';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  link?: string;
}

const CoachRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Simuler une requête API en environnement de développement
      setTimeout(() => {
        const mockRecommendations: Recommendation[] = [
          {
            id: "rec1",
            title: "5 minutes de respiration guidée",
            description: "Une session courte pour vous aider à vous recentrer",
            type: "breathing",
            link: "/exercises/breathing"
          },
          {
            id: "rec2",
            title: "Journal de gratitude",
            description: "Notez trois choses pour lesquelles vous êtes reconnaissant aujourd'hui",
            type: "journal",
            link: "/journal/gratitude"
          },
          {
            id: "rec3",
            title: "Méditation de pleine conscience",
            description: "10 minutes pour développer votre présence attentive",
            type: "meditation",
            link: "/exercises/mindfulness"
          }
        ];
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      logger.error("Erreur lors de la récupération des recommandations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les recommandations",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const generateRecommendation = async () => {
    setLoading(true);
    try {
      // Utilisons les configurations correctes
      logger.info(`Using model: ${AI_MODEL_CONFIG.coach.model} with max_tokens: ${AI_MODEL_CONFIG.coach.max_tokens}`);
      
      // Simuler une génération en environnement de développement
      setTimeout(() => {
        const newRecommendation: Recommendation = {
          id: `rec-${Date.now()}`,
          title: "Prenez un moment pour vous",
          description: "Faites une courte pause de 5 minutes pour vous reconnecter à vos sensations",
          type: "break",
          link: "/exercises/break"
        };
        
        setRecommendations(prev => [newRecommendation, ...prev]);
        setLoading(false);
        
        toast({
          title: "Nouvelle recommandation",
          description: "Une recommandation personnalisée a été générée pour vous",
        });
      }, 1500);
    } catch (error) {
      logger.error("Erreur lors de la génération de recommandation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer une recommandation",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recommandations du coach</CardTitle>
        <CardDescription>Suggestions personnalisées pour votre bien-être</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={generateRecommendation} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            "Générer une nouvelle recommandation"
          )}
        </Button>
        
        <div className="space-y-3 mt-4">
          {recommendations.length === 0 && !loading ? (
            <p className="text-center text-muted-foreground py-4">
              Aucune recommandation disponible actuellement.
            </p>
          ) : (
            recommendations.map(rec => (
              <Card key={rec.id} className="bg-muted/50">
                <CardContent className="pt-4">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  {rec.link && (
                    <Button variant="link" className="px-0 mt-2" asChild>
                      <a href={rec.link}>Voir plus</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
          
          {loading && recommendations.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachRecommendations;
