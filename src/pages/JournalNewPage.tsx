
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';

const JournalNewPage = () => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Le contenu du journal ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une entrée de journal",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create a new journal entry
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Generate simulated AI feedback
      const aiFeedback = generateAIFeedback();

      // Update the journal entry with AI feedback
      await supabase
        .from('journal_entries')
        .update({
          ai_feedback: aiFeedback,
        })
        .eq('id', data.id);

      toast({
        description: "Entrée de journal créée avec succès",
      });

      navigate('/journal');
    } catch (error: any) {
      console.error("Error creating journal entry:", error);
      toast({
        title: "Erreur",
        description: `Échec de la création de l'entrée de journal: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  return (
    <div className="container max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nouvelle entrée de journal</h1>

      <Card>
        <CardHeader>
          <CardTitle>Exprimez vos pensées</CardTitle>
          <CardDescription>
            Écrivez librement pour partager ce que vous ressentez aujourd'hui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comment s'est passée votre journée ? Quelles émotions avez-vous ressenties ?"
              className="min-h-[250px]"
            />
            
            <div className="flex justify-end gap-3">
              <Button
                type="button" 
                variant="outline"
                onClick={() => navigate('/journal')}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={submitting || !content.trim()}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalNewPage;
