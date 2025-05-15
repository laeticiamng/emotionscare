
import React, { useState, useEffect } from 'react';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalEntryList from '@/components/journal/JournalEntryList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournalEntry } from '@/hooks/useJournalEntry';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, ListFilter, Plus, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { JournalEntry } from '@/types';
import { getJournalEntries } from '@/lib/journalService';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserJournal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { isSaving, backgroundGradient, setCurrentEmotion, handleSave, setRandomGradient } = useJournalEntry();

  useEffect(() => {
    setRandomGradient();
    loadEntries();
  }, []);

  const loadEntries = async () => {
    if (user?.id) {
      try {
        const journalEntries = await getJournalEntries(user.id);
        setEntries(journalEntries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  };

  const handleViewEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setSelectedEntry(entry);
      setActiveTab('view');
    }
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setActiveTab('write');
  };

  return (
    <div className={`container mx-auto py-6 min-h-screen ${backgroundGradient}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Journal Professionnel</h1>
          <p className="text-muted-foreground">
            Suivez vos émotions et réflexions dans un contexte professionnel pour améliorer votre bien-être au travail.
          </p>
        </div>
        <Button onClick={handleNewEntry} className="flex items-center gap-2">
          <Plus size={18} />
          Nouvelle entrée
        </Button>
      </motion.div>

      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/40 rounded-lg flex gap-2 items-center">
        <Lock size={18} className="text-yellow-600 dark:text-yellow-400" />
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          Vos notes sont confidentielles et ne sont jamais partagées avec votre employeur sans votre consentement explicite.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px] mb-4">
          <TabsTrigger value="write" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Écrire</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-2" disabled={!selectedEntry}>
            <ListFilter size={16} />
            <span className="hidden sm:inline">Détail</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <JournalEntryForm
                onSubmit={async (data) => {
                  await handleSave(data);
                  loadEntries();
                  setActiveTab('history');
                }}
                isSaving={isSaving}
                onEmotionSelect={setCurrentEmotion}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Vos entrées de journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JournalEntryList entries={entries} onViewEntry={handleViewEntry} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          {selectedEntry && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedEntry.title}</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleNewEntry}>
                    <Plus size={16} className="mr-2" />
                    Nouvelle entrée
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {new Date(selectedEntry.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>Humeur: {selectedEntry.mood}</span>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedEntry.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {selectedEntry.ai_feedback && (
                    <Card className="mt-6 bg-primary-foreground/30">
                      <CardHeader>
                        <CardTitle className="text-base">Analyse IA professionnelle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{selectedEntry.ai_feedback}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserJournal;
