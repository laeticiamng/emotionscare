
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types';

const JournalEntryPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntry = async () => {
      if (!entryId) return;

      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', entryId)
          .single();

        if (error) throw error;
        setEntry(data as JournalEntry);
        setContent(data.content);
      } catch (error: any) {
        console.error('Error fetching journal entry:', error);
        toast({
          title: "Erreur",
          description: `Impossible de charger l'entrée: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId, toast]);

  const handleSave = async () => {
    if (!entryId || !content.trim()) return;

    setSaving(true);
    try {
      // Update the journal entry content
      await supabase
        .from('journal_entries')
        .update({ content })
        .eq('id', entryId);

      // Generate new AI feedback
      const aiFeedback = generateAIFeedback();
      
      // Update AI feedback
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ ai_feedback: aiFeedback })
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;

      setEntry(data as JournalEntry);
      setEditing(false);
      
      toast({
        description: "Entrée de journal mise à jour",
      });
    } catch (error: any) {
      console.error('Error updating journal entry:', error);
      toast({
        title: "Erreur",
        description: `Échec de la mise à jour: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryId) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      
      toast({
        description: "Entrée de journal supprimée",
      });
      
      navigate('/journal');
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Erreur",
        description: `Échec de la suppression: ${error.message}`,
        variant: "destructive"
      });
      setDeleting(false);
    }
  };

  // Function to generate fake AI feedback
  const generateAIFeedback = () => {
    const feedbackOptions = [
      "Je remarque une tonalité positive dans votre texte, c'est encourageant de voir que vous progressez dans votre bien-être.",
      "Votre entrée révèle une certaine introspection. Continuez à explorer vos pensées de manière constructive.",
      "Je détecte des signes de stress dans votre texte. Pensez à prendre quelques moments pour vous détendre aujourd'hui.",
      "Votre réflexion montre une belle capacité d'analyse. Continuez à cultiver cette conscience de soi.",
      "Je perçois des émotions mêlées dans votre texte. Rappelez-vous que c'est normal et que cela fait partie du processus de croissance personnelle."
    ];
    
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-semibold mb-4">Entrée non trouvée</h1>
        <Button onClick={() => navigate('/journal')}>Retour aux entrées</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Entrée du {new Date(entry.date).toLocaleDateString()}</h1>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/journal')}
          >
            Retour
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Votre texte</span>
              {!editing && (
                <Button 
                  variant="ghost" 
                  onClick={() => setEditing(true)}
                  size="sm"
                >
                  Modifier
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setContent(entry.content);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saving || !content.trim()}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {entry.ai_feedback && (
          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-800">Feedback IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700">{entry.ai_feedback}</p>
            </CardContent>
          </Card>
        )}

        {!editing && (
          <div className="flex justify-end">
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Suppression...' : 'Supprimer cette entrée'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalEntryPage;
