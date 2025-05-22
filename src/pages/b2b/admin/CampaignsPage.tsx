
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data for campaigns
  const campaigns = {
    active: [
      {
        id: 1,
        name: 'Semaine du bien-être mental',
        status: 'active',
        participants: 48,
        progress: 65,
        startDate: '15/05/2025',
        endDate: '22/05/2025'
      },
      {
        id: 2,
        name: 'Challenge méditation quotidienne',
        status: 'active',
        participants: 32,
        progress: 40,
        startDate: '01/05/2025',
        endDate: '31/05/2025'
      }
    ],
    upcoming: [
      {
        id: 3,
        name: 'Gestion du stress - Été 2025',
        status: 'upcoming',
        participants: 0,
        progress: 0,
        startDate: '01/06/2025',
        endDate: '30/06/2025'
      }
    ],
    completed: [
      {
        id: 4,
        name: 'Musicothérapie en équipe',
        status: 'completed',
        participants: 56,
        progress: 100,
        startDate: '01/04/2025',
        endDate: '30/04/2025'
      },
      {
        id: 5,
        name: 'Défis bien-être - Printemps 2025',
        status: 'completed',
        participants: 42,
        progress: 100,
        startDate: '01/03/2025',
        endDate: '31/03/2025'
      }
    ]
  };

  return (
    <Shell>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Campagnes de bien-être</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>Nouvelle campagne</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Créer une campagne</DialogTitle>
                <DialogDescription>
                  Définissez les détails de votre nouvelle campagne de bien-être
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la campagne</Label>
                  <Input id="name" placeholder="Ex: Semaine du bien-être mental" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type de campagne</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="challenge">Challenge</SelectItem>
                      <SelectItem value="awareness">Sensibilisation</SelectItem>
                      <SelectItem value="training">Formation</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Décrivez l'objectif et le contenu de la campagne..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer la campagne</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active">Actives</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
          </TabsList>
          
          {Object.keys(campaigns).map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {campaigns[status].length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune campagne {status === 'active' ? 'active' : status === 'upcoming' ? 'à venir' : 'terminée'}</h3>
                  <p className="text-muted-foreground">Les campagnes que vous créerez apparaîtront ici</p>
                  <Button className="mt-4">Créer une campagne</Button>
                </div>
              ) : (
                campaigns[status].map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{campaign.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {campaign.startDate} - {campaign.endDate}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            status === 'active' ? 'default' : 
                            status === 'upcoming' ? 'outline' : 
                            'secondary'
                          }
                        >
                          {status === 'active' ? 'En cours' : 
                           status === 'upcoming' ? 'À venir' : 
                           'Terminée'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Progression</span>
                            <span>{campaign.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Participants</span>
                            <p className="font-medium">{campaign.participants}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Défis complétés</span>
                            <p className="font-medium">{status === 'upcoming' ? 'N/A' : `${Math.round(campaign.participants * campaign.progress / 100)}`}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Taux d'engagement</span>
                            <p className="font-medium">{status === 'upcoming' ? 'N/A' : `${Math.round(campaign.progress * 0.8)}%`}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant={status === 'completed' ? 'outline' : 'default'} className="w-full">
                        {status === 'active' ? 'Gérer' : 
                         status === 'upcoming' ? 'Modifier' : 
                         'Voir le rapport'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Shell>
  );
};

export default CampaignsPage;
