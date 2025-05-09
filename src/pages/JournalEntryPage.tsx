import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchJournalEntries } from '@/lib/journalService'; // Changed from fetchJournalEntry
import JournalEntryForm from '@/components/journal/JournalEntryForm';

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

  useEffect(() => {
    const getEntry = async () => {
      try {
        // Fix the usage to fetch a specific entry from the entries
        const entries = await fetchJournalEntries();
        const entry = entries.find(e => e.id === id);
        if (entry) {
          setJournalEntry(entry);
        }
      } catch (error) {
        console.error('Error fetching journal entry:', error);
      }
    };

    if (id) {
      getEntry();
    }
  }, [id]);

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        Retour
      </Button>
      {journalEntry ? (
        <Card>
          <CardHeader>
            <CardTitle>{journalEntry.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{journalEntry.content}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Date: {new Date(journalEntry.date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ) : (
        <p>Chargement de l'entrée de journal...</p>
      )}
    </div>
  );
};

export default JournalEntryPage;
