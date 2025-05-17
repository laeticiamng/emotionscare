
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TeamTabProps {
  className?: string;
}

const TeamTab: React.FC<TeamTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenu de l'équipe à venir.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTab;
