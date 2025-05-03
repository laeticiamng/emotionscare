
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Save, ArrowLeft } from 'lucide-react';

const JournalNewPage = () => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Entrée vide",
        description: "Veuillez écrire quelque chose avant de sauvegarder.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer une entrée de journal.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Create journal entry
      const { data: entryData, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Generate AI feedback (simulated)
      const feedback = generateFakeAIFeedback(content);
      
      // Update entry with AI feedback
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ ai_feedback: feedback })
        .eq('id', entryData.id);
      
      if (updateError) throw updateError;

      toast({
        title: "Entrée sauvegardée",
        description: "Votre entrée de journal a été enregistrée avec succès."
      });

      navigate('/journal');
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder l'entrée: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
      
      <h1 className="text-3xl font-bold mb-6">Nouvelle entrée de journal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Exprimez-vous librement</CardTitle>
          <CardDescription>
            Écrivez vos pensées, émotions et réflexions du jour. Notre IA vous proposera un feedback personnalisé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comment s'est passée votre journée ? Quelles émotions avez-vous ressenties ? Y a-t-il des moments dont vous souhaitez vous souvenir ?"
            className="min-h-[300px]"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSave} 
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
      </Card>
    </div>
  );
};

export default JournalNewPage;
