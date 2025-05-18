import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SanctuaryPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Card className="bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle>Sanctuaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Un espace calme pour vous recentrer. Des fonctionnalités avancées seront ajoutées ultérieurement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SanctuaryPage;
