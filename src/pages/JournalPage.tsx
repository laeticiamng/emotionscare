
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Pen, Search, Calendar, Heart, Star, TrendingUp, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const JournalPage: React.FC = () => {
  const [newEntry, setNewEntry] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const moods = [
    { emoji: '😊', name: 'Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😌', name: 'Calme', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😴', name: 'Fatigué', color: 'bg-gray-100 text-gray-800' },
    { emoji: '😟', name: 'Anxieux', color: 'bg-orange-100 text-orange-800' },
    { emoji: '😢', name: 'Triste', color: 'bg-red-100 text-red-800' },
    { emoji: '🤔', name: 'Pensif', color: 'bg-purple-100 text-purple-800' },
    { emoji: '😤', name: 'Frustré', color: 'bg-red-100 text-red-800' },
    { emoji: '🥳', name: 'Excité', color: 'bg-green-100 text-green-800' }
  ];

  const journalEntries = [
    {
      id: 1,
      title: 'Une journée productive',
      content: 'Aujourd\'hui j\'ai réussi à terminer tous mes projets en cours. Je me sens accompli et fier de mes efforts. La méditation matinale m\'a vraiment aidé à rester focus.',
      date: '2024-12-15',
      time: '18:30',
      mood: { emoji: '😊', name: 'Joyeux' },
      tags: ['travail', 'productivité', 'méditation'],
      wordCount: 156
    },
    {
      id: 2,
      title: 'Réflexions sur le changement',
      content: 'Je traverse une période de transition importante dans ma vie. Parfois c\'est effrayant, mais je sais que c\'est nécessaire pour grandir. L\'incertitude fait partie du processus.',
      date: '2024-12-14',
      time: '21:15',
      mood: { emoji: '🤔', name: 'Pensif' },
      tags: ['réflexion', 'changement', 'croissance'],
      wordCount: 203
    },
    {
      id: 3,
      title: 'Gratitude du soir',
      content: 'Trois choses pour lesquelles je suis reconnaissant aujourd\'hui : ma santé, ma famille, et ce délicieux café du matin qui a lancé ma journée parfaitement.',
      date: '2024-12-13',
      time: '22:00',
      mood: { emoji: '😌', name: 'Calme' },
      tags: ['gratitude', 'famille', 'bien-être'],
      wordCount: 134
    }
  ];

  const journalPrompts = [
    'Qu\'est-ce qui m\'a rendu heureux aujourd\'hui ?',
    'Quel défi ai-je surmonté récemment ?',
    'Comment puis-je prendre soin de moi demain ?',
    'Quelle leçon ai-je apprise cette semaine ?',
    'Pour quoi suis-je reconnaissant en ce moment ?',
    'Qu\'est-ce qui me préoccupe et comment puis-je l\'aborder ?'
  ];

  const stats = {
    totalEntries: 47,
    streakDays: 12,
    averageWords: 178,
    mostFrequentMood: 'Calme'
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const saveEntry = () => {
    if (newEntry.trim() && selectedMood) {
      // Logique de sauvegarde ici
      setNewEntry('');
      setEntryTitle('');
      setSelectedMood(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Journal Personnel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez vos pensées, suivez vos émotions et cultivez votre bien-être intérieur
          </p>
        </motion.div>

        <Tabs defaultValue="write" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="write">Écrire</TabsTrigger>
            <TabsTrigger value="entries">Mes Entrées</TabsTrigger>
            <TabsTrigger value="prompts">Inspiration</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pen className="h-5 w-5 mr-2" />
                    Nouvelle Entrée
                  </CardTitle>
                  <CardDescription>
                    Prenez un moment pour réfléchir et noter vos pensées
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre (optionnel)</label>
                    <Input
                      placeholder="Donnez un titre à votre entrée..."
                      value={entryTitle}
                      onChange={(e) => setEntryTitle(e.target.value)}
                    />
                  </div>

                  {/* Mood Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Comment vous sentez-vous ?</label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood.name}
                          onClick={() => setSelectedMood(mood.name)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            selectedMood === mood.name
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-xs">{mood.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Vos pensées</label>
                    <Textarea
                      placeholder="Écrivez librement vos pensées, émotions, ou réflexions du jour..."
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      className="min-h-[300px] resize-none"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{newEntry.length} caractères</span>
                      <span>{newEntry.trim().split(' ').filter(word => word.length > 0).length} mots</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Mic className="h-4 w-4 mr-2" />
                        Dicter
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => {
                        setNewEntry('');
                        setEntryTitle('');
                        setSelectedMood(null);
                      }}>
                        Effacer
                      </Button>
                      <Button 
                        onClick={saveEntry}
                        disabled={!newEntry.trim() || !selectedMood}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="entries">
            <div className="space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher dans vos entrées..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Entries */}
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{entry.mood.emoji}</div>
                            <div>
                              <CardTitle className="text-lg">{entry.title}</CardTitle>
                              <CardDescription>
                                {entry.date} à {entry.time} • {entry.wordCount} mots
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={moods.find(m => m.name === entry.mood.name)?.color}>
                            {entry.mood.name}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {entry.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm">
                            Lire plus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prompts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Prompts d'Écriture
                  </CardTitle>
                  <CardDescription>
                    Des questions pour vous inspirer et approfondir votre réflexion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {journalPrompts.map((prompt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                      >
                        <p className="text-gray-800 mb-3">{prompt}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          Écrire sur ce sujet
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Statistiques d'Écriture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
                        <div className="text-sm text-gray-600">Entrées Total</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.streakDays}</div>
                        <div className="text-sm text-gray-600">Jours Consécutifs</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{stats.averageWords}</div>
                        <div className="text-sm text-gray-600">Mots en Moyenne</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{stats.mostFrequentMood}</div>
                        <div className="text-sm text-gray-600">Humeur Fréquente</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Évolution Émotionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moods.slice(0, 5).map((mood, index) => (
                      <div key={mood.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{mood.emoji}</span>
                          <span className="text-sm">{mood.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-10">
                            {Math.floor(Math.random() * 30)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JournalPage;
