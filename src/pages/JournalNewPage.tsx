
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createJournalEntry } from '@/lib/journalService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const JournalNewPage = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez écrire quelque chose dans votre journal.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user) throw new Error("Utilisateur non connecté");
      
      await createJournalEntry(user.id, content);
      
      toast({
        title: "Entrée créée",
        description: "Votre entrée de journal a été enregistrée avec succès."
      });
      
      navigate('/journal');
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entrée de journal.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate('/journal')}
      >
        <ArrowLeft size={18} /> Retour au journal
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Nouvelle entrée de journal</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Qu'avez-vous en tête aujourd'hui ?</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Commencez à écrire ici..."
              className="min-h-[200px] resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Enregistrement...' : (
                <>
                  <Send size={18} />
                  Enregistrer
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default JournalNewPage;
