import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Loader2 } from 'lucide-react';
import { useJournalStore } from '@/store/journal.store';

interface TextEditorProps {
  onSubmit: (text: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const { uploading } = useJournalStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !uploading) {
      onSubmit(text.trim());
      setText('');
    }
  };

  const maxLength = 2000;
  const remaining = maxLength - text.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="journal-note">
          Écrire une note
        </Label>
        <Textarea
          id="journal-note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Quelques lignes suffisent... Comment te sens-tu aujourd'hui ?"
          maxLength={maxLength}
          rows={6}
          disabled={uploading}
          aria-describedby="char-count-help"
          className="resize-none"
        />
        <div 
          id="char-count-help"
          className="flex justify-between items-center text-sm text-muted-foreground"
        >
          <span>Quelques lignes suffisent</span>
          <span className={remaining < 100 ? 'text-warning' : ''}>
            {remaining} caractères restants
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!text.trim() || uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Enregistrer
          </>
        )}
      </Button>
    </form>
  );
};