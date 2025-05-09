
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JournalEntryFormProps {
  onSubmit: (data: any) => void;
  isSaving?: boolean;
  initialData?: {
    title?: string;
    content?: string;
    mood?: string;
  };
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSubmit,
  isSaving = false,
  initialData = {}
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [mood, setMood] = useState(initialData.mood || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert('Veuillez saisir un titre');
      return;
    }
    
    if (!content.trim()) {
      alert('Veuillez saisir un contenu');
      return;
    }
    
    if (!mood) {
      alert('Veuillez sélectionner une humeur');
      return;
    }
    
    const data = {
      title,
      content,
      mood,
      date: new Date().toISOString()
    };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de votre entrée"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mood">Humeur</Label>
        <Select value={mood} onValueChange={setMood} required>
          <SelectTrigger id="mood">
            <SelectValue placeholder="Sélectionnez votre humeur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="happy">Heureux(se)</SelectItem>
            <SelectItem value="calm">Calme</SelectItem>
            <SelectItem value="sad">Triste</SelectItem>
            <SelectItem value="anxious">Anxieux(se)</SelectItem>
            <SelectItem value="angry">En colère</SelectItem>
            <SelectItem value="tired">Fatigué(e)</SelectItem>
            <SelectItem value="energetic">Énergique</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comment vous sentez-vous aujourd'hui ?"
          className="min-h-[200px]"
          required
        />
      </div>
      
      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </form>
  );
};

export default JournalEntryForm;
