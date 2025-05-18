
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Activity, Users, Calendar, BarChart3 } from 'lucide-react';
import { GlobalOverviewTabProps } from '@/types/dashboard';
import OverviewChart from './OverviewChart';
import TeamsSummaryTable from './TeamsSummaryTable';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Bien-être collectif
                </div>
              </CardTitle>
              <Tabs defaultValue="week" className="w-auto">
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="week" className="text-xs">Semaine</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Mois</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs">Année</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <OverviewChart />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teams Summary */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Aperçu des équipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeamsSummaryTable />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Planifications récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Revue bien-être - Marketing</p>
                    <p className="text-sm text-muted-foreground">Planifié pour le 24 mai</p>
                  </div>
                  <Badge variant="outline">À venir</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Session méditation collective</p>
                    <p className="text-sm text-muted-foreground">Planifié pour le 22 mai</p>
                  </div>
                  <Badge variant="outline">À venir</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Atelier gestion du stress</p>
                    <p className="text-sm text-muted-foreground">Terminé le 15 mai</p>
                  </div>
                  <Badge variant="secondary">Terminé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Distribution émotionnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Calme</div>
                  <div className="text-sm">32%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-medium">Heureux</div>
                  <div className="text-sm">28%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '28%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-medium">Focus</div>
                  <div className="text-sm">24%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '24%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-medium">Stressé</div>
                  <div className="text-sm">16%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '16%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalOverviewTab;

// Need to import Badge
import { Badge } from '@/components/ui/badge';
