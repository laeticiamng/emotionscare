
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const B2CCoachPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Votre Coach Personnel</h1>
      
      <Tabs defaultValue="coach" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="coach">Coach IA</TabsTrigger>
          <TabsTrigger value="therapist">Psychologue</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coach" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coach Émotionnel IA</CardTitle>
              <CardDescription>
                Discutez avec notre coach IA pour recevoir des conseils personnalisés sur votre bien-être émotionnel
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
                    onClick={() => setActiveConversation('emotional-well-being')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Bien-être émotionnel</h3>
                      <p className="text-sm text-muted-foreground">
                        Discutez de vos émotions et recevez des conseils pour améliorer votre bien-être
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
                      <h3 className="font-medium mb-1">Gestion du stress</h3>
                      <p className="text-sm text-muted-foreground">
                        Apprenez des techniques pour mieux gérer le stress quotidien
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
                    onClick={() => setActiveConversation('sleep-improvement')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Amélioration du sommeil</h3>
                      <p className="text-sm text-muted-foreground">
                        Conseils et routines pour améliorer la qualité de votre sommeil
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
                    onClick={() => setActiveConversation('mindfulness')}
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Pleine conscience</h3>
                      <p className="text-sm text-muted-foreground">
                        Techniques de méditation et exercices de pleine conscience
                      </p>
                    </div>
                  </Button>
                </motion.div>
              </div>
              
              {activeConversation && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {activeConversation === 'emotional-well-being' && "Bien-être émotionnel"}
                      {activeConversation === 'stress-management' && "Gestion du stress"}
                      {activeConversation === 'sleep-improvement' && "Amélioration du sommeil"}
                      {activeConversation === 'mindfulness' && "Pleine conscience"}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveConversation(null)}>
                      Fermer
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="mb-4">Fonctionnalité en cours de développement</p>
                    <Button>Commencer la conversation</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="therapist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation avec un Psychologue</CardTitle>
              <CardDescription>
                Prenez rendez-vous avec un psychologue professionnel pour une consultation personnalisée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((id) => (
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
                        <h3 className="font-medium">Dr. Nom Prénom</h3>
                        <p className="text-sm text-muted-foreground">Psychologue clinicien</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">
                      Spécialisé dans la thérapie cognitive comportementale et la gestion du stress
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
                  <Button onClick={() => setActiveConversation('emotional-well-being')}>
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

export default B2CCoachPage;
