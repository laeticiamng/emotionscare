
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Heart,
  TrendingUp,
  BookOpen,
  Play,
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import EmotionScanner from '@/components/emotion/EmotionScanner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmotionResult {
  score: number;
  primaryEmotion: string;
  emotions: Record<string, number>;
  text?: string;
  audio?: string;
  aiFeedback: string;
}

const EmotionAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [latestResult, setLatestResult] = useState<EmotionResult | null>(null);
  const [isGettingCoaching, setIsGettingCoaching] = useState(false);

  const handleScanComplete = async (result: EmotionResult) => {
    setLatestResult(result);
    setShowScanner(false);
    
    // Save to database
    try {
      const { error } = await supabase
        .from('emotions')
        .insert({
          user_id: user?.id,
          score: result.score,
          text: result.text,
          audio_url: result.audio,
          emojis: result.primaryEmotion,
          ai_feedback: result.aiFeedback
        });
      
      if (error) {
        console.error('Error saving emotion:', error);
      } else {
        toast.success('Analyse sauvegardée avec succès !');
      }
    } catch (error) {
      console.error('Error saving emotion analysis:', error);
    }
  };

  const getPersonalizedCoaching = async () => {
    if (!latestResult) return;
    
    setIsGettingCoaching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: {
          emotionData: latestResult,
          userProfile: user,
          requestType: 'immediate_support'
        }
      });
      
      if (error) throw error;
      
      // Navigate to coaching page with recommendations
      // This would open a coaching modal or navigate to coaching page
      toast.success('Recommandations personnalisées générées !');
      
    } catch (error) {
      console.error('Error getting coaching:', error);
      toast.error('Erreur lors de la génération des recommandations');
    } finally {
      setIsGettingCoaching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent bien-être';
    if (score >= 60) return 'Bon équilibre';
    if (score >= 40) return 'Attention nécessaire';
    return 'Support recommandé';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-light">
            <Brain className="inline mr-2 h-8 w-8 text-primary" />
            Analyse Émotionnelle
          </h1>
          <p className="text-muted-foreground">
            Découvrez et comprenez vos émotions grâce à l'intelligence artificielle
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Nouvelle Analyse
              </CardTitle>
              <CardDescription>
                Choisissez votre méthode d'analyse préférée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowScanner(true)}
                size="lg"
                className="w-full"
              >
                <Brain className="mr-2 h-5 w-5" />
                Commencer une analyse
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Latest Result */}
        {latestResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                    Votre Dernière Analyse
                  </span>
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    Maintenant
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className={`text-6xl font-bold ${getScoreColor(latestResult.score)}`}>
                      {latestResult.score}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getScoreDescription(latestResult.score)}
                    </div>
                  </div>
                  <Progress value={latestResult.score} className="h-3" />
                </div>

                {/* Primary Emotion */}
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Émotion dominante: {latestResult.primaryEmotion}
                  </Badge>
                </div>

                {/* Emotions Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Répartition émotionnelle</h4>
                  {Object.entries(latestResult.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="capitalize">{emotion}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={value * 100} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground w-12">
                          {Math.round(value * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Feedback */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    Retour de l'IA
                  </h4>
                  <p className="text-sm leading-relaxed">{latestResult.aiFeedback}</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={getPersonalizedCoaching}
                    disabled={isGettingCoaching}
                    className="w-full"
                  >
                    {isGettingCoaching ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Génération...
                      </div>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Coaching IA
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Exercices guidés
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment ça marche ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                  <p>Exprimez vos émotions par texte, voix ou émojis</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
                  <p>L'IA analyse vos expressions émotionnelles</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
                  <p>Recevez des insights et recommandations personnalisés</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confidentialité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>🔒 Vos données sont cryptées et sécurisées</p>
                <p>🤖 L'analyse est effectuée de manière anonyme</p>
                <p>📊 Vous contrôlez le partage de vos informations</p>
                <p>🗑️ Suppression possible à tout moment</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Emotion Scanner Modal */}
      {showScanner && (
        <EmotionScanner
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default EmotionAnalysisPage;
