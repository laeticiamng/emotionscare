import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Shield, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Conditions d'utilisation
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-4 w-4" />
                <span>Dernière mise à jour : 15 décembre 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sommaire</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a href="#acceptation" className="text-primary hover:underline">1. Acceptation des conditions</a>
              <a href="#services" className="text-primary hover:underline">2. Description des services</a>
              <a href="#compte" className="text-primary hover:underline">3. Création de compte</a>
              <a href="#utilisation" className="text-primary hover:underline">4. Utilisation acceptable</a>
              <a href="#donnees" className="text-primary hover:underline">5. Protection des données</a>
              <a href="#responsabilite" className="text-primary hover:underline">6. Limitation de responsabilité</a>
              <a href="#propriete" className="text-primary hover:underline">7. Propriété intellectuelle</a>
              <a href="#modifications" className="text-primary hover:underline">8. Modifications des conditions</a>
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle id="acceptation" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                1. Acceptation des conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                En accédant et en utilisant la plateforme EmotionsCare, vous acceptez d'être lié par les présentes 
                conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
              <p>
                Ces conditions s'appliquent à tous les utilisateurs, qu'ils soient des particuliers (B2C) 
                ou des utilisateurs professionnels (B2B).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="services" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                2. Description des services
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                EmotionsCare est une plateforme de bien-être émotionnel qui propose :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Analyse et suivi des émotions</li>
                <li>Contenus thérapeutiques personnalisés (musique, exercices de respiration)</li>
                <li>Journal personnel et outils de réflexion</li>
                <li>Coach IA pour le soutien émotionnel</li>
                <li>Outils collaboratifs pour les équipes (version B2B)</li>
                <li>Tableaux de bord analytiques (version manager)</li>
              </ul>
              <p className="text-amber-600 bg-amber-50 p-4 rounded-lg">
                <strong>Important :</strong> Nos services sont destinés au bien-être général et ne remplacent pas 
                un suivi médical ou psychologique professionnel. En cas de détresse ou de troubles graves, 
                consultez un professionnel de santé.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="compte">3. Création et gestion de compte</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4>Éligibilité</h4>
              <p>
                Vous devez être âgé d'au moins 16 ans pour créer un compte. Les mineurs de 16-18 ans 
                doivent obtenir l'autorisation de leurs parents.
              </p>
              
              <h4>Responsabilités du compte</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la sécurité de vos identifiants</li>
                <li>Nous notifier immédiatement de toute utilisation non autorisée</li>
                <li>N'utiliser qu'un seul compte par personne</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="utilisation">4. Utilisation acceptable</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4>Utilisations autorisées</h4>
              <p>Vous pouvez utiliser EmotionsCare pour votre bien-être personnel ou celui de votre équipe (B2B).</p>
              
              <h4>Utilisations interdites</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Partager des contenus illégaux, diffamatoires ou nuisibles</li>
                <li>Tenter de contourner nos mesures de sécurité</li>
                <li>Utiliser des robots ou scripts automatisés</li>
                <li>Revendre ou redistribuer nos services sans autorisation</li>
                <li>Utiliser la plateforme à des fins de recherche sans consentement explicite</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="donnees">5. Protection des données</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                La protection de vos données personnelles est notre priorité. Nous nous engageons à :
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Respecter intégralement le RGPD</li>
                <li>Chiffrer toutes vos données sensibles</li>
                <li>Ne jamais vendre vos données à des tiers</li>
                <li>Vous permettre d'exporter ou supprimer vos données à tout moment</li>
                <li>Appliquer l'anonymisation k-anonyme (k≥5) pour les données agrégées en B2B</li>
              </ul>
              <p>
                Pour plus de détails, consultez notre 
                <Link to="/legal/privacy" className="text-primary hover:underline ml-1">
                  Politique de confidentialité
                </Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="responsabilite">6. Limitation de responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                EmotionsCare fournit ses services "en l'état". Nous nous efforçons d'assurer la disponibilité 
                et la qualité de nos services, mais ne pouvons garantir :
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Une disponibilité 100% sans interruption</li>
                <li>L'exactitude absolue des analyses émotionnelles automatisées</li>
                <li>Des résultats thérapeutiques spécifiques</li>
              </ul>
              <p className="text-red-600 bg-red-50 p-4 rounded-lg">
                <strong>Limitation :</strong> Notre responsabilité est limitée au montant payé pour nos services 
                au cours des 12 derniers mois, sauf en cas de faute lourde de notre part.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="propriete">7. Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4>Nos droits</h4>
              <p>
                EmotionsCare, son logo, ses algorithmes et contenus sont protégés par les droits d'auteur 
                et marques déposées.
              </p>
              
              <h4>Vos droits</h4>
              <p>
                Vous conservez la propriété de vos contenus personnels (journal, enregistrements vocaux). 
                Vous nous accordez une licence d'utilisation nécessaire au fonctionnement du service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id="modifications">8. Modifications des conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Nous pouvons modifier ces conditions avec un préavis de 30 jours. Les modifications importantes 
                vous seront notifiées par email et dans l'application.
              </p>
              <p>
                Si vous continuez à utiliser nos services après l'entrée en vigueur des nouvelles conditions, 
                vous les acceptez tacitement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Pour toute question : support@emotionscare.fr
            </div>
            <div className="flex gap-4">
              <Link to="/legal/privacy">
                <Button variant="outline">Politique de confidentialité</Button>
              </Link>
              <Link to="/help">
                <Button variant="outline">Centre d'aide</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}