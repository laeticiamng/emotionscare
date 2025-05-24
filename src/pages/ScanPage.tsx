
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Scan, Activity, TrendingUp, Calendar, Plus, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { EmotionResult } from '@/types/emotion';

const ScanPage: React.FC = () => {
  const [showScanForm, setShowScanForm] = useState(false);
  const [recentScans, setRecentScans] = useState([
    {
      id: 1,
      emotion: 'Joyeux',
      confidence: 85,
      timestamp: new Date(),
      insights: ['Niveau d\'énergie élevé', 'Motivation positive']
    },
    {
      id: 2,
      emotion: 'Calme',
      confidence: 78,
      timestamp: new Date(Date.now() - 3600000),
      insights: ['État détendu', 'Bonne concentration']
    }
  ]);

  const handleScanComplete = (result: EmotionResult) => {
    const newScan = {
      id: Date.now(),
      emotion: result.dominantEmotion,
      confidence: Math.round(result.confidence * 100),
      timestamp: new Date(),
      insights: result.insights || []
    };
    
    setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
    setShowScanForm(false);
    toast.success('Analyse émotionnelle terminée !');
  };

  const emotionColors: { [key: string]: string } = {
    'Joyeux': 'bg-yellow-500',
    'Calme': 'bg-blue-500',
    'Triste': 'bg-gray-500',
    'Anxieux': 'bg-red-500',
    'Neutre': 'bg-gray-400',
    'Énergique': 'bg-orange-500',
    'Fatigué': 'bg-purple-500'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Scanner d'émotions</h1>
          <p className="text-muted-foreground">
            Analysez et suivez votre bien-être émotionnel en temps réel
          </p>
        </div>
        
        {!showScanForm && (
          <Button onClick={() => setShowScanForm(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle analyse
          </Button>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analyses totales</p>
                <p className="text-2xl font-bold">{recentScans.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dernière émotion</p>
                <p className="text-lg font-semibold">
                  {recentScans.length > 0 ? recentScans[0].emotion : 'Aucune'}
                </p>
              </div>
              <Scan className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confiance moyenne</p>
                <p className="text-2xl font-bold">
                  {recentScans.length > 0 
                    ? Math.round(recentScans.reduce((acc, scan) => acc + scan.confidence, 0) / recentScans.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
                <p className="text-2xl font-bold">
                  {recentScans.filter(scan => 
                    new Date().getTime() - scan.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">Scanner</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="insights">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          {showScanForm ? (
            <EmotionScanForm 
              onComplete={handleScanComplete}
              onClose={() => setShowScanForm(false)}
            />
          ) : (
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>Prêt pour une nouvelle analyse ?</CardTitle>
                <CardDescription>
                  Analysez votre état émotionnel actuel avec nos outils avancés
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setShowScanForm(true)} size="lg">
                  <Scan className="h-5 w-5 mr-2" />
                  Commencer l'analyse
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Choisissez parmi l'analyse textuelle, vocale ou par émojis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {recentScans.length > 0 ? (
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <Card key={scan.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${emotionColors[scan.emotion] || 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold text-sm">
                            {scan.emotion.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{scan.emotion}</h3>
                          <p className="text-sm text-muted-foreground">
                            {scan.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">
                          {scan.confidence}% confiance
                        </Badge>
                        <div className="space-y-1">
                          {scan.insights.map((insight, index) => (
                            <p key={index} className="text-xs text-muted-foreground">
                              • {insight}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Scan className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune analyse pour le moment</h3>
                <p className="text-muted-foreground mb-6">
                  Commencez votre première analyse émotionnelle pour voir votre historique ici
                </p>
                <Button onClick={() => setShowScanForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Première analyse
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendances émotionnelles</CardTitle>
              <CardDescription>
                Analyse de vos patterns émotionnels récents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentScans.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Émotions dominantes</h4>
                      {Object.entries(
                        recentScans.reduce((acc: any, scan) => {
                          acc[scan.emotion] = (acc[scan.emotion] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([emotion, count]) => (
                        <div key={emotion} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 ${emotionColors[emotion] || 'bg-gray-400'} rounded-full`}></div>
                            <span>{emotion}</span>
                          </div>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Recommandations</h4>
                      <div className="space-y-2 text-sm">
                        <p className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          💡 Maintenez vos moments de joie avec des activités créatives
                        </p>
                        <p className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          🧘 Prolongez vos états calmes avec de la méditation
                        </p>
                        <p className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          🎵 Utilisez la musique thérapeutique pour stabiliser vos émotions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Effectuez quelques analyses pour voir vos tendances émotionnelles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
