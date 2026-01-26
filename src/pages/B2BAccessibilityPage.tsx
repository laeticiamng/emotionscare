import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Ear, 
  MousePointer,
  Heart,
  CheckCircle,
  Users,
  Building,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const B2BAccessibilityPage: React.FC = () => {
  // Enterprise accessibility settings
  const [enterpriseHighContrast, setEnterpriseHighContrast] = useState(false);
  const [enterpriseLargeText, setEnterpriseLargeText] = useState(false);
  const [enterpriseReducedMotion, setEnterpriseReducedMotion] = useState(false);
  const [enterpriseScreenReader, setEnterpriseScreenReader] = useState(true);
  const [enterpriseVoiceControl, setEnterpriseVoiceControl] = useState(false);
  const [enterpriseTextSize, setEnterpriseTextSize] = useState([16]);
  const [enterpriseSoundVolume, setEnterpriseSoundVolume] = useState([80]);

  // Company-wide accessibility analytics
  const accessibilityMetrics = {
    wcagCompliance: 96,
    userAdoption: 23,
    supportTickets: 12,
    employeeSatisfaction: 89,
    totalEmployees: 847,
    accessibilityUsers: 195
  };

  const enterpriseAccessibilityFeatures = [
    {
      category: 'Vision Professionnelle',
      icon: <Eye className="h-6 w-6" />,
      description: 'Outils d\'accessibilité visuelle pour environnements de travail',
      features: [
        {
          id: 'enterprise-high-contrast',
          title: 'Mode Contraste Élevé Enterprise',
          description: 'Interface optimisée pour environnements corporate avec éclairage variable',
          enabled: enterpriseHighContrast,
          onToggle: setEnterpriseHighContrast,
          type: 'toggle',
          adoption: 34
        },
        {
          id: 'enterprise-large-text',
          title: 'Texte Agrandi Business',
          description: 'Taille de police adaptée aux longues sessions de travail',
          enabled: enterpriseLargeText,
          onToggle: setEnterpriseLargeText,
          type: 'toggle',
          adoption: 18
        },
        {
          id: 'enterprise-text-size',
          title: 'Taille Police Personnalisée',
          description: 'Contrôle granulaire de la typographie pour le confort visuel',
          value: enterpriseTextSize,
          onValueChange: setEnterpriseTextSize,
          type: 'slider',
          min: 12,
          max: 28,
          unit: 'px',
          adoption: 45
        }
      ]
    },
    {
      category: 'Audio Professionnel',
      icon: <Ear className="h-6 w-6" />,
      description: 'Solutions audio pour espaces de travail inclusifs',
      features: [
        {
          id: 'enterprise-screen-reader',
          title: 'Lecteur d\'Écran Enterprise',
          description: 'Compatible JAWS, NVDA, VoiceOver avec profils métiers',
          enabled: enterpriseScreenReader,
          onToggle: setEnterpriseScreenReader,
          type: 'toggle',
          adoption: 12
        },
        {
          id: 'enterprise-sound-volume',
          title: 'Contrôle Audio Centralisé',
          description: 'Gestion des niveaux sonores pour open-space et bureaux',
          value: enterpriseSoundVolume,
          onValueChange: setEnterpriseSoundVolume,
          type: 'slider',
          min: 0,
          max: 100,
          unit: '%',
          adoption: 67
        }
      ]
    },
    {
      category: 'Interaction Workplace',
      icon: <MousePointer className="h-6 w-6" />,
      description: 'Adaptations pour environnements de travail ergonomiques',
      features: [
        {
          id: 'enterprise-reduced-motion',
          title: 'Réduction Animations Workplace',
          description: 'Minimise la fatigue visuelle lors de sessions prolongées',
          enabled: enterpriseReducedMotion,
          onToggle: setEnterpriseReducedMotion,
          type: 'toggle',
          adoption: 28
        },
        {
          id: 'enterprise-voice-control',
          title: 'Commande Vocale Business',
          description: 'Navigation mains-libres pour les postes de travail',
          enabled: enterpriseVoiceControl,
          onToggle: setEnterpriseVoiceControl,
          type: 'toggle',
          adoption: 8
        }
      ]
    }
  ];

  const enterpriseKeyboardShortcuts = [
    { keys: 'Ctrl + Alt + H', action: 'Basculer mode haut contraste enterprise' },
    { keys: 'Ctrl + Alt + T', action: 'Ajuster taille texte rapidement' },
    { keys: 'Ctrl + Alt + M', action: 'Réduire/Activer animations' },
    { keys: 'Ctrl + Alt + V', action: 'Activer contrôle vocal' },
    { keys: 'Ctrl + Alt + S', action: 'Lecteur d\'écran on/off' },
    { keys: 'Ctrl + Alt + D', action: 'Dashboard accessibilité' },
    { keys: 'F1', action: 'Aide accessibilité contextuelle' },
    { keys: 'Alt + Shift + A', action: 'Menu accessibilité rapide' }
  ];

  const wcagEnterpriseCompliance = [
    { 
      level: 'A', 
      description: 'Conformité de base', 
      status: 'complete',
      details: 'Toutes les exigences de niveau A respectées pour l\'enterprise'
    },
    { 
      level: 'AA', 
      description: 'Standard international', 
      status: 'complete',
      details: 'Conformité AA complète - Standard requis pour entreprises'
    },
    { 
      level: 'AAA', 
      description: 'Excellence accessibility', 
      status: 'partial',
      details: 'En cours d\'implémentation pour leadership accessibility'
    }
  ];

  const departmentUsage = [
    { department: 'RH', users: 34, total: 45, percentage: 76 },
    { department: 'IT', users: 28, total: 67, percentage: 42 },
    { department: 'Finance', users: 23, total: 89, percentage: 26 },
    { department: 'Marketing', users: 45, total: 123, percentage: 37 },
    { department: 'Ventes', users: 32, total: 156, percentage: 21 },
    { department: 'Support', users: 33, total: 67, percentage: 49 }
  ];

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    toast.success(`${enabled ? 'Activé' : 'Désactivé'} pour l'entreprise: ${featureId}`);
  };

  const exportAccessibilityReport = () => {
    toast.success('Rapport d\'accessibilité enterprise généré');
  };

  const deployToAllUsers = () => {
    toast.success('Configuration déployée à tous les utilisateurs de l\'entreprise');
  };

  return (
    <div data-testid="page-root" className={`min-h-screen transition-colors duration-300 ${
      enterpriseHighContrast 
        ? 'bg-background text-foreground' 
        : 'bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${
              enterpriseHighContrast ? 'bg-card text-card-foreground border-2 border-border' : 'bg-info/10'
            }`}>
              <Building className={`h-8 w-8 ${enterpriseHighContrast ? 'text-foreground' : 'text-info'}`} />
            </div>
            <h1 className={`text-4xl font-bold ${
              enterpriseHighContrast 
                ? 'text-foreground' 
                : 'bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'
            } ${enterpriseLargeText ? 'text-5xl' : ''}`}
            style={{ fontSize: enterpriseLargeText ? '3rem' : undefined }}
            >
              Accessibilité Enterprise
            </h1>
          </div>
          <p className={`text-lg max-w-3xl mx-auto ${
            enterpriseHighContrast ? 'text-muted-foreground' : 'text-muted-foreground'
          } ${enterpriseLargeText ? 'text-xl' : ''}`}
          style={{ fontSize: enterpriseLargeText ? `${enterpriseTextSize[0] + 4}px` : `${enterpriseTextSize[0]}px` }}
          >
            Plateforme d'accessibilité avancée pour environnements professionnels. 
            Conformité WCAG AA/AAA et déploiement à l'échelle enterprise.
          </p>
        </motion.div>

        {/* Enterprise Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card className={`shadow-lg border-0 ${
            enterpriseHighContrast ? 'bg-card border-border border-2' : 'bg-card/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-success mx-auto mb-1" />
              <div className={`text-xl font-bold ${enterpriseHighContrast ? 'text-foreground' : 'text-success'}`}>
                {accessibilityMetrics.wcagCompliance}%
              </div>
              <p className={`text-xs ${enterpriseHighContrast ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                WCAG AA
              </p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg border-0 ${
            enterpriseHighContrast ? 'bg-card border-border border-2' : 'bg-card/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-info mx-auto mb-1" />
              <div className={`text-xl font-bold ${enterpriseHighContrast ? 'text-foreground' : 'text-info'}`}>
                {accessibilityMetrics.accessibilityUsers}
              </div>
              <p className={`text-xs ${enterpriseHighContrast ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                Utilisateurs actifs
              </p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg border-0 ${
            enterpriseHighContrast ? 'bg-card border-border border-2' : 'bg-card/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 text-accent mx-auto mb-1" />
              <div className={`text-xl font-bold ${enterpriseHighContrast ? 'text-foreground' : 'text-accent'}`}>
                {accessibilityMetrics.userAdoption}%
              </div>
              <p className={`text-xs ${enterpriseHighContrast ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                Adoption
              </p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg border-0 ${
            enterpriseHighContrast ? 'bg-gray-900 border-white border-2' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-destructive mx-auto mb-1" />
              <div className={`text-xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-destructive'}`}>
                {accessibilityMetrics.employeeSatisfaction}%
              </div>
              <p className={`text-xs ${enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Satisfaction
              </p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg border-0 ${
            enterpriseHighContrast ? 'bg-gray-900 border-white border-2' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 text-warning mx-auto mb-1" />
              <div className={`text-xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-warning'}`}>
                {accessibilityMetrics.supportTickets}
              </div>
              <p className={`text-xs ${enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Tickets support
              </p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg border-0 ${
            enterpriseHighContrast ? 'bg-gray-900 border-white border-2' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4 text-center">
              <Building className="h-6 w-6 text-primary mx-auto mb-1" />
              <div className={`text-xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-primary'}`}>
                {accessibilityMetrics.totalEmployees}
              </div>
              <p className={`text-xs ${enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Employés total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="features" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="compliance">Conformité</TabsTrigger>
              <TabsTrigger value="deployment">Déploiement</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                  Fonctionnalités Accessibilité Enterprise
                </h2>
                <Button 
                  onClick={deployToAllUsers}
                  className="bg-info hover:bg-info/90"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Déployer à Tous
                </Button>
              </div>

              {enterpriseAccessibilityFeatures.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card className={`shadow-lg border-0 ${
                    enterpriseHighContrast 
                      ? 'bg-gray-900 border-white border-2' 
                      : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <CardHeader className={enterpriseHighContrast ? 'border-b border-white' : ''}>
                      <CardTitle className={`flex items-center gap-3 ${
                        enterpriseHighContrast ? 'text-white' : 'text-gray-800'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          enterpriseHighContrast ? 'bg-white text-black' : 'bg-info/10 text-info'
                        }`}>
                          {category.icon}
                        </div>
                        <div>
                          <span style={{ fontSize: enterpriseLargeText ? `${enterpriseTextSize[0] + 4}px` : `${enterpriseTextSize[0] + 2}px` }}>
                            {category.category}
                          </span>
                          <p className={`text-sm font-normal ${
                            enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {category.description}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {category.features.map((feature) => (
                        <div key={feature.id} className={`p-4 rounded-lg border ${
                          enterpriseHighContrast ? 'border-white bg-gray-800' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${
                              enterpriseHighContrast ? 'text-white' : 'text-gray-800'
                            }`}
                            style={{ fontSize: enterpriseLargeText ? `${enterpriseTextSize[0] + 2}px` : `${enterpriseTextSize[0]}px` }}
                            >
                              {feature.title}
                            </h3>
                            {feature.type === 'toggle' && (
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">
                                  {feature.adoption}% adoption
                                </Badge>
                                <Switch
                                  checked={feature.enabled}
                                  onCheckedChange={(checked) => {
                                    feature.onToggle?.(checked);
                                    handleFeatureToggle(feature.title, checked);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <p className={`text-sm mb-4 ${
                            enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                          }`}
                          style={{ fontSize: enterpriseLargeText ? `${enterpriseTextSize[0]}px` : `${enterpriseTextSize[0] - 2}px` }}
                          >
                            {feature.description}
                          </p>
                          
                          {feature.type === 'slider' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">
                                  {feature.adoption}% adoption
                                </Badge>
                                <span className={`text-sm font-medium ${
                                  enterpriseHighContrast ? 'text-white' : 'text-gray-800'
                                }`}>
                                  {feature.value?.[0]}{feature.unit}
                                </span>
                              </div>
                              <Slider
                                value={feature.value}
                                onValueChange={feature.onValueChange}
                                min={feature.min}
                                max={feature.max}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className={`text-2xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                Analytics Accessibilité par Département
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departmentUsage.map((dept) => (
                  <Card key={dept.department} className={`shadow-lg border-0 ${
                    enterpriseHighContrast 
                      ? 'bg-gray-900 border-white border-2' 
                      : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-lg ${
                          enterpriseHighContrast ? 'text-white' : 'text-gray-800'
                        }`}>
                          {dept.department}
                        </h3>
                        <Badge variant={dept.percentage > 50 ? 'default' : 'secondary'}>
                          {dept.percentage}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'}>
                            Utilisateurs actifs
                          </span>
                          <span className={`font-medium ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                            {dept.users}/{dept.total}
                          </span>
                        </div>
                        <Progress value={dept.percentage} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <h2 className={`text-2xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                Conformité WCAG Enterprise
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {wcagEnterpriseCompliance.map((item) => (
                  <Card key={item.level} className={`shadow-lg border-0 ${
                    enterpriseHighContrast 
                      ? 'bg-gray-900 border-white border-2' 
                      : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium text-lg ${
                            enterpriseHighContrast ? 'text-white' : 'text-gray-800'
                          }`}>
                            WCAG {item.level}
                          </h4>
                          <p className={`text-sm ${
                            enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {item.description}
                          </p>
                          <p className={`text-xs mt-2 ${
                            enterpriseHighContrast ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {item.details}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`h-5 w-5 ${
                            item.status === 'complete' ? 'text-success' : 'text-warning'
                          }`} />
                          <Badge variant={item.status === 'complete' ? 'default' : 'secondary'}>
                            {item.status === 'complete' ? 'Conforme' : 'En cours'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                  Déploiement Enterprise
                </h2>
                <Button onClick={exportAccessibilityReport} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Rapport Complet
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`shadow-lg border-0 ${
                  enterpriseHighContrast 
                    ? 'bg-gray-900 border-white border-2' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={enterpriseHighContrast ? 'text-white' : 'text-gray-800'}>
                      Raccourcis Clavier Enterprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {enterpriseKeyboardShortcuts.map((shortcut, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                          enterpriseHighContrast ? 'bg-gray-800 border border-white' : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <span className={`text-sm ${
                            enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {shortcut.action}
                          </span>
                          <Badge variant={enterpriseHighContrast ? "outline" : "secondary"} className={
                            enterpriseHighContrast ? 'border-white text-white' : ''
                          }>
                            {shortcut.keys}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className={`shadow-lg border-0 ${
                  enterpriseHighContrast 
                    ? 'bg-gray-900 border-white border-2' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={enterpriseHighContrast ? 'text-white' : 'text-gray-800'}>
                      Actions de Déploiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" onClick={deployToAllUsers}>
                      <Users className="h-4 w-4 mr-2" />
                      Déployer à tous les employés
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Générer guide de formation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics d'adoption détaillés
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuration par département
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <h2 className={`text-2xl font-bold ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                Support Accessibilité Enterprise
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`shadow-lg border-0 ${
                  enterpriseHighContrast 
                    ? 'bg-gray-900 border-white border-2' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                      Support Technique 24/7
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm mb-4 ${
                      enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Équipe spécialisée accessibilité disponible en continu pour assistance enterprise.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contacter le Support
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`shadow-lg border-0 ${
                  enterpriseHighContrast 
                    ? 'bg-gray-900 border-white border-2' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                      Formation Équipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm mb-4 ${
                      enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Programmes de formation sur l'accessibilité pour managers et équipes IT.
                    </p>
                    <Button variant="outline" className="w-full">
                      Planifier Formation
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`shadow-lg border-0 ${
                  enterpriseHighContrast 
                    ? 'bg-gray-900 border-white border-2' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${enterpriseHighContrast ? 'text-white' : 'text-gray-800'}`}>
                      Audit Personnalisé
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm mb-4 ${
                      enterpriseHighContrast ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Évaluation complète de l'accessibilité de votre environnement de travail.
                    </p>
                    <Button variant="outline" className="w-full">
                      Programmer Audit
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default B2BAccessibilityPage;