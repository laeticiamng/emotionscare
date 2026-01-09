/**
 * TimeCraftPage - Module de design du temps personnel (B2C)
 * Visualisation du temps comme architecture, pas comme to-do list
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  Palette,
  Layers,
  GitCompare,
  Sparkles,
  Plus,
  Calendar,
  BarChart3,
  Zap,
  Moon,
  AlertTriangle,
  Heart,
  Target,
  Brain,
  ArrowRight,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

// Types de blocs temporels avec couleurs
const blockTypes = [
  { id: 'creation', label: 'Création', icon: Sparkles, color: 'bg-purple-500', description: 'Temps de flow, création' },
  { id: 'recovery', label: 'Récupération', icon: Moon, color: 'bg-blue-500', description: 'Repos, détente' },
  { id: 'constraint', label: 'Contrainte', icon: AlertTriangle, color: 'bg-orange-500', description: 'Obligations, devoirs' },
  { id: 'emotional', label: 'Charge émotionnelle', icon: Heart, color: 'bg-red-500', description: 'Moments intenses' },
  { id: 'chosen', label: 'Temps choisi', icon: Target, color: 'bg-green-500', description: 'Décisions personnelles' },
  { id: 'imposed', label: 'Temps subi', icon: Clock, color: 'bg-gray-500', description: 'Imposé par contexte' },
];

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function TimeCraftPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVersion, setSelectedVersion] = useState<'current' | 'ideal' | 'compare'>('current');

  usePageSEO({
    title: 'TimeCraft - Design du temps personnel | EmotionsCare',
    description: 'Visualisez et architecturez votre temps. Comprenez vos rythmes émotionnels et énergétiques.',
  });

  return (
    <main className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">TimeCraft</h1>
                <Badge variant="secondary">Beta</Badge>
              </div>
              <p className="text-muted-foreground">
                Architecturez votre temps. Comprenez vos rythmes.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <GitCompare className="h-4 w-4 mr-2" />
                Comparer
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau bloc
              </Button>
            </div>
          </div>

          {/* Disclaimer non-médical */}
          <Alert className="border-muted bg-muted/30">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              TimeCraft est un outil de <strong>lucidité personnelle</strong>, pas un diagnostic. 
              Il montre, il ne juge pas. Aucune injonction à la performance.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Version selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2"
        >
          <Button 
            variant={selectedVersion === 'current' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedVersion('current')}
          >
            Temps actuel
          </Button>
          <Button 
            variant={selectedVersion === 'ideal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedVersion('ideal')}
          >
            Temps souhaité
          </Button>
          <Button 
            variant={selectedVersion === 'compare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedVersion('compare')}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Comparer
          </Button>
        </motion.div>

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="map">
              <Palette className="h-4 w-4 mr-2" />
              Cartographie
            </TabsTrigger>
            <TabsTrigger value="blocks">
              <Layers className="h-4 w-4 mr-2" />
              Blocs
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="versions">
              <GitCompare className="h-4 w-4 mr-2" />
              Versions
            </TabsTrigger>
          </TabsList>

          {/* Cartographie temporelle */}
          <TabsContent value="map" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Légende des types */}
              <div className="flex flex-wrap gap-2 mb-6">
                {blockTypes.map((type) => (
                  <Badge 
                    key={type.id} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className={cn('w-3 h-3 rounded-full mr-2', type.color)} />
                    {type.label}
                  </Badge>
                ))}
              </div>

              {/* Grille semaine */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Vue semaine
                  </CardTitle>
                  <CardDescription>
                    Cliquez pour ajouter ou modifier des blocs temporels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">
                          {day}
                        </div>
                        <div className="space-y-1 min-h-[200px] bg-muted/30 rounded-lg p-2">
                          {/* Placeholder pour les blocs */}
                          <div className="text-xs text-muted-foreground text-center py-8">
                            Cliquez pour ajouter
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Résumé rapide */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-purple-500/10 border-purple-500/20">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">0h</div>
                    <div className="text-sm text-muted-foreground">Création</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <Moon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">0h</div>
                    <div className="text-sm text-muted-foreground">Récupération</div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">0h</div>
                    <div className="text-sm text-muted-foreground">Contrainte</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">0h</div>
                    <div className="text-sm text-muted-foreground">Temps choisi</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Liste des blocs */}
          <TabsContent value="blocks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes blocs temporels</CardTitle>
                <CardDescription>
                  Gérez vos différents types de temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun bloc créé pour le moment</p>
                  <Button className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer mon premier bloc
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Insights temporels
                </CardTitle>
                <CardDescription>
                  Observations non-prescriptives sur votre structure temporelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Les insights apparaîtront une fois vos blocs créés</p>
                  <p className="text-sm mt-2">
                    Nous observons, nous ne jugeons pas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Versions */}
          <TabsContent value="versions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" />
                  Versions de trajectoires
                </CardTitle>
                <CardDescription>
                  Comparez différentes architectures temporelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Temps actuel</div>
                        <div className="text-sm text-muted-foreground">Version principale</div>
                      </div>
                      <Badge>Active</Badge>
                    </CardContent>
                  </Card>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une nouvelle version
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Lien vers données émotionnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Corrélation émotions ↔ temps</h3>
                  <p className="text-sm text-muted-foreground">
                    Reliez vos données émotionnelles à votre structure temporelle
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Connecter mes données
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
