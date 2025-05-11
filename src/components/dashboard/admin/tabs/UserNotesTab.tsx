
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserNotesTabProps {
  userId: string;
}

const UserNotesTab: React.FC<UserNotesTabProps> = ({ userId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Aucune note disponible pour cet utilisateur
        </p>
      </CardContent>
    </Card>
  );
};

export default UserNotesTab;
