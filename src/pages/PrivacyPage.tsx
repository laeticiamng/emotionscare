
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Server, 
  UserCheck, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Settings,
  Globe,
  Clock,
  Key
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const privacyPrinciples = [
    {
      icon: Shield,
      title: "Protection par Défaut",
      description: "Vos données sont protégées dès l'inscription, sans configuration nécessaire"
    },
    {
      icon: Eye,
      title: "Transparence Totale",
      description: "Nous vous informons clairement de ce que nous collectons et pourquoi"
    },
    {
      icon: UserCheck,
      title: "Contrôle Utilisateur",
      description: "Vous gardez le contrôle total sur vos données personnelles"
    },
    {
      icon: Lock,
      title: "Chiffrement Avancé",
      description: "Toutes vos données sont chiffrées avec des standards militaires"
    }
  ];

  const dataTypes = [
    {
      category: "Données d'Identification",
      items: ["Nom et prénom", "Adresse email", "Photo de profil (optionnelle)"],
      purpose: "Création et gestion de votre compte",
      retention: "Tant que votre compte est actif",
      icon: UserCheck
    },
    {
      category: "Données Émotionnelles",
      items: ["Analyses faciales", "Analyses vocales", "Entrées journal", "Scores de bien-être"],
      purpose: "Personnalisation de votre expérience et suivi de progression",
      retention: "2 ans après dernière activité",
      icon: Database
    },
    {
      category: "Données d'Usage",
      items: ["Pages visitées", "Fonctionnalités utilisées", "Temps d'utilisation"],
      purpose: "Amélioration de nos services",
      retention: "1 an maximum",
      icon: Settings
    },
    {
      category: "Données Techniques",
      items: ["Adresse IP", "Type de navigateur", "Système d'exploitation"],
      purpose: "Sécurité et support technique",
      retention: "6 mois maximum",
      icon: Server
    }
  ];

  const rights = [
    {
      title: "Droit d'Accès",
      description: "Consultez toutes les données que nous avons sur vous",
      action: "Télécharger mes données",
      icon: Download
    },
    {
      title: "Droit de Rectification",
      description: "Corrigez ou mettez à jour vos informations personnelles",
      action: "Modifier mon profil",
      icon: Settings
    },
    {
      title: "Droit à l'Effacement",
      description: "Supprimez définitivement votre compte et toutes vos données",
      action: "Supprimer mon compte",
      icon: Trash2
    },
    {
      title: "Droit à la Portabilité",
      description: "Exportez vos données dans un format réutilisable",
      action: "Exporter mes données",
      icon: FileText
    }
  ];

  const certifications = [
    { name: "RGPD", description: "Conforme au Règlement Général sur la Protection des Données", icon: Shield },
    { name: "ISO 27001", description: "Certification sécurité de l'information", icon: Lock },
    { name: "HDS", description: "Hébergeur de Données de Santé certifié", icon: Database },
    { name: "SOC 2", description: "Audit de sécurité et conformité", icon: Key }
  ];

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Votre vie privée est notre priorité. Découvrez comment nous protégeons 
              et utilisons vos données personnelles en toute transparence.
            </p>
            <div className="flex justify-center items-center gap-2 mt-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Dernière mise à jour : 15 janvier 2024
              </span>
            </div>
          </motion.div>
        </div>

        {/* Privacy Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Nos Principes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyPrinciples.map((principle, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <principle.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Data Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Données Collectées
              </CardTitle>
              <CardDescription>
                Détail transparent de toutes les informations que nous collectons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {dataTypes.map((dataType, index) => (
                  <div key={index} className="border-l-4 border-primary/20 pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <dataType.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{dataType.category}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Données collectées :</h4>
                        <ul className="space-y-1">
                          {dataType.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Finalité :</h4>
                        <p className="text-muted-foreground">{dataType.purpose}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Conservation :</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{dataType.retention}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Rights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Vos Droits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rights.map((right, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <right.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{right.title}</CardTitle>
                      <CardDescription>{right.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {right.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Security Measures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Mesures de Sécurité
              </CardTitle>
              <CardDescription>
                Technologies et pratiques pour protéger vos données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Protection Technique
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Chiffrement AES-256</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Connexions HTTPS/TLS 1.3</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Authentification à deux facteurs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Surveillance continue 24h/24</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    Infrastructure
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Centres de données européens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Sauvegardes automatiques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Isolation des données utilisateur</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Audits de sécurité réguliers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-3">
                    <cert.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-12"
        >
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Information Importante</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    EmotionsCare ne vend jamais vos données personnelles à des tiers. 
                    Nous ne les utilisons que pour améliorer votre expérience et votre bien-être.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    En cas de questions sur cette politique de confidentialité, 
                    contactez notre Délégué à la Protection des Données : 
                    <strong> dpo@emotionscare.com</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="py-8">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Transparent par Choix</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nous croyons que vous avez le droit de savoir exactement comment vos données 
                sont utilisées pour améliorer votre bien-être émotionnel.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate('/contact')}>
                  Poser une Question
                </Button>
                <Button variant="outline" onClick={() => navigate('/privacy-toggles')}>
                  Gérer mes Préférences
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
