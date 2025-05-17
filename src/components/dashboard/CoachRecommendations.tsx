
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AI_MODEL_CONFIG } from '@/lib/coach/types';

const CoachRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Charger les recommandations initiales
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Récupérer les données émotionnelles récentes si disponibles
      const { data: emotions } = await supabase
        .from('emotions')
        .select('emojis, score')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3);
      
      const recentEmotions = emotions?.map(e => e.emojis).join(', ') || '';
      const avgScore = emotions?.length ? 
        Math.round(emotions.reduce((acc, e) => acc + (e.score || 50), 0) / emotions.length) : 
        50;
      
      // Using the scan model config for recommendations
      const modelConfig = AI_MODEL_CONFIG.scan;
      
      // Générer des recommandations avec l'API OpenAI
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: "Propose 3 conseils très courts et pratiques pour améliorer mon bien-être au travail aujourd'hui. Format: liste à puces courte.",
          userContext: {
            recentEmotions,
            currentScore: avgScore
          },
          model: modelConfig.model,
          temperature: modelConfig.temperature,
          maxTokens: modelConfig.maxTokens,
          top_p: modelConfig.top_p,
          stream: modelConfig.stream
        }
      });
      
      if (error) throw error;
      
      // Transformer la réponse en liste
      const response = data.response;
      const recommendationList = response
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map((line: string) => line.trim().replace(/^[•-]\s*/, ''));
      
      setRecommendations(recommendationList.length > 0 ? recommendationList : [response]);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        "Prendre une pause de 5 minutes toutes les heures pour vous étirer",
        "Pratiquer la respiration profonde pendant 2 minutes en cas de stress",
        "Boire suffisamment d'eau tout au long de la journée"
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Recommandations IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <ul className="space-y-2 mb-4">
              {recommendations.map((rec, index) => (
                <li key={index} className="p-2 bg-muted/30 rounded-md text-sm">
                  {rec}
                </li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover-lift"
              onClick={generateRecommendations}
            >
              Actualiser
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachRecommendations;
