import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import { saveJournalEntry } from '@/lib/journalService';

const JournalNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (entryData: any) => {
    setIsSaving(true);
    try {
      const result = await saveJournalEntry(entryData);
      console.log('Journal entry saved:', result);
      navigate('/journal');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Entrée de Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalEntryForm onSubmit={handleSave} isSaving={isSaving} />
          <div className="mt-4">
            <Button variant="ghost" onClick={() => navigate('/journal')}>
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalNewPage;
