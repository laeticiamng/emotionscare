
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import JournalPageHeader from '@/components/journal/JournalPageHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PenLine, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const JournalNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !mood) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simuler la sauvegarde de l'entrée
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Entrée sauvegardée",
        description: "Votre nouvelle entrée de journal a été enregistrée avec succès."
      });
      
      navigate('/journal');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de votre entrée.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/journal');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <JournalPageHeader 
          title="Nouvelle entrée de journal" 
          icon={<PenLine className="h-5 w-5" />}
        />
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Donnez un titre à votre entrée"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="mood">Humeur</Label>
                <Select
                  value={mood}
                  onValueChange={setMood}
                  required
                >
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Comment vous sentez-vous?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Joyeux</SelectItem>
                    <SelectItem value="calm">Calme</SelectItem>
                    <SelectItem value="anxious">Anxieux</SelectItem>
                    <SelectItem value="sad">Triste</SelectItem>
                    <SelectItem value="angry">En colère</SelectItem>
                    <SelectItem value="neutral">Neutre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  placeholder="Décrivez vos émotions, pensées et expériences..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  placeholder="travail, famille, loisirs..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde en cours...' : 'Enregistrer l\'entrée'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default JournalNewPage;
