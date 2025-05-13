
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from 'lucide-react';
import { UnifiedEmotionCheckin } from '@/components/scan/UnifiedEmotionCheckin';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/hooks/use-toast';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { useAuth } from '@/contexts/AuthContext';
import { enhanceEmotionAnalysis } from '@/lib/scan/enhancedAnalyzeService';

const ScanPage = () => {
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleScanComplete = async (result: EmotionResult) => {
    setEmotionResult(result);
    
    if (user?.id) {
      try {
        // Process emotion for badges
        const badges = await processEmotionForBadges(user.id, result);
        
        if (badges.length > 0) {
          toast({
            title: "Badge débloqué !",
            description: `Vous avez débloqué ${badges.length} badge(s) !`,
            variant: "default"
          });
        }
        
        // Get enhanced analysis with insights and recommendations
        const enhanced = await enhanceEmotionAnalysis(result);
        setInsights(enhanced.insights || null);
        setRecommendations(enhanced.recommendations || []);
        
      } catch (error) {
        console.error('Error processing emotion result:', error);
      }
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Scanner vos émotions</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedEmotionCheckin onScanComplete={handleScanComplete} />
        </CardContent>
      </Card>
      
      {emotionResult && (
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="results">Résultats</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Analyse émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Émotion dominante: {emotionResult.dominantEmotion?.name || "Neutre"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Intensité</p>
                      <p className="text-2xl">{Math.round((emotionResult.dominantEmotion?.intensity || 0) * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Confiance</p>
                      <p className="text-2xl">{Math.round((emotionResult.confidence || 0) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {insights ? (
                  <p className="text-lg">{insights}</p>
                ) : (
                  <p className="text-muted-foreground">Aucun insight disponible pour cette analyse.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-0.5 text-green-500"><Check size={16} /></span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Aucune recommandation disponible pour cette analyse.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ScanPage;
