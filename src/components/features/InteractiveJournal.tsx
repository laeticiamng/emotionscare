// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Save, 
  Calendar, 
  Heart, 
  Smile, 
  Sun, 
  Moon,
  Cloud,
  Sparkles,
  Target,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { emotionsCareApi } from '@/services/emotions-care-api';
import { logger } from '@/lib/logger';

interface JournalEntry {
  id: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'difficult';
  timestamp: Date;
  tags: string[];
  emotionAnalysis?: {
    emotion: string;
    confidence: number;
  };
}

const InteractiveJournal: React.FC = () => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood'] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      content: 'Journée productive au travail. Je me sens accompli et serein.',
      mood: 'excellent',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['productivité', 'travail', 'accomplissement']
    },
    {
      id: '2',
      content: 'Petite anxiété avant la présentation, mais tout s\'est bien passé.',
      mood: 'good',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: ['anxiété', 'présentation', 'réussite']
    }
  ]);

  const moods = [
    { 
      key: 'excellent' as const, 
      icon: Sun, 
      label: 'Excellent', 
      color: 'text-yellow-500 bg-yellow-100', 
      description: 'Je me sens fantastique' 
    },
    { 
      key: 'good' as const, 
      icon: Smile, 
      label: 'Bien', 
      color: 'text-green-500 bg-green-100', 
      description: 'Une bonne journée' 
    },
    { 
      key: 'neutral' as const, 
      icon: Cloud, 
      label: 'Neutre', 
      color: 'text-blue-500 bg-blue-100', 
      description: 'Ni bon ni mauvais' 
    },
    { 
      key: 'difficult' as const, 
      icon: Moon, 
      label: 'Difficile', 
      color: 'text-purple-500 bg-purple-100', 
      description: 'Journée compliquée' 
    }
  ];

  const handleSaveEntry = async () => {
    if (!currentEntry.trim() || !selectedMood) return;

    setIsAnalyzing(true);
    try {
      // Analyse de l'émotion du texte
      const analysis = await emotionsCareApi.analyzeEmotionText(currentEntry);
      
      setIsSaving(true);
      
      // Sauvegarde de l'entrée
      await emotionsCareApi.saveJournalEntry(currentEntry);

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        mood: selectedMood,
        timestamp: new Date(),
        tags: ['manuel'], // Auto-extract tags in future version
        emotionAnalysis: {
          emotion: analysis.emotion,
          confidence: analysis.confidence
        }
      };

      setRecentEntries(prev => [newEntry, ...prev.slice(0, 4)]);
      setCurrentEntry('');
      setSelectedMood(null);
    } catch (error) {
      logger.error('Erreur sauvegarde journal', error as Error, 'UI');
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <div className="space-y-6">
      {/* Nouvelle entrée */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Nouvelle Entrée de Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection d'humeur */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Comment vous sentez-vous maintenant ?</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood.key}
                  variant={selectedMood === mood.key ? 'default' : 'outline'}
                  onClick={() => setSelectedMood(mood.key)}
                  className="flex flex-col items-center gap-2 h-auto p-4"
                >
                  <mood.icon className={`h-6 w-6 ${selectedMood === mood.key ? 'text-primary-foreground' : mood.color.split(' ')[0]}`} />
                  <div className="text-center">
                    <div className="font-medium text-sm">{mood.label}</div>
                    <div className="text-xs opacity-75">{mood.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Zone de texte */}
          <div className="space-y-3">
            <Textarea
              placeholder="Exprimez vos pensées, vos sentiments, vos réflexions du jour... L'IA analysera vos émotions pour mieux vous accompagner."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-32 resize-none"
            />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {currentEntry.length} caractères
              </div>
              <Button 
                onClick={handleSaveEntry}
                disabled={!currentEntry.trim() || !selectedMood || isAnalyzing || isSaving}
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Sauvegarder l'entrée
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entrées récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Entrées Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    {React.createElement(
                      moods.find(m => m.key === entry.mood)?.icon || Smile, 
                      { 
                        className: `h-5 w-5 ${moods.find(m => m.key === entry.mood)?.color.split(' ')[0] || 'text-gray-500'}` 
                      }
                    )}
                    <Badge variant="outline" className="text-xs">
                      {moods.find(m => m.key === entry.mood)?.label}
                    </Badge>
                    {entry.emotionAnalysis && (
                      <Badge variant="secondary" className="text-xs">
                        IA: {entry.emotionAnalysis.emotion}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getTimeAgo(entry.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed text-foreground mb-3">
                  {entry.content}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveJournal;