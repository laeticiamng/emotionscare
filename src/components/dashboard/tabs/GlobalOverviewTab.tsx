
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCcw, CalendarIcon, PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlobalOverviewTabProps {
  className?: string;
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState('week');
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vue globale</h2>
          <p className="text-muted-foreground">
            Aperçu général de votre activité et de votre bien-être
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs
            value={period}
            onValueChange={setPeriod}
            className="hidden md:block"
          >
            <TabsList className="bg-muted/50 border">
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Humeur moyenne</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.5% depuis la semaine dernière</p>
            <div className="flex-1">
              <div className="h-[8px] w-full bg-muted rounded-full mt-3">
                <motion.div 
                  className="h-full bg-green-500 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Sessions complétées</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+4 depuis la période précédente</p>
            <div className="flex-1">
              <div className="flex items-center mt-2">
                <div className="space-y-1 flex-1">
                  {[1, 2, 3].map((day) => (
                    <div key={day} className="flex gap-1">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const opacity = Math.random();
                        return (
                          <div 
                            key={i}
                            className="h-2 flex-1 rounded-sm"
                            style={{ 
                              backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                              opacity: opacity > 0.3 ? 1 : 0.4
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Défis actifs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">1 nouveau défi cette semaine</p>
            <div className="flex mt-2 space-x-2">
              {[75, 45, 20].map((progress, i) => (
                <div key={i} className="flex-1 flex flex-col">
                  <div className="h-16 bg-muted rounded-sm relative overflow-hidden">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-primary"
                      initial={{ height: 0 }}
                      animate={{ height: `${progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + (i * 0.1) }}
                    />
                  </div>
                  <span className="text-xs text-center mt-1">{progress}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Temps de bien-être</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">3h 20m</div>
            <p className="text-xs text-muted-foreground mt-1">+45min depuis la semaine dernière</p>
            <div className="flex-1">
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-1.5" />
                  <span className="text-xs">Méditation</span>
                </div>
                <span className="text-xs font-medium">42%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-1.5" />
                  <span className="text-xs">Musique</span>
                </div>
                <span className="text-xs font-medium">28%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-1.5" />
                  <span className="text-xs">Journal</span>
                </div>
                <span className="text-xs font-medium">30%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-[340px]">
          <CardHeader>
            <CardTitle>Évolution de l'humeur</CardTitle>
            <CardDescription>
              Tendance de votre humeur au fil du temps
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[230px] w-full flex items-end px-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const value = Math.random() * 60 + 20;
                return (
                  <motion.div 
                    key={i}
                    className="flex-1 mx-0.5 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-full bg-primary/80 rounded-t"
                      style={{ height: `${value}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{ delay: 0.2 + (i * 0.05), duration: 0.8 }}
                    />
                    <span className="text-xs mt-2 text-muted-foreground">
                      {new Date(2023, 0, i + 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).slice(0, 5)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-[340px]">
          <CardHeader>
            <CardTitle>Répartition des activités</CardTitle>
            <CardDescription>
              Distribution des différentes activités de bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px] flex items-center justify-center">
              <div className="h-56 w-56 rounded-full border-8 border-primary/10 relative flex items-center justify-center">
                {[
                  { value: 35, color: 'bg-primary', label: 'Méditation' },
                  { value: 25, color: 'bg-blue-400', label: 'Musique' },
                  { value: 15, color: 'bg-yellow-400', label: 'Journal' },
                  { value: 25, color: 'bg-purple-400', label: 'Exercice' }
                ].map((segment, i) => {
                  const offset = i === 0 ? 0 : [0, 1, 2, 3].slice(0, i).reduce((acc, idx) => acc + [35, 25, 15, 25][idx], 0);
                  return (
                    <motion.div 
                      key={i}
                      className={`absolute inset-0 ${segment.color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (i * 0.2) }}
                      style={{
                        clipPath: `conic-gradient(from ${offset * 3.6}deg, currentColor ${segment.value * 3.6}deg, transparent 0)`,
                        color: 'currentColor'
                      }}
                    />
                  );
                })}
                <div className="bg-background h-36 w-36 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-muted-foreground">Activités</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
