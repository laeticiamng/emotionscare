
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import { Brain, ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const B2CScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  const handleScanComplete = (result: EmotionResult) => {
    console.log('Scan completed:', result);
    setLastResult(result);
    toast.success("Analyse émotionnelle terminée avec succès!");
    setShowScanForm(false);
  };

  const previousScans = [
    { date: "Aujourd'hui 14:30", score: 82, emotion: "Joie", type: "text" },
    { date: "Hier 16:45", score: 75, emotion: "Sérénité", type: "audio" },
    { date: "Hier 09:15", score: 68, emotion: "Motivation", type: "emoji" },
    { date: "Avant-hier 19:20", score: 90, emotion: "Gratitude", type: "text" }
  ];

  const insights = [
    { 
      title: "Tendance positive", 
      description: "Votre bien-être s'améliore de 15% cette semaine",
      icon: TrendingUp,
      color: "text-green-600" 
    },
    { 
      title: "Meilleur moment", 
      description: "Vous êtes plus épanoui(e) en fin d'après-midi",
      icon: Sparkles,
      color: "text-blue-600" 
    },
    { 
      title: "Recommandation", 
      description: "Essayez la méditation guidée pour maintenir ce niveau",
      icon: Brain,
      color: "text-purple-600" 
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/b2c/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analyse Émotionnelle</h1>
            <p className="text-muted-foreground">
              Comprenez et suivez votre état émotionnel
            </p>
          </div>
        </div>
        {!showScanForm && (
          <Button onClick={() => setShowScanForm(true)}>
            <Brain className="mr-2 h-4 w-4" />
            Nouvelle analyse
          </Button>
        )}
      </div>

      {showScanForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Scanner vos émotions</CardTitle>
              <CardDescription>
                Choisissez votre méthode d'analyse préférée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionScanForm 
                onComplete={handleScanComplete}
                onClose={() => setShowScanForm(false)}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Last Result */}
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-blue-900">Dernière Analyse</h3>
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold text-blue-600">{lastResult.score}%</div>
                        <div>
                          <p className="font-medium text-blue-800">{lastResult.primaryEmotion}</p>
                          <p className="text-sm text-blue-600">Il y a quelques instants</p>
                        </div>
                      </div>
                      {lastResult.aiFeedback && (
                        <p className="text-sm text-blue-700 italic max-w-md">
                          "{lastResult.aiFeedback}"
                        </p>
                      )}
                    </div>
                    <div className="text-6xl opacity-30">😊</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Analysis Methods Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Méthodes d'Analyse</CardTitle>
                <CardDescription>Découvrez les différentes façons d'analyser vos émotions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        📝
                      </div>
                      <h4 className="font-medium">Analyse Textuelle</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Décrivez vos ressentis en quelques phrases. Notre IA analysera vos mots pour comprendre votre état émotionnel.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-green-50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        🎤
                      </div>
                      <h4 className="font-medium">Analyse Vocale</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enregistrez un message vocal. Nous analyserons le ton, le rythme et les nuances de votre voix.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        😀
                      </div>
                      <h4 className="font-medium">Sélection d'Émojis</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choisissez les émojis qui représentent le mieux votre état actuel. Simple et intuitif.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Insights Personnalisés</CardTitle>
                <CardDescription>Découvertes basées sur vos analyses précédentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <insight.icon className={`h-5 w-5 ${insight.color}`} />
                        <h4 className="font-medium">{insight.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Previous Scans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Historique des Analyses</CardTitle>
                <CardDescription>Vos dernières évaluations émotionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previousScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          scan.score >= 80 ? 'bg-green-100 text-green-700' :
                          scan.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {scan.score}
                        </div>
                        <div>
                          <p className="font-medium">{scan.emotion}</p>
                          <p className="text-sm text-muted-foreground">{scan.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-muted rounded">
                          {scan.type === 'text' ? '📝' : scan.type === 'audio' ? '🎤' : '😀'}
                        </span>
                        <Button variant="ghost" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Check-in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <UnifiedEmotionCheckin />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default B2CScanPage;
