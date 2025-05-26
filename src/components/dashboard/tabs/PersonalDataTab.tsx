
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PersonalDataTabProps {
  className?: string;
}

const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Données personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDataTab;
