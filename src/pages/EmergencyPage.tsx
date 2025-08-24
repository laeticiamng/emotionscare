
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Heart, 
  Shield, 
  Users,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Stethoscope,
  Globe,
  Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      name: 'SAMU (Urgences médicales)',
      number: '15',
      description: 'Urgences médicales, détresse respiratoire',
      available: '24h/24 - 7j/7',
      type: 'medical'
    },
    {
      name: 'Pompiers',
      number: '18',
      description: 'Urgences, accidents, secours',
      available: '24h/24 - 7j/7',
      type: 'emergency'
    },
    {
      name: 'Police/Gendarmerie',
      number: '17',
      description: 'Urgences sécuritaires, violences',
      available: '24h/24 - 7j/7',
      type: 'security'
    },
    {
      name: 'Numéro européen d\'urgence',
      number: '112',
      description: 'Toutes urgences depuis l\'Europe',
      available: '24h/24 - 7j/7',
      type: 'european'
    }
  ];

  const suicidePreventionContacts = [
    {
      name: 'SOS Amitié',
      number: '09 72 39 40 50',
      description: 'Écoute pour personnes en détresse',
      available: '24h/24 - 7j/7',
      website: 'https://www.sos-amitie.org'
    },
    {
      name: 'Suicide Écoute',
      number: '01 45 39 40 00',
      description: 'Prévention du suicide',
      available: '24h/24 - 7j/7',
      website: 'https://suicide-ecoute.fr'
    },
    {
      name: 'SOS Suicide Phénix',
      number: '01 40 44 46 45',
      description: 'Aide aux personnes suicidaires',
      available: 'Tous les jours 13h-23h',
      website: 'https://sos-suicide-phenix.org'
    }
  ];

  const mentalHealthContacts = [
    {
      name: 'Fil Santé Jeunes',
      number: '0800 235 236',
      description: 'Santé mentale des jeunes (12-25 ans)',
      available: 'Tous les jours 9h-23h',
      website: 'https://www.filsantejeunes.com'
    },
    {
      name: 'Écoute Info Service',
      number: '0800 23 13 13',
      description: 'Information et orientation santé mentale',
      available: 'Lun-Ven 8h-20h',
      website: null
    },
    {
      name: 'Croix-Rouge Écoute',
      number: '0800 858 858',
      description: 'Soutien psychologique gratuit',
      available: 'Tous les jours 8h-20h',
      website: 'https://www.croix-rouge.fr'
    }
  ];

  const emergencySteps = [
    {
      step: 1,
      title: 'Évaluez la situation',
      description: 'Êtes-vous en danger immédiat ? Y a-t-il urgence vitale ?',
      action: 'Si OUI, appelez immédiatement le 15, 17 ou 18'
    },
    {
      step: 2,
      title: 'Cherchez un soutien immédiat',
      description: 'Contactez un proche de confiance ou un professionnel',
      action: 'Utilisez les numéros d\'écoute ci-dessous'
    },
    {
      step: 3,
      title: 'Utilisez nos outils d\'urgence',
      description: 'Techniques de respiration, méditation guidée d\'urgence',
      action: 'Accédez aux outils de gestion de crise'
    },
    {
      step: 4,
      title: 'Planifiez un suivi',
      description: 'Prenez rendez-vous avec un professionnel de santé mentale',
      action: 'Consultez notre annuaire ou votre médecin'
    }
  ];

  const crisisTools = [
    {
      name: 'Respiration d\'urgence',
      description: 'Technique 4-7-8 pour calmer l\'anxiété',
      action: () => navigate('/breath/emergency'),
      icon: Heart,
      duration: '3 min'
    },
    {
      name: 'Méditation de crise',
      description: 'Méditation guidée pour les moments difficiles',
      action: () => navigate('/meditation/crisis'),
      icon: Users,
      duration: '5 min'
    },
    {
      name: 'Chat d\'écoute IA',
      description: 'Support immédiat par intelligence artificielle',
      action: () => navigate('/coach?mode=emergency'),
      icon: MessageSquare,
      duration: 'Disponible maintenant'
    },
    {
      name: 'Journal de crise',
      description: 'Exprimez vos émotions par l\'écriture',
      action: () => navigate('/journal?mode=crisis'),
      icon: Heart,
      duration: 'Libre'
    }
  ];

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <Stethoscope className="h-5 w-5 text-red-500" />;
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'european':
        return <Globe className="h-5 w-5 text-green-500" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header d'urgence */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <Badge variant="outline" className="mb-4 text-red-600 border-red-200 bg-red-50">
                🚨 Assistance d'urgence
              </Badge>
              <h1 className="text-4xl font-bold mb-4 text-red-600">
                Besoin d'aide immédiate ?
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Si vous traversez une crise ou ressentez une détresse émotionnelle intense, 
                vous n'êtes pas seul(e). Des ressources et des professionnels sont disponibles pour vous aider.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-red-100 dark:bg-red-900/20 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto"
            >
              <p className="text-red-800 dark:text-red-200 font-medium">
                ⚠️ <strong>Si vous êtes en danger immédiat ou avez des pensées suicidaires,</strong> 
                appelez immédiatement les services d'urgence : <strong>15, 17, 18 ou 112</strong>
              </p>
            </motion.div>
          </div>

          {/* Étapes d'urgence */}
          <Card className="mb-8 border-red-200">
            <CardHeader className="bg-red-50 dark:bg-red-900/10">
              <CardTitle className="text-red-700">Que faire en cas de crise ?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {emergencySteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold">{step.step}</span>
                    </div>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <p className="text-xs font-medium text-red-600">{step.action}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Urgences vitales */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 dark:bg-red-900/10">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Phone className="h-5 w-5" />
                  Urgences Vitales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-red-50/50 transition-colors">
                      {getContactIcon(contact.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{contact.name}</span>
                          <a 
                            href={`tel:${contact.number}`}
                            className="text-2xl font-bold text-red-600 hover:text-red-700"
                          >
                            {contact.number}
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                        <p className="text-xs text-green-600">{contact.available}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outils de crise EmotionsCare */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/10">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Heart className="h-5 w-5" />
                  Outils de Crise EmotionsCare
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {crisisTools.map((tool, index) => (
                    <button
                      key={index}
                      onClick={tool.action}
                      className="w-full flex items-center gap-3 p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <tool.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-xs text-muted-foreground">{tool.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Prévention suicide */}
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50 dark:bg-purple-900/10">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Headphones className="h-5 w-5" />
                  Prévention du Suicide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {suicidePreventionContacts.map((contact, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{contact.name}</span>
                        <a 
                          href={`tel:${contact.number}`}
                          className="text-lg font-bold text-purple-600 hover:text-purple-700"
                        >
                          {contact.number}
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{contact.description}</p>
                      <p className="text-xs text-green-600 mb-2">{contact.available}</p>
                      {contact.website && (
                        <a 
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                        >
                          Site web <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Santé mentale */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50 dark:bg-green-900/10">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Users className="h-5 w-5" />
                  Soutien Santé Mentale
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {mentalHealthContacts.map((contact, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{contact.name}</span>
                        <a 
                          href={`tel:${contact.number}`}
                          className="text-lg font-bold text-green-600 hover:text-green-700"
                        >
                          {contact.number}
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{contact.description}</p>
                      <p className="text-xs text-green-600 mb-2">{contact.available}</p>
                      {contact.website && (
                        <a 
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                        >
                          Site web <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer d'encouragement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="py-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-2xl font-bold mb-4">
                  Vous n'êtes pas seul(e)
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  La douleur émotionnelle peut sembler insurmontable, mais elle est temporaire. 
                  Des professionnels bienveillants et des outils efficaces peuvent vous aider à traverser cette période difficile. 
                  Votre vie a de la valeur, et il existe toujours de l'espoir.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/coach?mode=emergency')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Parler maintenant avec l'IA
                  </Button>
                  <Button 
                    onClick={() => navigate('/contact')}
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter notre équipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyPage;
