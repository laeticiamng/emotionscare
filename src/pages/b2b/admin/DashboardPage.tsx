
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Tableau de bord pour les administrateurs RH - À implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
