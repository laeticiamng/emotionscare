
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Optimisation & Analytiques</h1>
          <p className="text-muted-foreground mb-6">
            Analysez les données pour optimiser l'expérience bien-être de votre organisation
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Engagement
                </CardTitle>
                <CardDescription>
                  Mesures d'utilisation et d'engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '67%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sessions hebdomadaires:</span>
                    <span className="font-semibold">67%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '81%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Utilisation des fonctionnalités:</span>
                    <span className="font-semibold">81%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-primary" />
                  Tendances
                </CardTitle>
                <CardDescription>
                  Évolution du bien-être sur la durée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end h-32">
                    <div className="w-1/7 h-[30%] bg-primary/30 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[45%] bg-primary/40 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[40%] bg-primary/50 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[60%] bg-primary/60 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[75%] bg-primary/70 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[65%] bg-primary/80 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[80%] bg-primary/90 rounded-sm mx-0.5"></div>
                    <div className="w-1/7 h-[85%] bg-primary rounded-sm mx-0.5"></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Jan</span>
                    <span>Fév</span>
                    <span>Mar</span>
                    <span>Avr</span>
                    <span>Mai</span>
                    <span>Juin</span>
                    <span>Juil</span>
                    <span>Août</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary" />
                  Répartition
                </CardTitle>
                <CardDescription>
                  Utilisation par département
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="ml-2 min-w-[40px] text-sm">35%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '28%' }}></div>
                    </div>
                    <span className="ml-2 min-w-[40px] text-sm">28%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: '22%' }}></div>
                    </div>
                    <span className="ml-2 min-w-[40px] text-sm">22%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="ml-2 min-w-[40px] text-sm">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Rapport d'optimisation</CardTitle>
              <CardDescription>
                Recommandations pour améliorer le bien-être de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Points forts</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Forte adoption des sessions de méditation (+22% ce mois)</li>
                    <li>Amélioration globale du bien-être dans les départements techniques</li>
                    <li>Utilisation accrue des ressources audio durant les pauses</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Opportunités d'amélioration</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Adoption limitée dans le département marketing (-12%)</li>
                    <li>Faible utilisation des sessions VR malgré leur efficacité prouvée</li>
                    <li>Engagement réduit le vendredi après-midi</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommandations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Organiser un atelier d'introduction pour l'équipe marketing</li>
                    <li>Programmer des sessions VR guidées pour augmenter l'adoption</li>
                    <li>Mettre en place des rappels de bien-être le vendredi après-midi</li>
                    <li>Développer des contenus spécifiques pour les périodes de forte charge</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default OptimizationPage;
