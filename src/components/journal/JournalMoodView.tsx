
import React from 'react';
import { JournalEntry } from '@/types/journal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import JournalMoodChart from './JournalMoodChart';

interface JournalMoodViewProps {
  entries: JournalEntry[];
}

const JournalMoodView: React.FC<JournalMoodViewProps> = ({ entries }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de vos émotions</CardTitle>
      </CardHeader>
      <CardContent>
        <JournalMoodChart entries={entries} />
      </CardContent>
    </Card>
  );
};

export default JournalMoodView;
