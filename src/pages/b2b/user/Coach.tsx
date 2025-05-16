
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import CoachCharacter from '@/components/coach/CoachCharacter';
import { Button } from '@/components/ui/button';
import { MessageSquare, Smile, Brain, Music, Clock, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BUserCoachPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Coach Bien-être Professionnel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <CoachCharacter size="lg" animate={true} />
              <h2 className="text-2xl font-semibold mt-4">Bonjour, comment se passe votre journée de travail ?</h2>
              <p className="text-muted-foreground mt-2">Je suis votre coach bien-être professionnel, là pour vous accompagner dans votre équilibre vie pro/vie perso.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-6">
                <Link to="/b2b/user/coach-chat">
                  <Button variant="default" className="w-full flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Discuter
                  </Button>
                </Link>
                <Link to="/scan">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Smile className="h-5 w-5" />
                    Analyse stress pro
                  </Button>
                </Link>
                <Link to="/b2b/user/wellbeing">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Bilan bien-être
                  </Button>
                </Link>
                <Link to="/b2b/user/workbalance">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Équilibre Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Suggestions professionnelles</h3>
              <ul className="space-y-3">
                <li className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">Pause active de 2 minutes</h4>
                  <p className="text-sm text-muted-foreground">Étirez-vous et prenez l'air</p>
                </li>
                <li className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">Gestion du stress en réunion</h4>
                  <p className="text-sm text-muted-foreground">Techniques pour rester calme</p>
                </li>
                <li className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium">Organisation efficace</h4>
                  <p className="text-sm text-muted-foreground">Priorisez vos tâches importantes</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Analyse confidentielle</h3>
              <div className="space-y-3">
                <p className="text-sm">Votre équilibre travail/vie personnelle semble s'améliorer cette semaine.</p>
                <p className="text-sm">N'oubliez pas de prendre une pause déjeuner complète aujourd'hui.</p>
                <p className="text-sm">Vos pics de stress sont moins fréquents que le mois dernier.</p>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Toutes vos données sont confidentielles et ne sont jamais partagées avec votre employeur.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default B2BUserCoachPage;
