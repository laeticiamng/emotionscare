
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import CoachCharacter from '@/components/coach/CoachCharacter';
import CoachPresence from '@/components/coach/CoachPresence';
import { Button } from '@/components/ui/button';
import { MessageSquare, Smile, Brain, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoachPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Coach IA</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <CoachCharacter size="lg" animate={true} />
              <h2 className="text-2xl font-semibold mt-4">Bonjour, comment puis-je vous aider aujourd'hui ?</h2>
              <p className="text-muted-foreground mt-2">Je suis votre coach personnel, là pour vous accompagner dans votre bien-être émotionnel.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-6">
                <Link to="/coach-chat">
                  <Button variant="default" className="w-full flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Discuter
                  </Button>
                </Link>
                <Link to="/scan">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Smile className="h-5 w-5" />
                    Analyser mon humeur
                  </Button>
                </Link>
                <Link to="/journal">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    S'inspirer
                  </Button>
                </Link>
                <Link to="/music">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Musique adaptée
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Suggestions personnalisées</h3>
              <ul className="space-y-3">
                <li className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">Séance de respiration</h4>
                  <p className="text-sm text-muted-foreground">5 minutes pour retrouver votre calme</p>
                </li>
                <li className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">Journal émotionnel</h4>
                  <p className="text-sm text-muted-foreground">Notez vos émotions du jour</p>
                </li>
                <li className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">Pause musicale</h4>
                  <p className="text-sm text-muted-foreground">Écoutez des sons relaxants</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Insights récents</h3>
              <CoachPresence />
              <div className="mt-4 space-y-3">
                <p className="text-sm">Votre niveau de stress semble en baisse cette semaine, continuez vos exercices de respiration.</p>
                <p className="text-sm">Votre humeur fluctue moins qu'avant, signe d'une plus grande stabilité émotionnelle.</p>
                <p className="text-sm">Pensez à prendre un moment pour vous aujourd'hui.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachPage;
