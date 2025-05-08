import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileEdit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalListViewProps {
  entries: JournalEntry[];
  onDeleteEntry: (id: string, e: React.MouseEvent) => void;
}

const JournalListView: React.FC<JournalListViewProps> = ({ entries, onDeleteEntry }) => {
  const navigate = useNavigate();
  
  const truncateContent = (content: string, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getEntryContent = (entry: JournalEntry) => {
    return entry.text || entry.content || "";
  };

  if (entries.length === 0) {
    return <EmptyJournal navigate={navigate} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-1">
      {entries.map(entry => (
        <Card 
          key={entry.id} 
          className="cursor-pointer transition-all hover:shadow-md overflow-hidden"
          onClick={() => navigate(`/journal/${entry.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                {format(new Date(entry.date), 'EEEE d MMMM yyyy', { locale: fr })}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:bg-destructive/10"
                onClick={(e) => onDeleteEntry(entry.id, e)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="line-clamp-3 text-muted-foreground">{getEntryContent(entry)}</div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="text-sm text-primary flex items-center gap-1">
              <FileEdit size={16} /> Voir le détail
            </div>
            {entry.ai_feedback && (
              <div className="ml-auto px-2 py-1 bg-cocoon-100 text-cocoon-800 rounded-full text-xs">
                Analysé par Coach IA
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const EmptyJournal = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-xl">
      <div className="max-w-md mx-auto">
        <FileEdit className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Votre journal est vide</h3>
        <p className="text-muted-foreground mb-6">
          Le journal est un excellent moyen de suivre vos émotions et réflexions. Commencez dès aujourd'hui pour améliorer votre bien-être mental.
        </p>
        <Button onClick={() => navigate('/journal/new')} className="flex items-center gap-2 mx-auto">
          <FileEdit size={18} /> Créer votre première entrée
        </Button>
      </div>
    </div>
  );
};

export default JournalListView;
