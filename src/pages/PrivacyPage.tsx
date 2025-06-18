
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Download, Trash2, Settings, Mail, Calendar } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const dataTypes = [
    {
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      title: "Données d'usage",
      description: "Pages visitées, fonctionnalités utilisées, temps de navigation",
      retention: "2 ans",
      purpose: "Améliorer l'expérience utilisateur"
    },
    {
      icon: <Settings className="h-6 w-6 text-green-500" />,
      title: "Données de profil",
      description: "Nom, email, préférences utilisateur",
      retention: "Durée du compte",
      purpose: "Personnaliser votre expérience"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Données émotionnelles",
      description: "Résultats de scans, entrées de journal",
      retention: "5 ans (ou suppression sur demande)",
      purpose: "Fournir des insights personnalisés"
    }
  ];

  const rights = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Droit d'accès",
      description: "Consulter toutes vos données personnelles"
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "Droit à la portabilité",
      description: "Télécharger vos données dans un format utilisable"
    },
    {
      icon: <Trash2 className="h-5 w-5" />,
      title: "Droit à l'effacement",
      description: "Supprimer définitivement vos données"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Droit de rectification",
      description: "Corriger ou modifier vos informations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            <Shield className="h-4 w-4 mr-2" />
            Politique de Confidentialité
          </Badge>
          <h1 className="text-4xl font-bold mb-6">
            Votre vie privée est notre priorité
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nous nous engageons à protéger vos données personnelles selon les normes 
            les plus strictes du RGPD européen.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Dernière mise à jour : 15 décembre 2024
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Conformité RGPD</h3>
              <p className="text-sm text-muted-foreground">
                100% conforme aux réglementations européennes
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Lock className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Chiffrement AES-256</h3>
              <p className="text-sm text-muted-foreground">
                Vos données sont chiffrées avec les meilleurs standards
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Suppression garantie</h3>
              <p className="text-sm text-muted-foreground">
                Supprimez vos données à tout moment en un clic
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold mb-6">1. Introduction</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                EmotionsCare (ci-après "nous", "notre" ou "la Société") respecte votre vie privée 
                et s'engage à protéger vos données personnelles. Cette politique de confidentialité 
                vous informe sur la façon dont nous collectons, utilisons et protégeons vos informations.
              </p>
              <p>
                En utilisant notre service, vous acceptez les pratiques décrites dans cette politique. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-3xl font-bold mb-6">2. Données collectées</h2>
            <div className="space-y-6">
              {dataTypes.map((dataType, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {dataType.icon}
                      <CardTitle>{dataType.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">{dataType.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Rétention: {dataType.retention}
                      </Badge>
                      <Badge variant="outline">
                        Finalité: {dataType.purpose}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-3xl font-bold mb-6">3. Utilisation des données</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">Nous utilisons vos données pour :</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Fournir et améliorer nos services de bien-être émotionnel</li>
                    <li>Personnaliser votre expérience utilisateur</li>
                    <li>Analyser l'utilisation de la plateforme (données anonymisées)</li>
                    <li>Vous envoyer des notifications importantes sur votre compte</li>
                    <li>Assurer la sécurité et prévenir les fraudes</li>
                    <li>Respecter nos obligations légales</li>
                  </ul>
                  <p className="font-medium text-foreground mt-4">
                    Nous ne vendons jamais vos données personnelles à des tiers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Rights */}
          <section>
            <h2 className="text-3xl font-bold mb-6">4. Vos droits RGPD</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {rights.map((right, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {right.icon}
                      <div>
                        <h3 className="font-semibold mb-1">{right.title}</h3>
                        <p className="text-sm text-muted-foreground">{right.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Comment exercer vos droits ?</h3>
                <p className="text-muted-foreground mb-4">
                  Pour exercer l'un de ces droits, contactez-nous à l'adresse{' '}
                  <a href="mailto:privacy@emotionscare.fr" className="text-primary hover:underline">
                    privacy@emotionscare.fr
                  </a>{' '}
                  ou via notre formulaire de contact. Nous répondrons dans les 30 jours maximum.
                </p>
                <div className="flex gap-4">
                  <Button asChild variant="outline">
                    <Link to="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-3xl font-bold mb-6">5. Sécurité des données</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Mesures techniques</h3>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li>• Chiffrement AES-256 pour toutes les données sensibles</li>
                      <li>• Connexions HTTPS/TLS exclusivement</li>
                      <li>• Authentification à deux facteurs disponible</li>
                      <li>• Surveillance continue des accès</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Mesures organisationnelles</h3>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li>• Accès limité aux données selon le principe du moindre privilège</li>
                      <li>• Formation régulière du personnel sur la sécurité</li>
                      <li>• Audits de sécurité trimestriels</li>
                      <li>• Plan de réponse aux incidents</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-3xl font-bold mb-6">6. Cookies et technologies similaires</h2>
            <Card>
              <CardContent className="pt-6 space-y-4 text-muted-foreground">
                <p>
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                  Ces cookies sont classés en plusieurs catégories :
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Cookies essentiels</h4>
                    <p className="text-sm">Nécessaires au fonctionnement du site (authentification, sécurité)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Cookies de performance</h4>
                    <p className="text-sm">Nous aident à comprendre comment vous utilisez le site (anonymes)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Cookies de préférences</h4>
                    <p className="text-sm">Mémorisent vos préférences (langue, thème)</p>
                  </div>
                </div>
                <p className="text-sm">
                  Vous pouvez gérer vos préférences de cookies à tout moment dans les paramètres de votre compte.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-3xl font-bold mb-6">7. Nous contacter</h2>
            <Card>
              <CardHeader>
                <CardTitle>Délégué à la Protection des Données (DPO)</CardTitle>
                <CardDescription>
                  Pour toute question concernant cette politique ou vos données personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-muted-foreground">privacy@emotionscare.fr</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Courrier</h4>
                    <p className="text-muted-foreground text-sm">
                      EmotionsCare - Service DPO<br />
                      123 Avenue des Innovations<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter le DPO
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
