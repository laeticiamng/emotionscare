// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, Plus, Search, Heart, Tag, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { b2cDashboardService } from '@/services/b2cDashboardService';
import { logger } from '@/lib/logger';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: Date;
  emotionScore?: number;
  aiAnalysis?: string;
  isVoiceEntry?: boolean;
  imageUrl?: string;
}

const moodOptions = [
  { value: 'amazing', label: 'Incroyable', color: 'bg-green-100 text-green-800', emoji: '🌟' },
  { value: 'great', label: 'Excellent', color: 'bg-blue-100 text-blue-800', emoji: '😊' },
  { value: 'good', label: 'Bon', color: 'bg-cyan-100 text-cyan-800', emoji: '🙂' },
  { value: 'okay', label: 'Correct', color: 'bg-yellow-100 text-yellow-800', emoji: '😐' },
  { value: 'bad', label: 'Difficile', color: 'bg-orange-100 text-orange-800', emoji: '😔' },
  { value: 'terrible', label: 'Très difficile', color: 'bg-red-100 text-red-800', emoji: '😢' }
];

export const JournalModule: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: '', tags: [] as string[] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  // Simuler des entrées existantes
  useEffect(() => {
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'Première journée de printemps',
        content: 'Aujourd\'hui, j\'ai ressenti une énergie nouvelle avec l\'arrivée du printemps. Les oiseaux chantent et ça me remplit de joie.',
        mood: 'great',
        tags: ['printemps', 'nature', 'optimisme'],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        emotionScore: 0.85,
        aiAnalysis: 'Entrée très positive montrant une connexion forte avec la nature et un sentiment d\'espoir.'
      },
      {
        id: '2',
        title: 'Journée challenging au travail',
        content: 'Beaucoup de pression aujourd\'hui, mais j\'ai réussi à surmonter les obstacles. Fier de ma persévérance.',
        mood: 'okay',
        tags: ['travail', 'défis', 'persévérance'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        emotionScore: 0.6
      }
    ];
    setEntries(mockEntries);
  }, []);

  const handleSaveEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim() || !newEntry.mood) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Analyser l'émotion avec l'IA
      const analysis = await b2cDashboardService.analyzeJournal(
        `${newEntry.title} - ${newEntry.content}`
      );

      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: newEntry.tags,
        createdAt: new Date(),
        aiAnalysis: analysis.ai_feedback
      };

      setEntries(prev => [entry, ...prev]);
      setNewEntry({ title: '', content: '', mood: '', tags: [] });
      setIsWriting(false);
      toast.success('Entrée sauvegardée et analysée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      logger.error('Erreur sauvegarde journal', error as Error, 'UI');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !newEntry.tags.includes(currentTag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const getMoodConfig = (mood: string) => {
    return moodOptions.find(option => option.value === mood) || moodOptions[3];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Journal Émotionnel</h1>
            <p className="text-muted-foreground">
              Documentez vos émotions et suivez votre évolution personnelle
            </p>
          </div>
        </div>
        
        <Button onClick={() => setIsWriting(true)} disabled={isWriting}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle entrée
        </Button>
      </div>

      {isWriting ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Entrée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Donnez un titre à votre entrée..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">État d'esprit</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {moodOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setNewEntry(prev => ({ ...prev, mood: option.value }))}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        newEntry.mood === option.value
                          ? `${option.color} border-current`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contenu</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Exprimez-vous librement... Comment vous sentez-vous aujourd'hui ?"
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newEntry.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEntry} disabled={isAnalyzing} className="flex-1">
                  {isAnalyzing ? (
                    <>
                      <Heart className="h-4 w-4 mr-2 animate-pulse" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsWriting(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher dans vos entrées..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Tous les états</option>
                    {moodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.emoji} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Entrées totales</p>
                    <p className="text-2xl font-bold">{entries.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Cette semaine</p>
                    <p className="text-2xl font-bold">
                      {entries.filter(e => 
                        new Date(e.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-pink-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Humeur moyenne</p>
                    <p className="text-2xl font-bold">
                      {entries.length > 0 && getMoodConfig(entries[0].mood).emoji}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Tag className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Tags uniques</p>
                    <p className="text-2xl font-bold">
                      {new Set(entries.flatMap(e => e.tags)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des entrées */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{entry.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getMoodConfig(entry.mood).color}>
                                {getMoodConfig(entry.mood).emoji} {getMoodConfig(entry.mood).label}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {entry.createdAt.toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3 line-clamp-3">{entry.content}</p>
                        
                        {entry.aiAnalysis && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                              💡 Analyse IA
                            </h4>
                            <p className="text-sm text-blue-800">{entry.aiAnalysis}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {entry.emotionScore && (
                            <div className="text-xs text-muted-foreground">
                              Score émotionnel: {Math.round(entry.emotionScore * 100)}%
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Aucune entrée trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedMood
                        ? 'Essayez de modifier vos filtres de recherche'
                        : 'Commencez à écrire votre premier journal émotionnel'
                      }
                    </p>
                    {!searchTerm && !selectedMood && (
                      <Button onClick={() => setIsWriting(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer ma première entrée
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};