
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JournalTabProps {
  className?: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Mon journal émotionnel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vos entrées de journal apparaîtront ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalTab;
