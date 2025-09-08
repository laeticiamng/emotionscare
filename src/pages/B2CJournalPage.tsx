import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  Brain, 
  TrendingUp,
  Calendar,
  Zap,
  Moon,
  Sun,
  Cloud,
  Rainbow,
  Star,
  Mic,
  Image,
  MapPin,
  Lightbulb
} from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  emotions: string[];
  aiInsights: string[];
  timestamp: Date;
  weather?: string;
  location?: string;
  images?: string[];
  voiceNote?: string;
  gratitude?: string[];
  goals?: string[];
  energy: number;
  stress: number;
  happiness: number;
}

const moodIcons = {
  joyful: { icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  calm: { icon: Cloud, color: 'text-blue-500', bg: 'bg-blue-100' },
  energetic: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100' },
  peaceful: { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-100' },
  inspired: { icon: Rainbow, color: 'text-pink-500', bg: 'bg-pink-100' },
  grateful: { icon: Star, color: 'text-green-500', bg: 'bg-green-100' }
};

export default function B2CJournalEnhanced() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 'calm',
    emotions: [],
    energy: 50,
    stress: 50,
    happiness: 50,
    gratitude: ['', '', ''],
    goals: ['']
  });
  const [isWriting, setIsWriting] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emotionTags = [
    'Gratitude', 'Joie', 'Sérénité', 'Confiance', 'Inspiration', 'Amour',
    'Espoir', 'Fierté', 'Paix', 'Émerveillement', 'Reconnaissance', 'Bonheur'
  ];

  const generateAIInsights = async (content: string, mood: string, emotions: string[]) => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [
      `Votre écriture révèle une progression émotionnelle vers le ${mood}`,
      `Les émotions ${emotions.slice(0, 2).join(' et ')} dominent votre état actuel`,
      `Je remarque des patterns de croissance personnelle dans vos mots`,
      `Votre niveau de conscience émotionnelle s'approfondit`,
      `Cette réflexion montre votre capacité d'introspection remarquable`
    ];
    
    setAiInsights(insights.slice(0, 3));
    setIsAnalyzing(false);
  };

  const saveEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title || `Réflexion du ${new Date().toLocaleDateString()}`,
      content: currentEntry.content || '',
      mood: currentEntry.mood || 'calm',
      emotions: currentEntry.emotions || [],
      aiInsights,
      timestamp: new Date(),
      energy: currentEntry.energy || 50,
      stress: currentEntry.stress || 50,
      happiness: currentEntry.happiness || 50,
      gratitude: currentEntry.gratitude?.filter(g => g.trim()) || [],
      goals: currentEntry.goals?.filter(g => g.trim()) || []
    };
    
    setEntries(prev => [entry, ...prev]);
    setCurrentEntry({
      title: '', content: '', mood: 'calm', emotions: [],
      energy: 50, stress: 50, happiness: 50,
      gratitude: ['', '', ''], goals: ['']
    });
    setAiInsights([]);
    setIsWriting(false);
  };

  const toggleEmotion = (emotion: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      emotions: prev.emotions?.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...(prev.emotions || []), emotion]
    }));
  };

  const updateGratitude = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude?.map((g, i) => i === index ? value : g) || []
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      goals: prev.goals?.map((g, i) => i === index ? value : g) || []
    }));
  };

  const addGoal = () => {
    setCurrentEntry(prev => ({
      ...prev,
      goals: [...(prev.goals || []), '']
    }));
  };

  useEffect(() => {
    if (currentEntry.content && currentEntry.content.length > 50) {
      const timeoutId = setTimeout(() => {
        generateAIInsights(
          currentEntry.content || '',
          currentEntry.mood || 'calm',
          currentEntry.emotions || []
        );
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentEntry.content, currentEntry.mood, currentEntry.emotions]);

  const selectedMoodData = moodIcons[currentEntry.mood as keyof typeof moodIcons] || moodIcons.calm;
  const MoodIcon = selectedMoodData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Journal Personnel IA
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez vos pensées avec l'assistance de l'IA pour des insights profonds et personnalisés
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Écriture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Nouvelle Réflexion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Titre */}
                <Input
                  placeholder="Titre de votre réflexion..."
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-medium"
                />

                {/* Sélection d'humeur */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Comment vous sentez-vous ?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(moodIcons).map(([mood, data]) => {
                      const Icon = data.icon;
                      return (
                        <motion.button
                          key={mood}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentEntry(prev => ({ ...prev, mood }))}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            currentEntry.mood === mood
                              ? `${data.bg} border-current ${data.color}`
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-1 ${
                            currentEntry.mood === mood ? data.color : 'text-gray-400'
                          }`} />
                          <span className="text-xs capitalize font-medium">{mood}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Niveaux émotionnels */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">État émotionnel</h3>
                  {[
                    { key: 'energy', label: 'Énergie', icon: Zap, color: 'orange' },
                    { key: 'happiness', label: 'Bonheur', icon: Heart, color: 'pink' },
                    { key: 'stress', label: 'Stress', icon: Brain, color: 'blue', inverted: true }
                  ].map(({ key, label, icon: Icon, color, inverted }) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 text-${color}-500`} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <span className="text-sm text-gray-500">{currentEntry[key as keyof typeof currentEntry]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentEntry[key as keyof typeof currentEntry] as number}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className={`w-full accent-${color}-500`}
                      />
                    </div>
                  ))}
                </div>

                {/* Contenu principal */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Vos pensées...
                  </label>
                  <Textarea
                    ref={textareaRef}
                    placeholder="Laissez vos pensées s'exprimer librement. L'IA analysera vos mots pour vous offrir des insights personnalisés..."
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[200px] resize-none"
                    onFocus={() => setIsWriting(true)}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {currentEntry.content?.length || 0} caractères
                    </span>
                  <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className={isRecording ? 'bg-red-500 text-white' : ''}
                      >
                        <Mic className="w-4 h-4 mr-1" />
                        {isRecording ? 'Arrêter' : 'Vocal'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Image className="w-4 h-4 mr-1" />
                        Photo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Émotions */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Émotions ressenties
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emotionTags.map(emotion => (
                      <Badge
                        key={emotion}
                        variant={currentEntry.emotions?.includes(emotion) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => toggleEmotion(emotion)}
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Gratitude */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Trois gratitudes du jour
                  </label>
                  <div className="space-y-2">
                    {currentEntry.gratitude?.map((gratitude, index) => (
                      <Input
                        key={index}
                        placeholder={`Gratitude ${index + 1}...`}
                        value={gratitude}
                        onChange={(e) => updateGratitude(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Objectifs */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Objectifs et intentions
                  </label>
                  <div className="space-y-2">
                    {currentEntry.goals?.map((goal, index) => (
                      <Input
                        key={index}
                        placeholder={`Objectif ${index + 1}...`}
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addGoal}
                      className="w-full"
                    >
                      + Ajouter un objectif
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={saveEntry}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={!currentEntry.content?.trim()}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Sauvegarder la réflexion
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analyse et Historique */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Insights IA */}
            <AnimatePresence>
              {(aiInsights.length > 0 || isAnalyzing) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-2 border-blue-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-500" />
                        Insights IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isAnalyzing ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Analyse en cours...</span>
                          </div>
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {aiInsights.map((insight, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                            >
                              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{insight}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Historique */}
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Historique des réflexions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Vos réflexions apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {entries.map((entry, index) => {
                      const moodData = moodIcons[entry.mood as keyof typeof moodIcons];
                      const MoodEntryIcon = moodData.icon;
                      
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-800">{entry.title}</h3>
                            <div className={`p-1 rounded ${moodData.bg}`}>
                              <MoodEntryIcon className={`w-4 h-4 ${moodData.color}`} />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {entry.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{entry.timestamp.toLocaleDateString()}</span>
                            <div className="flex gap-1">
                              {entry.emotions.slice(0, 2).map(emotion => (
                                <Badge key={emotion} variant="outline" className="text-xs">
                                  {emotion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {entry.aiInsights.length > 0 && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <Brain className="w-3 h-3 text-blue-500" />
                                <span className="font-medium">Insight IA:</span>
                              </div>
                              <p className="text-gray-600">{entry.aiInsights[0]}</p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}