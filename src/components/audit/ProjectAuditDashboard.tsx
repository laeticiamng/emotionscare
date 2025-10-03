
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, PlayCircle } from 'lucide-react';

interface AuditItem {
  name: string;
  status: 'implemented' | 'missing' | 'partial' | 'complete';
  priority: 'high' | 'medium' | 'low';
  component?: string;
  endpoint?: string;
}

const ProjectAuditDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const auditItems: AuditItem[] = [
    { name: 'Boss Level Grit', status: 'missing', priority: 'high' },
    { name: 'Mood Mixer', status: 'missing', priority: 'high' },
    { name: 'Ambition Arcade', status: 'missing', priority: 'medium' },
    { name: 'Bounce-Back Battle', status: 'missing', priority: 'medium' },
    { name: 'Story Synth Lab', status: 'missing', priority: 'medium' },
    { name: 'Flash Glow', status: 'partial', priority: 'high', component: 'FlashGlow' },
    { name: 'Filtres Visage AR', status: 'partial', priority: 'high', component: 'FaceFilterAR' },
    { name: 'Bubble-Beat', status: 'missing', priority: 'high' },
    { name: 'Screen-Silk Break', status: 'missing', priority: 'high' },
    { name: 'VR Galactique', status: 'missing', priority: 'medium' },
    { name: 'Instant Glow Widget', status: 'complete', priority: 'high', component: 'InstantGlowWidget' },
    { name: 'Weekly Bars', status: 'implemented', priority: 'medium', component: 'WeeklyBars' },
    { name: 'Scores & Vibes', status: 'partial', priority: 'medium', component: 'DashboardRH' },
    { name: 'Journal Voix/Texte', status: 'implemented', priority: 'high', component: 'JournalPage' },
    { name: 'Musicothérapie', status: 'missing', priority: 'medium' },
    { name: 'Scan Émotionnel', status: 'implemented', priority: 'high', component: 'EmotionSelector' },
    { name: 'Gamification', status: 'partial', priority: 'medium' },
    { name: 'VR Respiration', status: 'missing', priority: 'low' },
    { name: 'Breathwork 4-6-8', status: 'missing', priority: 'high' },
    { name: 'Privacy Toggles', status: 'missing', priority: 'high' },
    { name: 'Export CSV', status: 'missing', priority: 'high' },
    { name: 'Suppression Compte', status: 'missing', priority: 'high' },
    { name: 'Health-check Badge', status: 'missing', priority: 'medium' },
    { name: 'Onboarding Flow', status: 'missing', priority: 'high' },
    { name: 'Notifications & Rappels', status: 'missing', priority: 'medium' },
    { name: 'Centre d\'Aide & FAQ', status: 'missing', priority: 'low' },
    { name: 'Paramètres de Profil', status: 'missing', priority: 'medium' },
    { name: 'Historique d\'Activité', status: 'missing', priority: 'low' },
    { name: 'Feedback in-App', status: 'missing', priority: 'low' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'complete': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <PlayCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented': return <Badge className="bg-green-100 text-green-800">Implémenté</Badge>;
      case 'complete': return <Badge className="bg-emerald-100 text-emerald-800">100% Complété</Badge>;
      case 'partial': return <Badge className="bg-yellow-100 text-yellow-800">Partiel</Badge>;
      case 'missing': return <Badge className="bg-red-100 text-red-800">Manquant</Badge>;
      default: return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Haute</Badge>;
      case 'medium': return <Badge variant="default">Moyenne</Badge>;
      case 'low': return <Badge variant="secondary">Basse</Badge>;
      default: return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? auditItems 
    : auditItems.filter(item => item.status === selectedCategory);

  const stats = {
    implemented: auditItems.filter(item => item.status === 'implemented').length,
    complete: auditItems.filter(item => item.status === 'complete').length,
    partial: auditItems.filter(item => item.status === 'partial').length,
    missing: auditItems.filter(item => item.status === 'missing').length,
    total: auditItems.length
  };

  const progress = ((stats.implemented + stats.complete + stats.partial * 0.5) / stats.total) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Audit du Projet EmotionsCare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.implemented}</div>
              <div className="text-sm text-muted-foreground">Implémentées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.complete}</div>
              <div className="text-sm text-muted-foreground">100% Complètes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
              <div className="text-sm text-muted-foreground">Partielles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
              <div className="text-sm text-muted-foreground">Manquantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression globale</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex gap-2 mb-4">
            <Button 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Tous
            </Button>
            <Button 
              variant={selectedCategory === 'implemented' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('implemented')}
            >
              Implémentées
            </Button>
            <Button 
              variant={selectedCategory === 'partial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('partial')}
            >
              Partielles
            </Button>
            <Button 
              variant={selectedCategory === 'missing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('missing')}
            >
              Manquantes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détail des Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <span className="font-medium">{item.name}</span>
                  {item.component && (
                    <Badge variant="outline" className="text-xs">
                      {item.component}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(item.priority)}
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectAuditDashboard;
