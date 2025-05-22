
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Video, Calendar } from 'lucide-react';

const B2CCoachPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coach émotionnel</h1>
        <p className="text-muted-foreground mt-2">
          Votre coach personnel pour vous aider à gérer vos émotions et améliorer votre bien-être.
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Chat avec coach',
              description: 'Discutez en direct avec votre coach personnel',
              icon: <MessageSquare className="h-6 w-6" />,
              action: 'Commencer une conversation',
              link: '/b2c/coach/chat'
            },
            {
              title: 'Sessions de groupe',
              description: 'Participez à des sessions collectives',
              icon: <Users className="h-6 w-6" />,
              action: 'Voir les sessions',
              link: '/b2c/coach/group'
            },
            {
              title: 'Vidéo consultation',
              description: 'Planifiez une consultation vidéo',
              icon: <Video className="h-6 w-6" />,
              action: 'Planifier',
              link: '/b2c/coach/video'
            },
            {
              title: 'Agenda',
              description: 'Gérez vos rendez-vous',
              icon: <Calendar className="h-6 w-6" />,
              action: 'Voir mon agenda',
              link: '/b2c/coach/calendar'
            }
          ].map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-2 flex flex-row items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {item.icon}
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <Button className="w-full" variant="outline">
                  {item.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-6">Mes programmes recommandés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Gestion du stress',
              duration: '4 semaines',
              progress: 25,
              description: 'Techniques et exercices pour réduire votre niveau de stress quotidien'
            },
            {
              title: 'Amélioration du sommeil',
              duration: '3 semaines',
              progress: 10,
              description: 'Programme personnalisé pour retrouver un sommeil réparateur'
            }
          ].map((program, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Durée: {program.duration}</span>
                  <span>Progression: {program.progress}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mb-4">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${program.progress}%` }} 
                  />
                </div>
                <p className="text-sm mb-4">{program.description}</p>
                <Button className="w-full">Continuer le programme</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default B2CCoachPage;
