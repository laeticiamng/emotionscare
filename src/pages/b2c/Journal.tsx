
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PenLine, Plus, Calendar, Trash2, Edit3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalEntry {
  id: string;
  content: string;
  ai_feedback?: string;
  date: string;
  created_at: string;
  mood?: string;
  tags?: string[];
}

const moodOptions = [
  { value: 'great', label: '😄 Excellent', color: 'bg-green-500' },
  { value: 'good', label: '😊 Bien', color: 'bg-blue-500' },
  { value: 'neutral', label: '😐 Neutre', color: 'bg-gray-500' },
  { value: 'bad', label: '😔 Difficile', color: 'bg-orange-500' },
  { value: 'terrible', label: '😢 Très difficile', color: 'bg-red-500' },
];

const B2CJournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ content: '', mood: '', tags: '' });
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos entrées de journal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newEntry.content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const entryData = {
        user_id: user.id,
        content: newEntry.content.trim(),
        mood: newEntry.mood || null,
        tags: newEntry.tags ? newEntry.tags.split(',').map(tag => tag.trim()) : [],
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single();

      if (error) throw error;

      // Generate AI feedback asynchronously
      generateAIFeedback(data.id, newEntry.content);

      setEntries(prev => [data, ...prev]);
      setNewEntry({ content: '', mood: '', tags: '' });
      setIsDialogOpen(false);

      toast({
        title: "Entrée ajoutée !",
        description: "Votre réflexion a été sauvegardée avec succès.",
      });

      // Track analytics event
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'journalEntryAdded',
          userId: user.id,
          metadata: { mood: newEntry.mood, hasAIFeedback: true }
        })
      }).catch(console.error);

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entrée:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre entrée",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIFeedback = async (entryId: string, content: string) => {
    try {
      const response = await fetch('/api/journal/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const { feedback } = await response.json();
        
        // Update the entry with AI feedback
        await supabase
          .from('journal_entries')
          .update({ ai_feedback: feedback })
          .eq('id', entryId);

        // Update local state
        setEntries(prev => prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, ai_feedback: feedback }
            : entry
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la génération du feedback IA:', error);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast({
        title: "Entrée supprimée",
        description: "L'entrée a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodInfo = (mood: string) => {
    return moodOptions.find(option => option.value === mood);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Journal émotionnel</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journal émotionnel</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle entrée
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Ajouter une entrée</DialogTitle>
              <DialogDescription>
                Prenez un moment pour réfléchir à votre journée et vos émotions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment vous sentez-vous ?</label>
                <div className="flex gap-2 flex-wrap">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        newEntry.mood === mood.value
                          ? `${mood.color} text-white`
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Votre réflexion</label>
                <Textarea
                  placeholder="Décrivez votre journée, vos émotions, vos pensées..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (optionnel)</label>
                <Input
                  placeholder="travail, famille, stress (séparés par des virgules)"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!newEntry.content.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <p className="text-muted-foreground">
        Suivez vos émotions au fil du temps et bénéficiez de conseils personnalisés de notre IA.
      </p>
      
      {entries.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <PenLine className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucune entrée pour le moment</h3>
            <p className="text-muted-foreground mb-4">
              Commencez votre journal émotionnel dès aujourd'hui pour suivre votre bien-être.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Créer ma première entrée
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(entry.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.mood && (
                          <Badge variant="secondary" className={`${getMoodInfo(entry.mood)?.color} text-white`}>
                            {getMoodInfo(entry.mood)?.label}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {entry.content}
                    </p>
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {entry.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {entry.ai_feedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs font-bold">IA</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Feedback de votre coach IA
                            </p>
                            <p className="text-sm text-blue-800">
                              {entry.ai_feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default B2CJournalPage;
