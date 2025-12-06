import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  Heart,
  Send,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedPostComposerProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
}

export const EnhancedPostComposer: React.FC<EnhancedPostComposerProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Partage ton ressenti... Sois honnête, pas besoin de perfection.',
}) => {
  const [content, setContent] = useState('');
  const [formats, setFormats] = useState<FormatState>({ bold: false, italic: false });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const charCount = content.length;
  const maxChars = 2000;

  const insertFormat = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selected +
      after +
      content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + before.length;
        textareaRef.current.selectionEnd = start + before.length + selected.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleBold = () => {
    insertFormat('**', '**');
    setFormats(prev => ({ ...prev, bold: !prev.bold }));
  };

  const handleItalic = () => {
    insertFormat('_', '_');
    setFormats(prev => ({ ...prev, italic: !prev.italic }));
  };

  const handleList = () => {
    insertFormat('\n• ');
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: 'Message vide',
        description: 'Écris quelques mots avant de partager.',
      });
      return;
    }

    onSubmit(content);
    setContent('');
    setFormats({ bold: false, italic: false });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-emerald-700 mb-2">
          Partage avec le cœur
        </h3>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
          placeholder={placeholder}
          className="min-h-[120px] resize-y border-emerald-100 focus:ring-emerald-500"
          aria-label="Contenu du message"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" role="group" aria-label="Options de formatage">
          <Button
            type="button"
            size="sm"
            variant={formats.bold ? 'default' : 'outline'}
            onClick={handleBold}
            title="Gras (Ctrl+B)"
            aria-pressed={formats.bold}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={formats.italic ? 'default' : 'outline'}
            onClick={handleItalic}
            title="Italique (Ctrl+I)"
            aria-pressed={formats.italic}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleList}
            title="Liste à puces"
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="h-8 border-l border-emerald-100" aria-hidden="true" />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setContent(content + ' 💚')}
            title="Ajouter un cœur"
            className="h-8 w-8 p-0"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <span className="text-xs text-muted-foreground ml-auto">
          {charCount}/{maxChars}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-emerald-600">
          Avant d'envoyer, prends un instant pour respirer.
        </p>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !content.trim()}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Envoi...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Partager avec douceur
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
