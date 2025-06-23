
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExportCSVPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Export CSV</h1>
        <Card>
          <CardHeader>
            <CardTitle>Exportation de données</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exportez vos données personnelles au format CSV.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportCSVPage;
