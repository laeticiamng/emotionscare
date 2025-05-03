
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types';
import { Save, Trash, ArrowLeft, Bot } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const JournalEntryPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!entryId || !user) return;

    const fetchEntry = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', entryId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setEntry(data);
          setContent(data.content);
        }
      } catch (error: any) {
        console.error('Error fetching journal entry:', error);
        toast({
          title: "Erreur",
          description: `Impossible de charger l'entrée: ${error.message}`,
          variant: "destructive"
        });
        navigate('/journal');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId, user, toast, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleUpdate = async () => {
    if (!content.trim() || !entryId || !user) return;

    setSaving(true);
    try {
      // Update journal entry
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ content: content.trim() })
        .eq('id', entryId)
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      // Generate new AI feedback (simulated)
      const feedback = generateFakeAIFeedback(content);
      
      // Update AI feedback
      const { error: feedbackError } = await supabase
        .from('journal_entries')
        .update({ ai_feedback: feedback })
        .eq('id', entryId)
        .eq('user_id', user.id);
      
      if (feedbackError) throw feedbackError;
      
      // Fetch updated entry
      const { data: updatedEntry, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .single();
      
      if (fetchError) throw fetchError;
      
      setEntry(updatedEntry);
      setIsEditing(false);
      
      toast({
        title: "Entrée mise à jour",
        description: "Votre entrée de journal a été mise à jour avec succès."
      });
    } catch (error: any) {
      console.error('Error updating journal entry:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'entrée: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryId || !user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Entrée supprimée",
        description: "Votre entrée de journal a été supprimée avec succès."
      });
      
      navigate('/journal');
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'entrée: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // Fake AI feedback generator
  const generateFakeAIFeedback = (text: string) => {
    const templates = [
      "Votre journal reflète un état d'esprit plutôt positif. Je perçois une résilience et une détermination dans vos mots. Continuez à cultiver cette attitude constructive face aux défis quotidiens.",
      "Je détecte des signes de fatigue dans votre entrée. Accordez-vous du repos et priorisez votre bien-être ces prochains jours. Une micro-pause VR pourrait vous aider à vous ressourcer.",
      "Votre journal évoque des questionnements profonds. Ces réflexions sont précieuses pour votre développement personnel. Prenez le temps d'explorer ces pensées à travers des exercices de pleine conscience.",
      "Je perçois un sentiment d'accomplissement dans votre entrée. Célébrez ces petites victoires et reconnaissez vos efforts. Ces moments positifs contribuent grandement à votre équilibre émotionnel.",
      "Votre journal semble refléter une période de transition. Ces moments peuvent être déstabilisants mais aussi riches en opportunités de croissance. Soyez bienveillant envers vous-même pendant cette phase."
    ];
    
    // Randomly select a feedback template
    return templates[Math.floor(Math.random() * templates.length)];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container text-center py-12">
        <h2 className="text-xl font-medium">Entrée non trouvée</h2>
        <p className="text-muted-foreground mt-2 mb-6">Cette entrée de journal n'existe pas ou vous n'avez pas les permissions requises.</p>
        <Button onClick={() => navigate('/journal')}>Retourner au journal</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/journal')}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au journal
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Journal du {formatDate(entry.date)}</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <Button 
              onClick={() => {
                setContent(entry.content);
                setIsEditing(false);
              }}
              variant="outline"
            >
              Annuler
            </Button>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Modifier
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer cette entrée ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. L'entrée de journal sera définitivement supprimée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Votre texte</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            ) : (
              <p className="whitespace-pre-line">{entry.content}</p>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleUpdate}
                disabled={saving || !content.trim()}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {entry.ai_feedback && (
          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-indigo-800 gap-2">
                <Bot className="h-5 w-5" />
                Feedback IA
              </CardTitle>
              <CardDescription className="text-indigo-600">
                Analyse personnalisée basée sur votre journal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-indigo-700">
                {entry.ai_feedback}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JournalEntryPage;
