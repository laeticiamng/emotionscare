
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, Download, BarChart2, Clock, LineChart, Users, HelpCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const OptimizationPage: React.FC = () => {
  return (
    <UnifiedLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Optimisation
            </h1>
            <p className="text-muted-foreground mt-1">
              Outils d'analyse et d'optimisation du bien-être
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Exporter
            </Button>
            <Button className="flex items-center gap-2">
              <LineChart size={16} />
              Nouveau rapport
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="individual">Individuel</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Score global
                    </CardTitle>
                    <CardDescription>Moyenne de toutes les équipes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">74</span>
                      <span className="text-sm text-green-500 flex items-center">
                        +3 <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0">Voir détails</Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Participation
                    </CardTitle>
                    <CardDescription>Taux d'engagement des utilisateurs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">86%</span>
                      <span className="text-sm text-green-500 flex items-center">
                        +5% <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '86%' }}></div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0">Voir détails</Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Temps par session
                    </CardTitle>
                    <CardDescription>Durée moyenne d'engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">12m</span>
                      <span className="text-sm text-red-500 flex items-center">
                        -2m <ArrowUpRight className="h-3 w-3 rotate-90" />
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {[30, 45, 60, 80, 65, 50, 70].map((value, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="h-20 w-full flex items-end">
                            <div 
                              className="w-full bg-primary rounded-sm" 
                              style={{ height: `${value}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0">Voir détails</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tendances et analyses</CardTitle>
                  <CardDescription>
                    Évolution des indicateurs clés au cours du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-muted/50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground flex flex-col items-center gap-2">
                      <LineChart className="h-8 w-8 opacity-50" />
                      <span>Graphique d'évolution des indicateurs</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="teams">
            <div className="grid gap-6">
              {['Marketing', 'Développement', 'Finance', 'Support client'].map((team, index) => (
                <motion.div
                  key={team}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{`Équipe ${team}`}</CardTitle>
                      <CardDescription>Analyse des performances et du bien-être</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-8">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Score de bien-être</h3>
                          <div className="relative flex items-center justify-center">
                            <div className="text-3xl font-bold">{70 + index * 5}</div>
                            <svg className="absolute -z-10" width="120" height="120" viewBox="0 0 120 120">
                              <circle 
                                cx="60" cy="60" r="54" fill="none" 
                                stroke="currentColor" 
                                strokeWidth="12"
                                strokeOpacity="0.1"
                              />
                              <circle 
                                cx="60" cy="60" r="54" fill="none" 
                                stroke="currentColor" 
                                strokeWidth="12"
                                strokeDasharray={`${(70 + index * 5) * 3.39} 339`}
                                strokeLinecap="round"
                                transform="rotate(-90 60 60)"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Membres actifs</h3>
                          <p className="text-3xl font-bold">{5 + index}</p>
                          <p className="text-sm text-muted-foreground">{`sur ${8 + index} membres`}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Sessions hebdomadaires</h3>
                          <p className="text-3xl font-bold">{12 + index * 2}</p>
                          <div className="flex items-center gap-1 text-sm">
                            <span className={index % 2 === 0 ? "text-green-500" : "text-red-500"}>
                              {index % 2 === 0 ? "+" : "-"}{index + 1}
                            </span>
                            <span className="text-muted-foreground">vs semaine précédente</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="flex items-center gap-2 mr-2">
                        <Users size={16} />
                        Voir membres
                      </Button>
                      <Button>Rapport détaillé</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual">
            <Card>
              <CardHeader>
                <CardTitle>Performances individuelles</CardTitle>
                <CardDescription>
                  Analysez les indicateurs personnels de bien-être
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
                  <HelpCircle className="h-10 w-10 opacity-50" />
                  <span>Sélectionnez un utilisateur pour voir ses analyses détaillées</span>
                  <Button className="mt-4">Choisir un utilisateur</Button>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations d'optimisation</CardTitle>
                  <CardDescription>
                    Suggestions basées sur les données recueillies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Augmenter les sessions de méditation guidée pour l'équipe Marketing",
                      "Proposer des pauses actives pour l'équipe Développement",
                      "Mettre en place des ateliers de gestion du stress pour tous les collaborateurs",
                      "Optimiser les horaires des sessions collectives pour augmenter la participation"
                    ].map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                      >
                        <div className="bg-primary/10 rounded-full p-2 text-primary">
                          <LineChart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{suggestion}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Impact potentiel: {['Élevé', 'Moyen', 'Élevé', 'Moyen'][index]}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertes et points d'attention</CardTitle>
                  <CardDescription>
                    Éléments nécessitant une action rapide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 rounded-md">
                      <h3 className="font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Baisse de participation dans l'équipe Support
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                        Baisse de 15% des sessions de bien-être au cours des deux dernières semaines.
                      </p>
                      <Button size="sm" variant="outline" className="mt-3">
                        Analyser
                      </Button>
                    </div>

                    <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900/50 rounded-md">
                      <h3 className="font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Durée des sessions en diminution
                      </h3>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-2">
                        La durée moyenne des sessions a diminué de 3 minutes cette semaine.
                      </p>
                      <Button size="sm" variant="outline" className="mt-3">
                        Analyser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default OptimizationPage;
