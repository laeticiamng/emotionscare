
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

/**
 * Page du journal personnel
 */
const JournalPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-amber-600" />
          Journal Personnel
        </h1>
        <p className="text-gray-600">
          Exprimez vos pensées et suivez votre évolution émotionnelle
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Espace Journal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de journal personnel en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalPage;
