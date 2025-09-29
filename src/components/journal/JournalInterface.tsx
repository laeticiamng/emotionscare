
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/loading/LoadingState';
import { UnifiedEmptyState } from '@/components/ui/unified-empty-state';
import { BookOpen, Plus, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useError } from '@/contexts';
import { sanitizeUserContent } from '@/lib/security/sanitize';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  ai_feedback?: string;
}

const JournalInterface: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useError();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;

      const journalEntries = data?.map(entry => ({
        id: entry.id,
        content: sanitizeUserContent(entry.content ?? ''),
        date: entry.date,
        ai_feedback: entry.ai_feedback ? sanitizeUserContent(entry.ai_feedback) : undefined
      })) || [];

      setEntries(journalEntries);
    } catch (error) {
      console.error('Erreur chargement journal:', error);
      notify(
        {
          code: 'SERVER',
          messageKey: 'errors.journalError',
          cause: error instanceof Error ? { message: error.message, stack: error.stack } : error,
          context: {
            scope: 'journal-load-entries',
          },
        },
        { route: '/app/journal', feature: 'journal-load' },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!newEntry.trim()) return;

    setIsAnalyzing(true);
    try {
      const sanitizedEntry = sanitizeUserContent(newEntry);

      if (!sanitizedEntry) {
        setIsAnalyzing(false);
        return;
      }

      // Sauvegarder l'entrée
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          content: sanitizedEntry,
          date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Obtenir une analyse IA
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-journal', {
          body: {
            content: sanitizedEntry,
            journal_id: data.id
          }
        });

        if (!analysisError && analysisData?.ai_feedback) {
          // Mettre à jour avec l'analyse IA
          await supabase
            .from('journal_entries')
            .update({ ai_feedback: analysisData.ai_feedback })
            .eq('id', data.id);
        }
      } catch (analysisError) {
        console.error('Erreur analyse IA:', analysisError);
        notify(
          {
            code: 'SERVER',
            messageKey: 'errors.journalError',
            cause:
              analysisError instanceof Error
                ? { message: analysisError.message, stack: analysisError.stack }
                : analysisError,
            context: {
              scope: 'journal-ai-analysis',
            },
          },
          { route: '/app/journal', feature: 'journal-ai-analysis' },
        );
      }

      // Recharger les entrées
      await loadEntries();
      setNewEntry('');
      setIsWriting(false);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      notify(
        {
          code: 'SERVER',
          messageKey: 'errors.journalError',
          cause: error instanceof Error ? { message: error.message, stack: error.stack } : error,
          context: {
            scope: 'journal-save-entry',
          },
        },
        { route: '/app/journal', feature: 'journal-save' },
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        variant="page"
        text="Chargement de votre journal..."
        skeletonCount={3}
        className="min-h-[320px]"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* New Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Mon Journal
            </div>
            {!isWriting && (
              <Button size="sm" onClick={() => setIsWriting(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle entrée
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <AnimatePresence>
          {isWriting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="space-y-4">
                <Textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="Qu'est-ce qui vous passe par la tête aujourd'hui ?"
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {newEntry.length} caractères
                  </p>
                  <div className="space-x-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsWriting(false);
                        setNewEntry('');
                      }}
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleSaveEntry}
                      disabled={!newEntry.trim() || isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Analyse...
                        </>
                      ) : (
                        'Sauvegarder'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <UnifiedEmptyState
            variant="card"
            icon={BookOpen}
            title="Votre journal est vide"
            description="Commencez par écrire votre première entrée pour suivre votre évolution émotionnelle."
            animated={false}
          />
        ) : (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {entry.ai_feedback && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Analysé par IA
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                  </div>
                  
                  {entry.ai_feedback && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Analyse émotionnelle
                      </h4>
                      <p className="text-sm text-muted-foreground">{entry.ai_feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalInterface;
