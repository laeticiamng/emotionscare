import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Heart, Brain, Sparkles, TrendingUp, Calendar, Mic, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const B2CJournalPageEnhanced = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [journalHistory, setJournalHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const emotions = [
    { name: 'Joie', color: 'bg-yellow-500', icon: '😊' },
    { name: 'Sérénité', color: 'bg-blue-500', icon: '😌' },
    { name: 'Énergie', color: 'bg-orange-500', icon: '⚡' },
    { name: 'Confiance', color: 'bg-green-500', icon: '💪' },
    { name: 'Gratitude', color: 'bg-purple-500', icon: '🙏' },
    { name: 'Créativité', color: 'bg-pink-500', icon: '🎨' }
  ];

  const analyzeJournal = async () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez écrire quelque chose avant d'analyser.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: {
          text: journalEntry,
          emotion_context: 'journal_entry'
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      
      toast({
        title: "Journal analysé",
        description: "Votre entrée a été analysée avec succès.",
      });
    } catch (error) {
      console.error('Erreur analyse journal:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre journal.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: "Enregistrement vocal",
      description: isRecording ? "Enregistrement arrêté" : "Enregistrement démarré",
    });
  };

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
            <BookOpen className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Journal Émotionnel Intelligent
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez vos émotions avec l'intelligence artificielle pour un bien-être optimal au travail
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Zone d'écriture principale */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Votre Journal du {new Date(selectedDate).toLocaleDateString('fr-FR')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startVoiceRecording}
                    className="flex items-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    Vocal
                  </Button>
                </div>

                <Textarea
                  placeholder="Comment vous sentez-vous aujourd'hui ? Décrivez vos émotions, vos pensées, vos réflexions sur votre journée de travail..."
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="min-h-[300px] text-base leading-relaxed border-2 focus:border-indigo-500 transition-colors"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setJournalEntry(prev => prev + ` ${emotion.icon} ${emotion.name.toLowerCase()}`)}
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${emotion.color} hover:opacity-90 transition-opacity`}
                    >
                      {emotion.icon} {emotion.name}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={analyzeJournal}
                    disabled={isAnalyzing || !journalEntry.trim()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
                  >
                    {isAnalyzing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-2"
                      >
                        <Brain className="h-5 w-5" />
                        Analyse en cours...
                      </motion.div>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Analyser avec l'IA
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analyse et historique */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Résultats d'analyse */}
            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        Analyse IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Émotion principale</h4>
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {analysis.primary_emotion}
                        </Badge>
                      </div>

                      {analysis.secondary_emotions && analysis.secondary_emotions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Émotions secondaires</h4>
                          <div className="flex flex-wrap gap-1">
                            {analysis.secondary_emotions.map((emotion, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">Intensité</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(analysis.intensity / 10) * 100}%` }}
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-600">{analysis.intensity}/10</span>
                      </div>

                      {analysis.recommendations && (
                        <div>
                          <h4 className="font-semibold mb-2">Recommandations</h4>
                          <ul className="text-sm space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <TrendingUp className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default B2CJournalPageEnhanced;