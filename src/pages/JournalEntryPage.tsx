
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchJournalEntries } from '@/lib/journalService';

interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  title: string;
  mood: string;
  created_at: string;
  ai_feedback?: string;
  text?: string;
  mood_score: number;
}

const JournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEntry = async () => {
      try {
        setLoading(true);
        // Fix the usage to fetch a specific entry from the entries
        const entries = await fetchJournalEntries('user-1');
        const entry = entries.find(e => e.id === id);
        
        if (entry) {
          setJournalEntry(entry);
        } else {
          console.error('Journal entry not found');
        }
      } catch (error) {
        console.error('Error fetching journal entry:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEntry();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Chargement de l'entrée de journal...</p>
      </div>
    );
  }

  if (!journalEntry) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          Retour
        </Button>
        <Card>
          <CardContent className="py-8 text-center">
            <p>Entrée de journal non trouvée</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        Retour
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{journalEntry.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {formatDate(journalEntry.date)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose">
            <p>{journalEntry.content}</p>
          </div>
          
          {journalEntry.mood && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Humeur:</span>
              <span>{journalEntry.mood}</span>
            </div>
          )}
          
          {journalEntry.ai_feedback && (
            <div className="bg-secondary/20 p-4 rounded-md mt-6">
              <h3 className="font-medium mb-2">Analyse IA</h3>
              <p className="text-sm">{journalEntry.ai_feedback}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalEntryPage;
