
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, LineChart, Clock, Award } from 'lucide-react';

const UnifiedEmotionCheckin: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle>Scanner émotionnel</CardTitle>
          <CardDescription className="text-primary-foreground/90">
            Comment vous sentez-vous aujourd'hui?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p>
              Suivez quotidiennement vos émotions pour mieux comprendre vos tendances et améliorer votre bien-être. 
              Plus vous réalisez de scans, plus votre profil émotionnel devient précis.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Smile className="h-6 w-6 mb-1 text-primary" />
                <span className="text-sm font-medium">Identifier vos émotions</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <LineChart className="h-6 w-6 mb-1 text-primary" />
                <span className="text-sm font-medium">Analyser vos tendances</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Clock className="h-6 w-6 mb-1 text-primary" />
                <span className="text-sm font-medium">Suivi dans le temps</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Award className="h-6 w-6 mb-1 text-primary" />
                <span className="text-sm font-medium">Gagnez des badges</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Commencer un scan</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
