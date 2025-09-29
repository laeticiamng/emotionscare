
import React from 'react';
import { JournalEntry } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEmotionIcon, getEmotionColor } from '@/lib/emotionUtils';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';

interface JournalListViewProps {
  entries: JournalEntry[];
  onDeleteEntry: (id: string, e: React.MouseEvent) => void;
}

const JournalListView: React.FC<JournalListViewProps> = ({ entries, onDeleteEntry }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md border-dashed bg-muted/20">
        <p className="text-muted-foreground">Aucune entrée dans votre journal pour l'instant.</p>
        <Link to={routes.consumer.journal() + '/new'} className="text-primary hover:underline mt-2 inline-block">
          Créer ma première entrée
        </Link>
      </div>
    );
  }

  // Tri des entrées par date (la plus récente en premier)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      {sortedEntries.map((entry) => {
        // Use either mood or emotion field, defaulting to 'neutral'
        const emotionValue = entry.mood || entry.emotion || 'neutral';
        const emotionColorClass = getEmotionColor(emotionValue);
        
        return (
          <Card key={entry.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span>{entry.title}</span>
                  <Badge 
                    className={`${emotionColorClass} ml-2`}
                  >
                    {getEmotionIcon(emotionValue)} {emotionValue}
                  </Badge>
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.date), { addSuffix: true, locale: fr })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{entry.content}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {entry.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to={routes.consumer.journal() + '/' + entry.id}>
                <Button variant="ghost" size="icon">
                  <Edit size={18} />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => onDeleteEntry(entry.id, e)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={18} />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default JournalListView;
