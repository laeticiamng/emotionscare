
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsTabProps {
  className?: string;
  personalOnly?: boolean;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className, personalOnly }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>
            {personalOnly ? 'Mes analyses' : 'Analyses émotionnelles'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vos données d'analyse émotionnelle apparaîtront ici.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
