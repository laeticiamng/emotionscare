import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceRecorder } from '@/components/journal/VoiceRecorder';
import { TextEditor } from '@/components/journal/TextEditor';
import { SentimentCard } from '@/components/journal/SentimentCard';
import { SuggestionChip } from '@/components/journal/SuggestionChip';
import { EntriesList } from '@/components/journal/EntriesList';
import { ExportButton } from '@/components/journal/ExportButton';
import { useJournal } from '@/hooks/useJournal';
import { useJournalStore } from '@/store/journal.store';
import { BookOpen, Mic, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function JournalPage() {
  const { entries, loading, submitVoice, submitText } = useJournal();
  const { currentEntry, setCurrentEntry } = useJournalStore();

  const handlePermissionDenied = () => {
    toast.error('Microphone non autorisé. Utilisez l\'onglet Texte.');
    // We could auto-switch to text tab here
  };

  // Clear current entry after some time
  useEffect(() => {
    if (currentEntry) {
      const timer = setTimeout(() => {
        setCurrentEntry(undefined);
      }, 10000); // Clear after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [currentEntry, setCurrentEntry]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Journal
          </h1>
          <p className="text-muted-foreground">
            Déposez vos pensées, recevez des insights
          </p>
        </div>
        
        <ExportButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle entrée</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="voice" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voix
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Texte
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="voice" className="mt-6">
                  <VoiceRecorder
                    maxSec={90}
                    onStop={submitVoice}
                    onPermissionDenied={handlePermissionDenied}
                  />
                </TabsContent>

                <TabsContent value="text" className="mt-6">
                  <TextEditor onSubmit={submitText} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Current Entry Result */}
          {currentEntry && (
            <div className="space-y-4">
              <SentimentCard
                moodBucket={currentEntry.mood_bucket}
                summary={currentEntry.summary}
              />
              
              {currentEntry.suggestion && (
                <SuggestionChip suggestion={currentEntry.suggestion} />
              )}
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vos entrées récentes</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <EntriesList items={entries} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}