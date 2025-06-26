
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  User, 
  Building2, 
  Heart, 
  Shield, 
  Zap, 
  Crown, 
  Check, 
  X,
  ArrowRight,
  Star,
  Globe,
  Headphones,
  BarChart3,
  Lock,
  Smartphone,
  Cloud
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const modes = {
    b2c: {
      title: 'Espace Particulier',
      subtitle: 'Pour votre bien-être personnel',
      icon: User,
      color: 'from-blue-500 to-purple-600',
      description: 'Découvrez une approche personnalisée du bien-être mental avec des outils adaptés à votre rythme de vie.',
      features: [
        'Scan émotionnel personnel',
        'Coach IA dédié 24h/24',
        'Musicothérapie adaptative',
        'Journal privé sécurisé',
        'Suivi de progression individuel',
        'Méditation et VR',
        'Communauté bienveillante',
        'Support premium'
      ],
      benefits: [
        'Liberté totale d\'utilisation',
        'Confidentialité maximale',
        'Approche holistique',
        'Outils scientifiquement validés'
      ],
      pricing: {
        free: ['Scan de base', 'Journal simple', 'Musique limitée'],
        premium: ['Toutes les fonctionnalités', 'IA avancée', 'VR illimitée', 'Support prioritaire']
      },
      testimonials: [
        {
          name: 'Marie L.',
          text: 'EmotionsCare m\'a aidée à mieux comprendre mes émotions. Le coach IA est formidable !',
          rating: 5
        },
        {
          name: 'Thomas K.',
          text: 'Les sessions VR sont incroyables pour la relaxation après le travail.',
          rating: 5
        }
      ]
    },
    b2b: {
      title: 'Espace Entreprise',
      subtitle: 'Pour le bien-être de vos équipes',
      icon: Building2,
      color: 'from-green-500 to-teal-600',
      description: 'Transformez votre environnement de travail avec une solution complète de bien-être mental pour vos collaborateurs.',
      features: [
        'Dashboard administrateur',
        'Analytics équipes',
        'Suivi collectif anonymisé',
        'Programmes personnalisés',
        'Intégration SSO/SAML',
        'Formation des managers',
        'Reporting exécutif',
        'Support dédié B2B'
      ],
      benefits: [
        'Réduction de l\'absentéisme',
        'Amélioration de la productivité',
        'Conformité RGPD',
        'ROI mesurable'
      ],
      pricing: {
        starter: ['Jusqu\'à 50 employés', 'Analytics de base', 'Support standard'],
        enterprise: ['Employés illimités', 'Analytics avancées', 'Support premium', 'Formation']
      },
      testimonials: [
        {
          name: 'Sophie M., DRH',
          text: 'Nos équipes sont plus épanouies. Les analytics nous aident à prendre de meilleures décisions.',
          rating: 5
        },
        {
          name: 'Jean-Paul R., CEO',
          text: 'Le ROI a été visible dès le 3ème mois. Un investissement indispensable.',
          rating: 5
        }
      ]
    }
  };

  const comparisonFeatures = [
    {
      feature: 'Scan émotionnel',
      b2c: { available: true, details: 'Personnel et privé' },
      b2b: { available: true, details: 'Équipe et individuel' }
    },
    {
      feature: 'Coach IA',
      b2c: { available: true, details: '24h/24 personnel' },
      b2b: { available: true, details: 'Multiple coaches spécialisés' }
    },
    {
      feature: 'Analytics',
      b2c: { available: true, details: 'Progression personnelle' },
      b2b: { available: true, details: 'Équipe + exécutif' }
    },
    {
      feature: 'Intégrations',
      b2c: { available: false, details: 'Non disponible' },
      b2b: { available: true, details: 'SSO, SAML, APIs' }
    },
    {
      feature: 'Support',
      b2c: { available: true, details: 'Communautaire + premium' },
      b2b: { available: true, details: 'Dédié + formation' }
    },
    {
      feature: 'Conformité',
      b2c: { available: true, details: 'RGPD standard' },
      b2b: { available: true, details: 'RGPD + audit de sécurité' }
    }
  ];

  const handleModeSelect = (mode: 'b2c' | 'b2b') => {
    setSelectedMode(mode);
    toast({
      title: `Mode ${mode === 'b2c' ? 'Particulier' : 'Entreprise'} sélectionné`,
      description: 'Vous allez être redirigé vers l\'espace approprié',
    });
    
    setTimeout(() => {
      navigate(`/${mode}`);
    }, 1000);
  };

  const ModeCard = ({ mode, data }: { mode: 'b2c' | 'b2b'; data: any }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl ${selectedMode === mode ? 'ring-4 ring-blue-500' : ''}`}
    >
      <Card className="h-full cursor-pointer" onClick={() => setShowPreview(mode)}>
        <div className={`h-4 bg-gradient-to-r ${data.color}`} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <data.icon className="h-12 w-12 text-primary" />
            <Badge variant="secondary" className="font-medium">
              {mode === 'b2c' ? 'Particulier' : 'Entreprise'}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{data.title}</CardTitle>
          <p className="text-muted-foreground">{data.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{data.description}</p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Fonctionnalités clés :</h4>
            <div className="grid grid-cols-1 gap-1">
              {data.features.slice(0, 4).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {data.features.length > 4 && (
              <p className="text-xs text-muted-foreground">
                +{data.features.length - 4} autres fonctionnalités
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={(e) => {
                e.stopPropagation();
                handleModeSelect(mode);
              }}
            >
              Choisir cet espace
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Choisissez Votre Espace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              EmotionsCare s'adapte à vos besoins, que vous soyez un particulier ou une entreprise
            </p>
          </motion.div>
        </div>

        {/* Navigation par onglets */}
        <Tabs defaultValue="selection" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="selection">Sélection</TabsTrigger>
            <TabsTrigger value="comparison">Comparatif</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Sélection des modes */}
          <TabsContent value="selection">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <ModeCard mode="b2c" data={modes.b2c} />
              <ModeCard mode="b2b" data={modes.b2b} />
            </div>

            {/* Témoignages */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-8">Ce que disent nos utilisateurs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {Object.entries(modes).map(([key, mode]) => (
                  <div key={key} className="space-y-4">
                    <h3 className="font-semibold text-lg">{mode.title}</h3>
                    {mode.testimonials.map((testimonial, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm italic">"{testimonial.text}"</p>
                          <p className="text-xs text-muted-foreground mt-2">- {testimonial.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Comparatif détaillé */}
          <TabsContent value="comparison">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Comparatif Détaillé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Fonctionnalité</th>
                        <th className="text-center p-4">
                          <div className="flex items-center justify-center gap-2">
                            <User className="h-5 w-5" />
                            Particulier
                          </div>
                        </th>
                        <th className="text-center p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Entreprise
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{item.feature}</td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {item.b2c.available ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {item.b2c.details}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {item.b2b.available ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {item.b2b.details}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aperçu des interfaces */}
          <TabsContent value="preview">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Aperçu des Interfaces</h2>
                <p className="text-muted-foreground">
                  Découvrez à quoi ressemble chaque espace avant de faire votre choix
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(modes).map(([key, mode]) => (
                  <Card key={key} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <mode.icon className="h-5 w-5" />
                        {mode.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <Smartphone className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Aperçu de l'interface {key === 'b2c' ? 'particulier' : 'entreprise'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Fonctionnalités principales :</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {mode.features.slice(0, 6).map((feature, index) => (
                            <div key={index} className="text-xs flex items-center gap-1">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleModeSelect(key as 'b2c' | 'b2b')}
                      >
                        Essayer cet espace
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Puis-je changer d'espace plus tard ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, vous pouvez migrer vos données d'un espace à l'autre à tout moment via les paramètres de votre compte.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Mes données sont-elles sécurisées ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absolument. Nous respectons les normes RGPD et utilisons un chiffrement de niveau bancaire pour protéger vos données.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Y a-t-il une période d'essai ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, nous offrons 14 jours d'essai gratuit pour toutes les fonctionnalités premium, sans engagement.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Puis-je utiliser EmotionsCare hors ligne ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Certaines fonctionnalités comme le journal et la musique sont disponibles hors ligne. Le scan émotionnel nécessite une connexion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default ChooseModePage;
