
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const B2BUserCoachPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Votre Coach d'Entreprise</h1>
        <Badge variant="outline" className="mt-2 md:mt-0">Version Entreprise</Badge>
      </div>
      
      <Tabs defaultValue="coach" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="coach">Coach IA</TabsTrigger>
          <TabsTrigger value="specialist">Spécialistes</TabsTrigger>
          <TabsTrigger value="workshops">Ateliers</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coach" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coach Professionnel IA</CardTitle>
              <CardDescription>
                Discutez avec notre coach IA spécialisé dans l'environnement professionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left flex items-start w-full"
                    onClick={() => setActiveConversation('workplace-wellness')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Bien-être au travail</h3>
                      <p className="text-sm text-muted-foreground">
                        Discutez de votre équilibre et bien-être dans l'environnement professionnel
                      </p>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left flex items-start w-full"
                    onClick={() => setActiveConversation('stress-management')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Gestion du stress professionnel</h3>
                      <p className="text-sm text-muted-foreground">
                        Techniques spécifiques pour gérer le stress au travail
                      </p>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left flex items-start w-full"
                    onClick={() => setActiveConversation('communication-skills')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Compétences en communication</h3>
                      <p className="text-sm text-muted-foreground">
                        Améliorer votre communication avec vos collègues et managers
                      </p>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left flex items-start w-full"
                    onClick={() => setActiveConversation('work-life-balance')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Équilibre vie pro/perso</h3>
                      <p className="text-sm text-muted-foreground">
                        Conseils pour maintenir un équilibre sain entre travail et vie personnelle
                      </p>
                    </div>
                  </Button>
                </motion.div>
              </div>
              
              {activeConversation && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {activeConversation === 'workplace-wellness' && "Bien-être au travail"}
                      {activeConversation === 'stress-management' && "Gestion du stress professionnel"}
                      {activeConversation === 'communication-skills' && "Compétences en communication"}
                      {activeConversation === 'work-life-balance' && "Équilibre vie pro/perso"}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveConversation(null)}>
                      Fermer
                    </Button>
                  </div>
                  
                  <div className="h-96 bg-background rounded-lg border p-4">
                    <div className="h-full overflow-y-auto space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          IA
                        </div>
                        <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            {activeConversation === 'workplace-wellness' && 
                              "Bonjour ! Comment se passe votre journée de travail ? Y a-t-il des aspects de votre environnement professionnel qui vous préoccupent ?"
                            }
                            {activeConversation === 'stress-management' && 
                              "Je comprends que le stress professionnel peut être difficile à gérer. Pouvez-vous me parler des situations qui vous stressent le plus au travail ?"
                            }
                            {activeConversation === 'communication-skills' && 
                              "La communication est essentielle au travail. Quels défis rencontrez-vous dans vos interactions avec vos collègues ou votre hiérarchie ?"
                            }
                            {activeConversation === 'work-life-balance' && 
                              "L'équilibre entre vie professionnelle et personnelle est crucial. Comment gérez-vous actuellement cette transition entre travail et vie privée ?"
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button>Envoyer</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specialist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation avec des Spécialistes</CardTitle>
              <CardDescription>
                Votre entreprise vous offre l'accès à des spécialistes du bien-être au travail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Dr. Martine Dupont",
                    title: "Psychologue du travail",
                    description: "Spécialisée dans la prévention du burn-out et le stress professionnel"
                  },
                  {
                    name: "Marc Leblanc",
                    title: "Coach en leadership",
                    description: "Expert en développement des compétences managériales et leadership bienveillant"
                  },
                  {
                    name: "Sophie Moreau",
                    title: "Conseillère en équilibre de vie",
                    description: "Aide à trouver un équilibre sain entre vie professionnelle et personnelle"
                  },
                  {
                    name: "Thomas Bernard",
                    title: "Médiateur professionnel",
                    description: "Spécialisé dans la résolution de conflits et l'amélioration de la communication"
                  }
                ].map((specialist, id) => (
                  <motion.div 
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="border rounded-lg p-4 flex flex-col"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{specialist.name}</h3>
                        <p className="text-sm text-muted-foreground">{specialist.title}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">
                      {specialist.description}
                    </p>
                    <div className="mt-auto">
                      <Button className="w-full">
                        Prendre rendez-vous <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workshops" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ateliers et Formations</CardTitle>
              <CardDescription>
                Participez à des ateliers collectifs organisés par votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Gestion du stress en période de haute activité",
                    date: "15 juin 2023",
                    time: "14h00 - 16h00",
                    location: "Salle de conférence A",
                    participants: 12,
                    maxParticipants: 20
                  },
                  {
                    title: "Communication non violente au travail",
                    date: "22 juin 2023",
                    time: "10h00 - 12h00",
                    location: "Salle de réunion B",
                    participants: 8,
                    maxParticipants: 15
                  },
                  {
                    title: "Méditation et pleine conscience pour professionnels",
                    date: "29 juin 2023",
                    time: "12h30 - 13h30",
                    location: "Espace détente",
                    participants: 15,
                    maxParticipants: 15,
                    full: true
                  }
                ].map((workshop, id) => (
                  <motion.div 
                    key={id}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="font-medium">{workshop.title}</h3>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>{workshop.date} • {workshop.time}</p>
                          <p>{workshop.location}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center">
                        <div className="mr-4 text-sm">
                          <span className="font-medium">{workshop.participants}</span>/{workshop.maxParticipants} participants
                        </div>
                        <Button variant={workshop.full ? "secondary" : "default"} disabled={workshop.full}>
                          {workshop.full ? "Complet" : "S'inscrire"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Consultations</CardTitle>
              <CardDescription>
                Consultez l'historique de vos conversations avec votre coach IA et vos rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground py-8">
                  Vous n'avez pas encore d'historique de consultation
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => setActiveConversation('workplace-wellness')}>
                    Commencer une conversation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserCoachPage;
