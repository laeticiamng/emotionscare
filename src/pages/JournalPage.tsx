
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const JournalPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Journal Personnel</h1>
          </div>
          <p className="text-muted-foreground">
            Exprimez vos pensées et suivez votre évolution émotionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Nouvelle entrée
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comment vous sentez-vous aujourd'hui ?
                </label>
                <Textarea 
                  placeholder="Décrivez votre journée, vos émotions, vos pensées..."
                  rows={6}
                  className="w-full"
                />
              </div>
              <Button className="w-full">Sauvegarder l'entrée</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entrées récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Excellente journée</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Aujourd'hui
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Journée très productive au travail, je me sens satisfait...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
