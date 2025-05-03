
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createJournalEntry } from '@/lib/journalService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

const JournalNewPage = () => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const prompts = [
    "Comment vous êtes-vous senti(e) aujourd'hui dans votre travail?",
    "Quelle a été la meilleure partie de votre journée?",
    "Y a-t-il quelque chose qui vous préoccupe actuellement?",
    "Comment prenez-vous soin de vous en ce moment?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez écrire quelque chose avant de sauvegarder.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createJournalEntry(user?.id || '', content);
      toast({
        title: "Entrée créée",
        description: "Votre entrée de journal a été sauvegardée avec succès."
      });
      navigate('/journal');
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entrée de journal. Veuillez réessayer.",
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
        <ArrowLeft size={18} /> Retour
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Nouvelle entrée de journal</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Écrivez votre journal</CardTitle>
            <CardDescription>
              Partagez vos pensées, émotions et expériences. Notre IA vous fournira un feedback personnalisé.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Commencez à écrire ici..."
              className="min-h-[250px] resize-y"
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full sm:w-auto flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingAnimation iconClassName="h-4 w-4" className="py-0" /> 
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Save size={18} /> Sauvegarder
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Suggestions de sujets</CardTitle>
          <CardDescription>
            Si vous ne savez pas par où commencer, essayez l'une de ces questions:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {prompts.map((prompt, index) => (
              <li 
                key={index}
                className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => setContent(prev => prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`)}
              >
                {prompt}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalNewPage;
