
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AnalyticsTabProps {
  className?: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Analytiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenu des analytiques à venir.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
