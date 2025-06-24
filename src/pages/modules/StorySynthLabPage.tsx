
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Wand2, Share } from 'lucide-react';

const StorySynthLabPage: React.FC = () => {
  const [story, setStory] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Story Synth Lab</h1>
          <p className="text-muted-foreground">Transformez vos expériences en récits inspirants</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Votre Histoire
              </CardTitle>
              <CardDescription>Racontez votre expérience émotionnelle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Décrivez une situation récente qui vous a marqué..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="min-h-32"
              />
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Synthétiser l'histoire
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyses Narratives</CardTitle>
              <CardDescription>Insights extraits de vos histoires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ton émotionnel</span>
                  <Badge variant="secondary">Optimiste</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Thème principal</span>
                  <Badge variant="outline">Croissance</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Potentiel inspirant</span>
                  <Badge>Élevé</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Suggestion IA</h4>
                <p className="text-sm text-muted-foreground">
                  Votre récit montre une belle capacité de résilience. 
                  Considérez de le partager pour inspirer d'autres.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StorySynthLabPage;
