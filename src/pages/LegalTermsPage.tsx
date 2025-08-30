/**
 * Page des conditions d'utilisation - Légal simple
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Eye } from 'lucide-react';
import { useRouter } from '@/hooks/router';

const LegalTermsPage: React.FC = () => {
  const { goBack, navigate } = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={goBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Conditions d'Utilisation
            </h1>
            <p className="text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Navigation rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/legal/privacy')} 
            variant="outline" 
            className="justify-start"
          >
            <Shield className="w-4 h-4 mr-2" />
            Confidentialité
          </Button>
          <Button 
            onClick={() => navigate('/help')} 
            variant="outline"
            className="justify-start"
          >
            <Eye className="w-4 h-4 mr-2" />
            Centre d'aide
          </Button>
          <Button 
            onClick={() => navigate('/contact')} 
            variant="outline"
            className="justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptation des Conditions</CardTitle>
              <CardDescription>
                En utilisant EmotionsCare, vous acceptez ces conditions d'utilisation.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                L'accès et l'utilisation de la plateforme EmotionsCare (ci-après "le Service") 
                sont soumis aux présentes conditions d'utilisation. En créant un compte ou en 
                utilisant nos services, vous acceptez d'être lié par ces conditions.
              </p>
              <p>
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description du Service</CardTitle>
              <CardDescription>
                Plateforme de bien-être émotionnel avec technologies d'assistance.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                EmotionsCare propose une plateforme de bien-être émotionnel comprenant :
              </p>
              <ul>
                <li><strong>Analyse émotionnelle :</strong> Via caméra, microphone (avec consentement)</li>
                <li><strong>Coaching IA :</strong> Assistant personnel pour le bien-être mental</li>
                <li><strong>Musicothérapie :</strong> Génération de musique adaptée à votre humeur</li>
                <li><strong>Journal personnel :</strong> Suivi de votre évolution émotionnelle</li>
                <li><strong>Modules VR :</strong> Expériences immersives de relaxation</li>
                <li><strong>Capteurs biométriques :</strong> Intégration optionnelle de données santé</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Utilisation des Capteurs</CardTitle>
              <CardDescription>
                Information sur l'utilisation des capteurs et données biométriques.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Notre plateforme peut utiliser les capteurs suivants avec votre consentement explicite :
              </p>
              <ul>
                <li><strong>Caméra :</strong> Pour l'analyse faciale d'émotions et filtres AR</li>
                <li><strong>Microphone :</strong> Pour l'enregistrement de journal vocal et analyse prosodique</li>
                <li><strong>Capteur cardiaque :</strong> Pour le suivi du rythme cardiaque via Bluetooth</li>
                <li><strong>Géolocalisation :</strong> Pour adapter les recommandations (optionnel)</li>
              </ul>
              <p>
                <strong>Important :</strong> Vous pouvez désactiver l'accès à ces capteurs à tout moment 
                dans vos paramètres de confidentialité. Aucun accès n'est effectué sans votre consentement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Compte Utilisateur</CardTitle>
              <CardDescription>
                Responsabilités liées à votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Vous êtes responsable de :
              </p>
              <ul>
                <li>La confidentialité de vos identifiants de connexion</li>
                <li>Toutes les activités effectuées sous votre compte</li>
                <li>La véracité des informations fournies</li>
                <li>Le respect des présentes conditions d'utilisation</li>
              </ul>
              <p>
                Vous devez immédiatement nous notifier tout usage non autorisé de votre compte.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Protection des Données</CardTitle>
              <CardDescription>
                Engagement sur la protection de vos données personnelles.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Nous nous engageons à protéger vos données conformément au RGPD :
              </p>
              <ul>
                <li><strong>Minimisation :</strong> Nous ne collectons que les données nécessaires</li>
                <li><strong>Consentement :</strong> Votre accord explicite pour chaque usage</li>
                <li><strong>Transparence :</strong> Information claire sur l'utilisation de vos données</li>
                <li><strong>Sécurité :</strong> Chiffrement et protection contre les accès non autorisés</li>
                <li><strong>Droits :</strong> Accès, rectification, suppression de vos données</li>
              </ul>
              <p>
                Consultez notre <Button 
                  onClick={() => navigate('/legal/privacy')} 
                  variant="link" 
                  className="p-0 h-auto"
                >
                  politique de confidentialité
                </Button> pour plus de détails.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Rétention des Données</CardTitle>
              <CardDescription>
                Durée de conservation de vos informations.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                <strong>Données brutes (audio/image) :</strong> Supprimées automatiquement après 30 jours 
                sauf si vous cochez "conserver" lors de l'enregistrement.
              </p>
              <p>
                <strong>Données d'analyse :</strong> Conservées tant que votre compte est actif 
                pour assurer la continuité du service.
              </p>
              <p>
                <strong>Suppression de compte :</strong> Toutes vos données sont supprimées 
                définitivement 30 jours après votre demande de suppression.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Limitation de Responsabilité</CardTitle>
              <CardDescription>
                Cadre de responsabilité du service.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                EmotionsCare est un outil de bien-être et ne constitue pas :
              </p>
              <ul>
                <li>Un dispositif médical ou de diagnostic</li>
                <li>Un remplacement à un suivi médical professionnel</li>
                <li>Un traitement pour des troubles psychologiques</li>
              </ul>
              <p>
                <strong>En cas d'urgence médicale ou de pensées suicidaires, 
                contactez immédiatement les services d'urgence (15, 115) ou 
                consultez un professionnel de santé.</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Modifications</CardTitle>
              <CardDescription>
                Évolution des conditions d'utilisation.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Nous nous réservons le droit de modifier ces conditions à tout moment. 
                Les modifications importantes vous seront notifiées par email et/ou 
                via une notification dans l'application.
              </p>
              <p>
                L'usage continu du service après notification constitue votre acceptation 
                des nouvelles conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact</CardTitle>
              <CardDescription>
                Pour toute question sur ces conditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Pour toute question concernant ces conditions d'utilisation :
              </p>
              <ul>
                <li><strong>Email :</strong> legal@emotionscare.fr</li>
                <li><strong>Support :</strong> via le centre d'aide intégré à l'application</li>
                <li><strong>Courrier :</strong> EmotionsCare, Service Juridique, [Adresse]</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer actions */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ces conditions d'utilisation sont en vigueur depuis le {new Date().toLocaleDateString('fr-FR')}
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/legal/privacy')} variant="outline">
              Politique de confidentialité
            </Button>
            <Button onClick={() => navigate('/help')} variant="outline">
              Centre d'aide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTermsPage;