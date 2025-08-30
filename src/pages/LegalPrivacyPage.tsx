/**
 * Page politique de confidentialité - Légal RGPD
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, Eye, Download, Trash2, Lock } from 'lucide-react';
import { useRouter } from '@/hooks/router';

const LegalPrivacyPage: React.FC = () => {
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
              <Shield className="w-8 h-8" />
              Politique de Confidentialité
            </h1>
            <p className="text-muted-foreground">
              Conforme RGPD - Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Alerte importante */}
        <Alert className="mb-8">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Votre vie privée est notre priorité.</strong> Cette politique détaille comment nous protégeons 
            vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
          </AlertDescription>
        </Alert>

        {/* Actions rapides RGPD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/settings/general')} 
            variant="outline" 
            className="justify-start"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir mes données
          </Button>
          <Button 
            onClick={() => navigate('/settings/general')} 
            variant="outline"
            className="justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter mes données
          </Button>
          <Button 
            onClick={() => navigate('/settings/general')} 
            variant="outline"
            className="justify-start text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer mon compte
          </Button>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Responsable du Traitement</CardTitle>
              <CardDescription>
                Qui traite vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                <strong>EmotionsCare</strong> est responsable du traitement de vos données personnelles.
              </p>
              <ul>
                <li><strong>Société :</strong> EmotionsCare SAS</li>
                <li><strong>Adresse :</strong> [Adresse de l'entreprise]</li>
                <li><strong>Email DPO :</strong> dpo@emotionscare.fr</li>
                <li><strong>Téléphone :</strong> [Numéro de téléphone]</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Données Collectées</CardTitle>
              <CardDescription>
                Quelles informations nous collectons et pourquoi
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Données d'identification :</h4>
              <ul>
                <li>Email (obligatoire pour la connexion)</li>
                <li>Nom/prénom (optionnel)</li>
                <li>Préférences de langue et thème</li>
              </ul>

              <h4>Données biométriques (avec consentement explicite) :</h4>
              <ul>
                <li><strong>Images faciales :</strong> Pour analyse émotionnelle et filtres AR</li>
                <li><strong>Enregistrements vocaux :</strong> Pour journal vocal et analyse prosodique</li>
                <li><strong>Rythme cardiaque :</strong> Via capteurs Bluetooth connectés</li>
                <li><strong>Données de mouvement :</strong> Pour expériences VR/AR</li>
              </ul>

              <h4>Données d'usage :</h4>
              <ul>
                <li>Interactions avec l'application</li>
                <li>Préférences de modules et fonctionnalités</li>
                <li>Journaux d'activité (anonymisés après 30 jours)</li>
                <li>Métriques de performance (anonymes)</li>
              </ul>

              <Alert className="my-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important :</strong> Aucune donnée biométrique n'est collectée sans votre 
                  consentement explicite que vous pouvez révoquer à tout moment dans vos paramètres.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Finalités du Traitement</CardTitle>
              <CardDescription>
                Pourquoi nous utilisons vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Fourniture du service (base légale : exécution du contrat) :</h4>
              <ul>
                <li>Authentification et gestion de compte</li>
                <li>Personnalisation de l'expérience utilisateur</li>
                <li>Génération de recommandations adaptées</li>
                <li>Historique personnel de progression</li>
              </ul>

              <h4>Analyse émotionnelle (base légale : consentement) :</h4>
              <ul>
                <li>Détection d'émotions via caméra/microphone</li>
                <li>Adaptation en temps réel des contenus</li>
                <li>Coaching IA personnalisé</li>
                <li>Musicothérapie adaptative</li>
              </ul>

              <h4>Amélioration du service (base légale : intérêt légitime) :</h4>
              <ul>
                <li>Analytics anonymisées d'usage</li>
                <li>Amélioration des algorithmes IA</li>
                <li>Détection et correction de bugs</li>
                <li>Optimisation des performances</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Conservation des Données</CardTitle>
              <CardDescription>
                Combien de temps nous gardons vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Données brutes biométriques :</h4>
              <ul>
                <li><strong>Audio/images :</strong> Supprimées automatiquement après 30 jours</li>
                <li><strong>Option "conserver" :</strong> Conservation jusqu'à suppression manuelle</li>
                <li><strong>Analyses extraites :</strong> Conservées pour améliorer le service personnel</li>
              </ul>

              <h4>Données de compte et préférences :</h4>
              <ul>
                <li><strong>Compte actif :</strong> Conservation tant que le compte existe</li>
                <li><strong>Compte inactif :</strong> Suppression après 3 ans d'inactivité</li>
                <li><strong>Suppression demandée :</strong> Suppression définitive sous 30 jours</li>
              </ul>

              <h4>Données analytiques :</h4>
              <ul>
                <li><strong>Données personnelles :</strong> Anonymisées après 12 mois</li>
                <li><strong>Données anonymes :</strong> Conservées pour amélioration du service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Vos Droits RGPD</CardTitle>
              <CardDescription>
                Contrôlez vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Droit d'accès :</h4>
              <p>Consultez toutes les données que nous avons sur vous via vos paramètres.</p>

              <h4>Droit de rectification :</h4>
              <p>Modifiez ou corrigez vos informations personnelles à tout moment.</p>

              <h4>Droit à l'effacement ("droit à l'oubli") :</h4>
              <p>Supprimez définitivement votre compte et toutes vos données.</p>

              <h4>Droit à la portabilité :</h4>
              <p>Exportez vos données dans un format lisible par machine (JSON/CSV).</p>

              <h4>Droit d'opposition :</h4>
              <p>Opposez-vous au traitement de vos données pour marketing direct.</p>

              <h4>Droit de limitation :</h4>
              <p>Demandez la suspension temporaire du traitement de vos données.</p>

              <h4>Retrait du consentement :</h4>
              <p>Révoquez à tout moment votre consentement pour les capteurs biométriques.</p>

              <div className="bg-primary/10 p-4 rounded-lg mt-4">
                <p className="font-medium">🛠️ Actions disponibles :</p>
                <div className="space-y-2 mt-2">
                  <Button onClick={() => navigate('/settings/general')} size="sm" variant="outline">
                    Gérer mes données
                  </Button>
                  <Button onClick={() => navigate('/settings/privacy')} size="sm" variant="outline">
                    Paramètres de confidentialité
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sécurité</CardTitle>
              <CardDescription>
                Comment nous protégeons vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Chiffrement :</h4>
              <ul>
                <li><strong>En transit :</strong> TLS 1.3 pour toutes les communications</li>
                <li><strong>Au repos :</strong> AES-256 pour le stockage des données sensibles</li>
                <li><strong>Base de données :</strong> Chiffrement au niveau colonnes pour données biométriques</li>
              </ul>

              <h4>Contrôle d'accès :</h4>
              <ul>
                <li><strong>Row Level Security (RLS) :</strong> Isolation stricte des données utilisateur</li>
                <li><strong>Authentification forte :</strong> Tokens JWT avec rotation automatique</li>
                <li><strong>Audit logs :</strong> Traçabilité de tous les accès aux données</li>
              </ul>

              <h4>Infrastructure :</h4>
              <ul>
                <li><strong>Hébergement :</strong> Serveurs sécurisés en Union Européenne</li>
                <li><strong>Sauvegardes :</strong> Chiffrées et géo-répliquées</li>
                <li><strong>Monitoring :</strong> Surveillance 24/7 des intrusions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Partage des Données</CardTitle>
              <CardDescription>
                Avec qui nous partageons vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Services tiers nécessaires au fonctionnement :</h4>
              <ul>
                <li><strong>Supabase :</strong> Infrastructure backend (EU, conforme RGPD)</li>
                <li><strong>OpenAI :</strong> IA conversationnelle (données anonymisées)</li>
                <li><strong>Hume AI :</strong> Analyse émotionnelle (données chiffrées)</li>
                <li><strong>Suno :</strong> Génération musicale (métadonnées uniquement)</li>
              </ul>

              <h4>Agrégation anonyme pour équipes B2B :</h4>
              <ul>
                <li><strong>Managers RH :</strong> Statistiques d'équipe anonymisées (min. 5 personnes)</li>
                <li><strong>Aucune donnée individuelle :</strong> Impossibilité d'identifier une personne</li>
                <li><strong>K-anonymat :</strong> Protection contre la réidentification</li>
              </ul>

              <p className="font-medium text-green-600">
                ✅ Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Transferts Internationaux</CardTitle>
              <CardDescription>
                Localisation de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                <strong>Priorité Union Européenne :</strong> Vos données sont principalement 
                stockées et traitées dans l'Union Européenne.
              </p>

              <h4>Transferts hors UE (avec garanties appropriées) :</h4>
              <ul>
                <li><strong>OpenAI (États-Unis) :</strong> Clauses contractuelles types + données anonymisées</li>
                <li><strong>Services d'urgence :</strong> Uniquement si nécessaire pour votre sécurité</li>
              </ul>

              <p>
                Tous les transferts hors UE respectent les mécanismes de transfert approuvés 
                par la Commission européenne.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact & Réclamations</CardTitle>
              <CardDescription>
                Comment nous contacter ou déposer une plainte
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h4>Délégué à la Protection des Données (DPO) :</h4>
              <ul>
                <li><strong>Email :</strong> dpo@emotionscare.fr</li>
                <li><strong>Courrier :</strong> EmotionsCare - DPO, [Adresse]</li>
                <li><strong>Délai de réponse :</strong> 30 jours maximum</li>
              </ul>

              <h4>Autorité de contrôle :</h4>
              <p>
                Si vous n'êtes pas satisfait de notre réponse, vous pouvez déposer 
                une réclamation auprès de la <strong>CNIL</strong> :
              </p>
              <ul>
                <li><strong>Site web :</strong> www.cnil.fr</li>
                <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
                <li><strong>Adresse :</strong> 3 Place de Fontenoy, 75007 Paris</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Modifications</CardTitle>
              <CardDescription>
                Évolution de cette politique
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Cette politique de confidentialité peut être mise à jour pour 
                refléter les évolutions légales ou de nos services.
              </p>
              <p>
                <strong>Notification :</strong> Toute modification importante vous sera 
                notifiée par email et/ou notification in-app au moins 30 jours avant 
                son entrée en vigueur.
              </p>
              <p>
                <strong>Version actuelle :</strong> {new Date().toLocaleDateString('fr-FR')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer actions */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Cette politique est en vigueur depuis le {new Date().toLocaleDateString('fr-FR')}
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/legal/terms')} variant="outline">
              Conditions d'utilisation
            </Button>
            <Button onClick={() => navigate('/settings/general')} variant="default">
              Gérer mes données
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPrivacyPage;