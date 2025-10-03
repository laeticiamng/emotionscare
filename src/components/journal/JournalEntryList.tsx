
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JournalEntry {
  id: string;
  title: string;
  date: Date;
  mood: string;
  content: string;
  tags: string[];
}

interface JournalEntryListProps {
  entries: JournalEntry[];
  onViewEntry: (id: string) => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ entries, onViewEntry }) => {
  // Fonction pour obtenir la couleur du badge selon l'humeur
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'calm':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'anxious':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'sad':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'angry':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Fonction pour traduire les humeurs en français
  const translateMood = (mood: string) => {
    const translations: Record<string, string> = {
      happy: 'Joie',
      calm: 'Calme',
      anxious: 'Anxiété',
      sad: 'Tristesse',
      angry: 'Colère'
    };
    return translations[mood] || mood;
  };

  if (!entries || entries.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        Aucune entrée ne correspond à vos critères de recherche.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <Card key={entry.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{entry.title}</h3>
              <div className="flex items-center">
                <Badge className={getMoodColor(entry.mood)}>
                  {translateMood(entry.mood)}
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.date), {
                    addSuffix: true,
                    locale: fr
                  })}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {entry.content}
            </p>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {entry.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-auto text-muted-foreground"
              onClick={() => onViewEntry(entry.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir l'entrée
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default JournalEntryList;
