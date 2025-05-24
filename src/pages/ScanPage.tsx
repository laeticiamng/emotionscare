
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Mic, 
  FileText, 
  Smile, 
  Heart,
  TrendingUp,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { EmotionResult } from '@/types/emotion';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [currentScan, setCurrentScan] = useState<EmotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const handleScanComplete = (result: EmotionResult) => {
    setCurrentScan(result);
    setShowResults(true);
    setIsScanning(false);
    toast.success('Analyse émotionnelle terminée !');
  };

  const handleStartNewScan = () => {
    setCurrentScan(null);
    setShowResults(false);
    setIsScanning(true);
  };

  const recentScans = isDemoAccount ? [
    {
      date: '2024-01-24',
      time: '14:30',
      emotions: ['Calme', 'Optimiste'],
      score: 85
    },
    {
      date: '2024-01-23',
      time: '09:15',
      emotions: ['Énergique', 'Concentré'],
      score: 92
    },
    {
      date: '2024-01-22',
      time: '16:45',
      emotions: ['Détendu', 'Satisfait'],
      score: 78
    }
  ] : [];

  const emotionTrends = isDemoAccount ? [
    { emotion: 'Bonheur', percentage: 78, trend: 'up' },
    { emotion: 'Calme', percentage: 85, trend: 'up' },
    { emotion: 'Énergie', percentage: 72, trend: 'stable' },
    { emotion: 'Stress', percentage: 25, trend: 'down' }
  ] : [];

  const ScanResults = ({ result }: { result: EmotionResult }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>Analyse terminée</CardTitle>
          <CardDescription>
            Voici votre état émotionnel actuel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {result.confidence}%
            </div>
            <p className="text-muted-foreground">Score de bien-être</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Émotions détectées :</h4>
            <div className="grid grid-cols-2 gap-4">
              {result.emotions.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{emotion.name}</span>
                  <span className="text-sm text-muted-foreground">{emotion.intensity}%</span>
                </div>
              ))}
            </div>
          </div>

          {result.recommendations && (
            <div className="space-y-2">
              <h4 className="font-medium">Recommandations :</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm">{result.recommendations}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={handleStartNewScan} className="flex-1">
              Nouvelle analyse
            </Button>
            <Button variant="outline" className="flex-1">
              Voir l'historique
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (showResults && currentScan) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="max-w-2xl mx-auto">
          <ScanResults result={currentScan} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Scanner vos émotions</h1>
          <p className="text-muted-foreground mt-2">
            Analysez votre état émotionnel en temps réel avec notre IA avancée
          </p>
        </div>
      </motion.div>

      {/* Main Scan Interface */}
      {isScanning ? (
        <div className="max-w-2xl mx-auto">
          <EmotionScanForm 
            onComplete={handleScanComplete}
            onClose={() => setIsScanning(false)}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Brain className="h-6 w-6" />
                <span>Choisissez votre méthode d'analyse</span>
              </CardTitle>
              <CardDescription>
                Plusieurs options s'offrent à vous pour analyser vos émotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                  variant="outline"
                  onClick={handleStartNewScan}
                  className="h-auto flex flex-col items-center gap-4 p-8 hover:bg-primary/5"
                >
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Analyse textuelle</h3>
                    <p className="text-sm text-muted-foreground">
                      Décrivez comment vous vous sentez
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleStartNewScan}
                  className="h-auto flex flex-col items-center gap-4 p-8 hover:bg-primary/5"
                >
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Mic className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Analyse vocale</h3>
                    <p className="text-sm text-muted-foreground">
                      Parlez pour analyser votre voix
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleStartNewScan}
                  className="h-auto flex flex-col items-center gap-4 p-8 hover:bg-primary/5"
                >
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Smile className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Sélection d'émojis</h3>
                    <p className="text-sm text-muted-foreground">
                      Choisissez vos émotions visuellement
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Analyses récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentScans.length > 0 ? (
                <div className="space-y-4">
                  {recentScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{scan.date} à {scan.time}</p>
                        <p className="text-sm text-muted-foreground">
                          {scan.emotions.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          scan.score >= 80 ? 'text-green-600' :
                          scan.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {scan.score}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aucune analyse récente
                  </p>
                  <Button onClick={handleStartNewScan}>
                    Commencer votre première analyse
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Emotion Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Tendances émotionnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emotionTrends.length > 0 ? (
                <div className="space-y-4">
                  {emotionTrends.map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{trend.emotion}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {trend.percentage}%
                          </span>
                          {trend.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {trend.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                          {trend.trend === 'stable' && <Target className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </div>
                      <Progress value={trend.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Effectuez quelques analyses pour voir vos tendances
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Conseils pour une meilleure analyse</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Soyez honnête</h4>
                <p className="text-xs text-muted-foreground">
                  Décrivez vraiment ce que vous ressentez
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Mic className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Environnement calme</h4>
                <p className="text-xs text-muted-foreground">
                  Choisissez un endroit sans bruit pour l'analyse vocale
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Régularité</h4>
                <p className="text-xs text-muted-foreground">
                  Analysez-vous régulièrement pour de meilleurs résultats
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScanPage;
