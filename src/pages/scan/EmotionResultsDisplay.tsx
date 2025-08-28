import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Heart, Zap, Target, TrendingUp, Download, Share2, 
  Clock, Activity, Lightbulb, Music, BookOpen 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EmotionResultsDisplayProps {
  results: {
    dominant: string;
    confidence: number;
    emotions: Record<string, number>;
    recommendations: string[];
    biometrics?: {
      heartRate: number;
      stressLevel: number;
      focusScore: number;
    };
    type?: string;
    voiceMetrics?: any;
    textMetrics?: any;
    facialMetrics?: any;
  };
  onNewScan: () => void;
  onExportResults: () => void;
}

const EmotionResultsDisplay: React.FC<EmotionResultsDisplayProps> = ({ 
  results, 
  onNewScan, 
  onExportResults 
}) => {
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'Joie': 'text-yellow-600 bg-yellow-100',
      'Sérénité': 'text-blue-600 bg-blue-100',
      'Confiance': 'text-green-600 bg-green-100',
      'Énergie': 'text-orange-600 bg-orange-100',
      'Anxiété': 'text-red-600 bg-red-100',
      'Fatigue': 'text-gray-600 bg-gray-100',
      'Stress': 'text-red-600 bg-red-100',
      'Concentration': 'text-purple-600 bg-purple-100',
      'Surprise': 'text-pink-600 bg-pink-100'
    };
    return colors[emotion] || 'text-gray-600 bg-gray-100';
  };

  const getEmotionIcon = (emotion: string) => {
    const icons: Record<string, string> = {
      'Joie': '😊',
      'Sérénité': '😌',
      'Confiance': '💪',
      'Énergie': '⚡',
      'Anxiété': '😰',
      'Fatigue': '😴',
      'Stress': '😓',
      'Concentration': '🎯',
      'Surprise': '😲'
    };
    return icons[emotion] || '🤔';
  };

  const sortedEmotions = Object.entries(results.emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Résultat principal */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-600" />
              <span>Analyse Émotionnelle Complète</span>
            </div>
            <Badge className="bg-green-600 text-white">
              {results.confidence}% de précision
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{getEmotionIcon(results.dominant)}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Émotion dominante: {results.dominant}
            </h2>
            <p className="text-gray-600">
              Basé sur l'analyse {results.type === 'voice' ? 'vocale' : 
                              results.type === 'text' ? 'textuelle' : 
                              results.type === 'facial' ? 'faciale' : 'multimodale'}
            </p>
          </div>

          {/* Métriques biométriques */}
          {results.biometrics && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg">
                <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {results.biometrics.heartRate}
                </div>
                <div className="text-sm text-gray-600">BPM</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Zap className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {results.biometrics.stressLevel}%
                </div>
                <div className="text-sm text-gray-600">Stress</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {results.biometrics.focusScore}%
                </div>
                <div className="text-sm text-gray-600">Focus</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analyse détaillée des émotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Profil Émotionnel Détaillé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEmotions.map(([emotion, intensity], index) => (
              <motion.div
                key={emotion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="text-2xl">{getEmotionIcon(emotion)}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{emotion}</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(intensity)}%
                    </span>
                  </div>
                  <Progress value={intensity} className="h-2" />
                </div>
                <Badge className={getEmotionColor(emotion)}>
                  {intensity > 70 ? 'Fort' : intensity > 40 ? 'Modéré' : 'Faible'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métriques spécifiques au type d'analyse */}
      {(results.voiceMetrics || results.textMetrics || results.facialMetrics) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analyse Technique
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.voiceMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tonalité</p>
                  <p className="font-medium">{results.voiceMetrics.pitch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rythme</p>
                  <p className="font-medium">{results.voiceMetrics.tempo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clarté</p>
                  <p className="font-medium">{results.voiceMetrics.clarity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Émotion vocale</p>
                  <p className="font-medium">{results.voiceMetrics.emotion}</p>
                </div>
              </div>
            )}

            {results.textMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Sentiment</p>
                  <p className="font-medium">{results.textMetrics.sentiment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mots analysés</p>
                  <p className="font-medium">{results.textMetrics.wordCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Complexité</p>
                  <p className="font-medium">{results.textMetrics.complexity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thèmes</p>
                  <p className="font-medium">{results.textMetrics.themes?.join(', ')}</p>
                </div>
              </div>
            )}

            {results.facialMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Contact visuel</p>
                  <p className="font-medium">{results.facialMetrics.eyeContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Symétrie</p>
                  <p className="font-medium">{results.facialMetrics.facialSymmetry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posture</p>
                  <p className="font-medium">{results.facialMetrics.posture}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Micro-expressions</p>
                  <p className="font-medium">{results.facialMetrics.microExpressions?.join(', ')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommandations Personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {results.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
              >
                <div className="text-blue-600 mt-0.5">
                  {index === 0 ? <Music className="h-4 w-4" /> : 
                   index === 1 ? <BookOpen className="h-4 w-4" /> :
                   index === 2 ? <Heart className="h-4 w-4" /> :
                   <Lightbulb className="h-4 w-4" />}
                </div>
                <p className="text-blue-800 text-sm">{rec}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={onNewScan} className="flex-1">
          <Brain className="mr-2 h-4 w-4" />
          Nouvelle Analyse
        </Button>
        <Button onClick={onExportResults} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </div>

      {/* Horodatage */}
      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <Clock className="h-4 w-4" />
        Analysé le {new Date().toLocaleString('fr-FR')}
      </div>
    </motion.div>
  );
};

export default EmotionResultsDisplay;