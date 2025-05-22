
import React, { useState, useEffect } from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  ai_feedback?: string;
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load journal entries when component mounts
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setEntries(data as JournalEntry[]);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos entrées de journal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!newEntry.trim()) {
      toast({
        title: "Entrée vide",
        description: "Veuillez écrire quelque chose avant d'enregistrer",
        variant: "default"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          { user_id: user?.id, content: newEntry }
        ])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Entrée enregistrée",
        description: "Votre entrée de journal a été sauvegardée"
      });

      setNewEntry('');
      fetchEntries(); // Refresh entries
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre entrée de journal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Journal émotionnel</h1>
          <p className="text-muted-foreground mb-6">
            Enregistrez vos pensées et suivez votre évolution émotionnelle
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nouvelle entrée</CardTitle>
              <CardDescription>
                Comment vous sentez-vous aujourd'hui? Partagez vos pensées et émotions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Écrivez ici..." 
                className="min-h-[150px]"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={saveEntry} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardFooter>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">Entrées précédentes</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="bg-card hover:bg-accent/10 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{formatDate(entry.date)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                  {entry.ai_feedback && (
                    <CardFooter className="border-t pt-4 text-sm">
                      <div>
                        <strong>Feedback IA:</strong>
                        <p className="text-muted-foreground">{entry.ai_feedback}</p>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Vous n'avez pas encore d'entrées dans votre journal</p>
            </div>
          )}
        </motion.div>
      </div>
    </Shell>
  );
};

export default JournalPage;
