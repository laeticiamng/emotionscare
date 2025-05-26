
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

const B2CJournal: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon Journal Émotionnel</h1>
        <p className="text-muted-foreground">
          Suivez votre parcours émotionnel et vos réflexions personnelles
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Entré du journal</CardTitle>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle entrée
              </Button>
            </div>
            <CardDescription>
              Exprimez vos pensées et émotions du jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune entrée de journal pour le moment</p>
              <p className="text-sm">Commencez par créer votre première entrée</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CJournal;
