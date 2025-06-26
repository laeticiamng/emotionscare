
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Camera, Mic, FileText, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ScanPage: React.FC = () => {
  const [scanType, setScanType] = useState<'face' | 'voice' | 'text' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleScan = async (type: 'face' | 'voice' | 'text') => {
    setScanType(type);
    setIsScanning(true);
    
    // Simulation du scan
    setTimeout(() => {
      setIsScanning(false);
      setResults({
        primaryEmotion: 'Calme',
        confidence: 85,
        emotions: {
          joie: 65,
          calme: 85,
          stress: 15,
          fatigue: 25
        },
        recommendations: [
          'Continuez sur cette voie positive',
          'Une courte pause pourrait vous faire du bien',
          'Écoutez de la musique relaxante'
        ]
      });
    }, 3000);
  };

  const scanOptions = [
    {
      id: 'face',
      icon: Camera,
      title: 'Scan Facial',
      description: 'Analysez vos émotions via votre expression faciale',
      color: 'bg-blue-500'
    },
    {
      id: 'voice',
      icon: Mic,
      title: 'Analyse Vocale',
      description: 'Détection émotionnelle par analyse de votre voix',
      color: 'bg-green-500'
    },
    {
      id: 'text',
      icon: FileText,
      title: 'Analyse Textuelle',
      description: 'Comprenez vos émotions à travers vos mots',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Scanner Émotionnel
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analysez vos émotions en temps réel avec notre IA avancée
          </p>
        </motion.div>

        {!results ? (
          <>
            {/* Scan Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {scanOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleScan(option.id as any)}>
                    <CardHeader className="text-center">
                      <div className={`mx-auto w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mb-3`}>
                        <option.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{option.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{option.description}</p>
                      <Button 
                        className={`w-full ${option.color} text-white`}
                        onClick={() => handleScan(option.id as any)}
                        disabled={isScanning}
                      >
                        {isScanning && scanType === option.id ? (
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 animate-spin" />
                            Analyse en cours...
                          </div>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Commencer le scan
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Résultats de votre scan émotionnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">😌</div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {results.primaryEmotion}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Confiance: {results.confidence}%
                  </p>
                </div>

                {/* Emotions Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries(results.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl">
                          {emotion === 'joie' ? '😊' : 
                           emotion === 'calme' ? '😌' : 
                           emotion === 'stress' ? '😰' : '😴'}
                        </span>
                      </div>
                      <p className="font-medium capitalize">{emotion}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{value}%</p>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Recommandations personnalisées
                  </h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center mt-8 space-x-4">
                  <Button onClick={() => setResults(null)}>
                    Nouveau scan
                  </Button>
                  <Button variant="outline">
                    Sauvegarder les résultats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
