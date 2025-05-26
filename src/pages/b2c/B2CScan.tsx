
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Brain, TrendingUp, Calendar, Star } from 'lucide-react';
import { EmotionMoodPicker } from '@/components/emotion/EmotionMoodPicker';

const B2CScan: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const steps = [
    'Sélection de l\'humeur',
    'Analyse contextuelle',
    'Scan émotionnel',
    'Résultats'
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const startScan = () => {
    setCurrentStep(2);
    // Simulation du scan
    setTimeout(() => {
      setScanResult({
        mood: selectedMood,
        emotionalScore: Math.floor(Math.random() * 40) + 60,
        stressLevel: Math.floor(Math.random() * 30) + 20,
        energyLevel: Math.floor(Math.random() * 50) + 50,
        recommendations: [
          'Prendre une pause de 10 minutes',
          'Écouter de la musique relaxante',
          'Faire quelques exercices de respiration'
        ]
      });
      setCurrentStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Scanner Émotionnel
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Analysez votre état émotionnel en quelques étapes simples
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 ${
                      index < currentStep ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Comment vous sentez-vous maintenant ?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <EmotionMoodPicker 
                  onSelect={handleMoodSelect}
                  selected={selectedMood}
                />
                {selectedMood && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={() => setCurrentStep(1)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      size="lg"
                    >
                      Continuer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  Contexte de votre état
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Humeur sélectionnée</h3>
                    <Badge variant="outline" className="text-lg py-2 px-4">
                      {selectedMood}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Questions rapides</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm">Depuis combien de temps ressentez-vous cela ?</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Quelques minutes</Badge>
                          <Badge variant="outline">Quelques heures</Badge>
                          <Badge variant="outline">Toute la journée</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button 
                      onClick={startScan}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      size="lg"
                    >
                      Commencer le scan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-6"
                >
                  <Eye className="h-16 w-16 text-indigo-600" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Analyse en cours...</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Traitement de vos données émotionnelles
                </p>
                <Progress value={75} className="mt-6 max-w-md mx-auto" />
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && scanResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Résultats de votre scan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {scanResult.emotionalScore}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Score émotionnel</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {scanResult.stressLevel}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Niveau de stress</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {scanResult.energyLevel}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Niveau d'énergie</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Recommandations personnalisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scanResult.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                          {index + 1}
                        </div>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={() => {
                      setCurrentStep(0);
                      setSelectedMood(null);
                      setScanResult(null);
                    }}>
                      Nouveau scan
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Sauvegarder les résultats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default B2CScan;
