import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { usePageSEO } from '@/hooks/usePageSEO';

/**
 * Page Politique de Confidentialité
 */
export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  usePageSEO({
    title: 'Politique de Confidentialité - EmotionsCare',
    description: 'Politique de confidentialité EmotionsCare : collecte, traitement et protection de vos données personnelles. Droits RGPD, durées de conservation et sécurité des données.',
    keywords: 'politique confidentialité, RGPD, données personnelles, vie privée, protection données, EmotionsCare'
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(routes.public.home())}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Politique de Confidentialité</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardHeader>

          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              EmotionsCare accorde une importance primordiale à la protection de vos données
              personnelles et de santé. Cette politique explique comment nous collectons,
              utilisons et protégeons vos informations.
            </p>

            <h2>2. Données collectées</h2>
            <h3>Données d'identification</h3>
            <ul>
              <li>Nom, prénom, email</li>
              <li>Date de naissance (optionnelle)</li>
              <li>Photo de profil (optionnelle)</li>
            </ul>

            <h3>Données de santé et émotionnelles</h3>
            <ul>
              <li>Scans émotionnels (expressions faciales analysées localement)</li>
              <li>Entrées de journal personnel</li>
              <li>Sessions de méditation et respiration</li>
              <li>Scores de bien-être et tendances</li>
              <li>Données de fréquence cardiaque (si synchronisation appareil)</li>
            </ul>

            <h3>Données techniques</h3>
            <ul>
              <li>Logs de connexion et d'utilisation</li>
              <li>Adresse IP (anonymisée après 30 jours)</li>
              <li>Type d'appareil et navigateur</li>
            </ul>

            <h2>3. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Personnaliser votre expérience et vos recommandations</li>
              <li>Suivre votre progression et générer des statistiques</li>
              <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
              <li>Assurer la sécurité et prévenir les abus</li>
            </ul>

            <h2>4. Protection des données de santé</h2>
            <p>
              Conformément au RGPD et à la directive européenne sur les données de santé, vos
              données sensibles sont :
            </p>
            <ul>
              <li>Chiffrées en transit (TLS 1.3) et au repos (AES-256)</li>
              <li>Hébergées en Europe (Supabase EU)</li>
              <li>Jamais partagées avec des tiers à des fins commerciales</li>
              <li>Accessibles uniquement avec votre consentement explicite</li>
            </ul>

            <h2>5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>
                <strong>Droit d'accès</strong> : obtenir une copie de vos données
              </li>
              <li>
                <strong>Droit de rectification</strong> : corriger vos données inexactes
              </li>
              <li>
                <strong>Droit à l'effacement</strong> : supprimer votre compte et données
              </li>
              <li>
                <strong>Droit à la portabilité</strong> : exporter vos données (format JSON)
              </li>
              <li>
                <strong>Droit d'opposition</strong> : refuser certains traitements
              </li>
            </ul>
            <p>
              Pour exercer ces droits : <strong>privacy@emotionscare.com</strong>
            </p>

            <h2>6. Cookies et traceurs</h2>
            <p>Nous utilisons :</p>
            <ul>
              <li>
                <strong>Cookies essentiels</strong> : authentification, préférences (obligatoires)
              </li>
              <li>
                <strong>Cookies analytiques</strong> : Sentry pour monitoring (opt-in)
              </li>
            </ul>
            <p>Vous pouvez gérer vos préférences dans Paramètres &gt; Confidentialité.</p>

            <h2>7. Partage des données</h2>
            <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec :</p>
            <ul>
              <li>
                <strong>Supabase</strong> : hébergement base de données (DPA RGPD signé)
              </li>
              <li>
                <strong>OpenAI</strong> : génération de contenu (anonymisé, opt-in)
              </li>
              <li>
                <strong>Autorités</strong> : uniquement sur réquisition judiciaire
              </li>
            </ul>

            <h2>8. Durée de conservation</h2>
            <ul>
              <li>Compte actif : durée illimitée</li>
              <li>Après suppression : 30 jours (puis effacement définitif)</li>
              <li>Logs anonymisés : 12 mois maximum</li>
            </ul>

            <h2>9. Sécurité</h2>
            <p>Mesures techniques et organisationnelles :</p>
            <ul>
              <li>Chiffrement bout-en-bout</li>
              <li>Authentification multi-facteurs (optionnelle)</li>
              <li>Audits de sécurité réguliers</li>
              <li>Équipe DPO dédiée</li>
            </ul>

            <h2>10. Mineurs</h2>
            <p>
              EmotionsCare est réservé aux 15 ans et plus. Entre 15-18 ans, le consentement
              parental est requis.
            </p>

            <h2>11. Contact</h2>
            <p>
              <strong>Délégué à la Protection des Données (DPO)</strong>
              <br />
              Email : dpo@emotionscare.com
              <br />
              Adresse : EmotionsCare, France
            </p>
            <p>
              Vous pouvez également introduire une réclamation auprès de la CNIL (
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.cnil.fr
              </a>
              ).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
