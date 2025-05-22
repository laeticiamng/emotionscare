
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Plus } from 'lucide-react';

const B2CJournalPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journal émotionnel</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle entrée
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Suivez vos émotions au fil du temps et identifiez les tendances dans votre bien-être émotionnel.
      </p>
      
      <div className="grid gap-6">
        {[
          {
            date: '22 mai 2025',
            title: 'Une journée productive',
            mood: 'Motivé',
            excerpt: 'Aujourd\'hui, j\'ai réussi à accomplir la plupart de mes tâches et je me sens vraiment bien.'
          },
          {
            date: '21 mai 2025',
            title: 'Réflexions du soir',
            mood: 'Calme',
            excerpt: 'Une journée tranquille, j\'ai pris le temps de méditer et de réfléchir à mes priorités.'
          },
          {
            date: '20 mai 2025',
            title: 'Défis et opportunités',
            mood: 'Préoccupé',
            excerpt: 'Quelques difficultés aujourd\'hui, mais j\'ai appris des leçons importantes.'
          }
        ].map((entry, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                  <CardTitle>{entry.title}</CardTitle>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {entry.mood}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{entry.excerpt}</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="flex gap-2 items-center">
                  <PenLine className="w-4 h-4" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default B2CJournalPage;
