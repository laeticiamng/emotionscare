
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface JournalTabProps {
  className?: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenu du journal à venir.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalTab;
