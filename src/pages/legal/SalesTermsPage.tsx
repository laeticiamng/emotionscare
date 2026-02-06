import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, ShoppingCart, CreditCard, RotateCcw, 
  FileText, AlertCircle, Euro, Calendar 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { routes } from '@/lib/routes';

/**
 * Page Conditions Générales de Vente (CGV) - Conforme Code de la Consommation
 */
export const SalesTermsPage: React.FC = () => {
  const navigate = useNavigate();

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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-3xl flex items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-primary" />
                Conditions Générales de Vente
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                B2C - Consommateurs
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Applicables aux offres Premium EmotionsCare | Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </CardHeader>

          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            
            {/* Préambule */}
            <section className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h2 className="mt-0">Préambule</h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent toute souscription à l'offre Premium 
                d'EmotionsCare par un consommateur au sens de l'article liminaire du Code de la consommation.
              </p>
              <p className="mb-0">
                Toute commande implique l'acceptation pleine et entière des présentes CGV, qui prévalent sur tout 
                autre document, sauf accord écrit contraire.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Identification du vendeur
              </h2>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Raison sociale :</strong> EmotionsCare SASU</p>
                <p><strong>Forme juridique :</strong> Société par Actions Simplifiée Unipersonnelle</p>
                <p><strong>Capital social :</strong> 100,00 €</p>
                <p><strong>Siège social :</strong> Appartement 1, 5 rue Caudron, 80000 Amiens</p>
                <p><strong>RCS :</strong> 944 505 445 R.C.S. Amiens</p>
                <p><strong>SIRET :</strong> 944 505 445 00014</p>
                <p><strong>N° TVA intracommunautaire :</strong> FR71944505445</p>
                <p><strong>Email :</strong> <a href="mailto:contact@emotionscare.com" className="text-primary">contact@emotionscare.com</a></p>
                <p><strong>Directrice de la publication :</strong> Laeticia Motongane, Présidente</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2>2. Objet et champ d'application</h2>
              <p>
                Les présentes CGV ont pour objet de définir les conditions dans lesquelles EmotionsCare SASU (ci-après « le Vendeur ») 
                propose à la vente ses services d'abonnement Premium permettant d'accéder à des fonctionnalités avancées de 
                bien-être émotionnel et de suivi psychologique.
              </p>
              <p>
                <strong>Services concernés :</strong>
              </p>
              <ul>
                <li>Offre Gratuite : accès limité aux fonctionnalités de base</li>
                <li>Abonnement EmotionsCare Premium Mensuel : 14,99 € TTC/mois</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Les offres B2B (Entreprises) sont régies par des Conditions Générales de Vente B2B distinctes.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                3. Prix et modalités de paiement
              </h2>
              
              <h3>3.1. Prix</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Offre</th>
                      <th className="text-right p-2">Prix HT</th>
                      <th className="text-right p-2">TVA (20%)</th>
                      <th className="text-right p-2">Prix TTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">Offre Gratuite</td>
                      <td className="text-right p-2">0,00 €</td>
                      <td className="text-right p-2">0,00 €</td>
                      <td className="text-right p-2 font-semibold">Gratuit</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">Premium Mensuel</td>
                      <td className="text-right p-2">12,49 €</td>
                      <td className="text-right p-2">2,50 €</td>
                      <td className="text-right p-2 font-semibold">14,99 € TTC</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Les prix sont indiqués en Euros (€), <strong>Toutes Taxes Comprises (TTC)</strong>, TVA française au taux en vigueur (20%).
              </p>
              <p>
                <strong>Révision des prix :</strong> Le Vendeur se réserve le droit de modifier ses tarifs à tout moment. 
                Les nouveaux tarifs s'appliqueront aux nouveaux abonnements. Pour les abonnements en cours, toute augmentation 
                sera notifiée par email au moins <strong>1 mois avant</strong> son application. L'abonné pourra alors résilier 
                sans frais avant la date d'effet.
              </p>

              <h3>3.2. Modalités de paiement</h3>
              <p>Le paiement s'effectue :</p>
              <ul>
                <li><strong>Carte bancaire :</strong> CB, Visa, Mastercard, American Express (via Stripe)</li>
                <li><strong>Prélèvement SEPA :</strong> Disponible pour les abonnements annuels (activation sous 48h)</li>
                <li><strong>Portefeuilles électroniques :</strong> Apple Pay, Google Pay</li>
              </ul>
              <p>
                Le paiement est <strong>immédiatement exigible</strong> à la commande. L'accès au service Premium est activé 
                dès réception du paiement confirmé (généralement instantané).
              </p>

              <h3>3.3. Facturation</h3>
              <p>
                Une facture électronique est automatiquement générée et envoyée par email après chaque paiement. 
                Elle est également accessible depuis votre espace client (<em>Paramètres → Abonnement → Factures</em>).
              </p>
              <p className="text-sm text-muted-foreground">
                Les factures sont conservées 10 ans conformément aux obligations comptables et fiscales.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                4. Durée et renouvellement de l'abonnement
              </h2>
              <p>
                Les abonnements sont <strong>à reconduction tacite</strong> sauf résiliation avant la date anniversaire.
              </p>
              <ul>
                <li>
                  <strong>Abonnement mensuel :</strong> Reconduction automatique chaque mois. Prélèvement le même jour calendaire.
                </li>
                <li>
                  <strong>Abonnement annuel :</strong> Reconduction automatique chaque année à date anniversaire.
                </li>
              </ul>
              <p>
                <strong>Notification de renouvellement :</strong> Un email de rappel est envoyé <strong>7 jours avant</strong> 
                chaque prélèvement récurrent avec le montant et la date exacte.
              </p>
              <p>
                <strong>Résiliation :</strong> Vous pouvez résilier à tout moment depuis votre espace client. 
                La résiliation prend effet à la fin de la période en cours (pas de remboursement prorata temporis). 
                L'accès Premium reste actif jusqu'à l'échéance payée.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                5. Droit de rétractation (14 jours)
              </h2>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="font-semibold mb-2">
                  Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de 
                  <strong> 14 jours calendaires</strong> pour exercer votre droit de rétractation sans avoir à justifier de motifs.
                </p>
                <p><strong>Point de départ :</strong> Date de souscription de l'abonnement (email de confirmation).</p>
                <p><strong>Délai :</strong> 14 jours calendaires révolus.</p>
              </div>

              <h3>5.1. Exception - Exécution anticipée du contrat</h3>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="flex items-center gap-2 font-semibold text-destructive mb-2">
                  <AlertCircle className="h-5 w-5" />
                  Perte du droit de rétractation
                </p>
                <p>
                  Conformément à l'article L221-28 du Code de la consommation, <strong>vous perdez votre droit de rétractation</strong> 
                  si vous avez expressément demandé l'exécution du service avant la fin du délai de 14 jours ET que vous avez 
                  commencé à utiliser le service (connexion, téléchargement de contenu, utilisation de fonctionnalités Premium).
                </p>
                <p className="mt-2">
                  Lors de la souscription, une case à cocher vous demande expressément de confirmer :
                </p>
                <ul className="text-sm mt-2">
                  <li>« Je demande l'exécution immédiate du service EmotionsCare Premium »</li>
                  <li>« Je reconnais perdre mon droit de rétractation dès la première utilisation »</li>
                </ul>
              </div>

              <h3>5.2. Modalités d'exercice du droit de rétractation</h3>
              <p>Pour exercer votre droit de rétractation, vous pouvez :</p>
              <ol>
                <li>
                  <strong>Formulaire en ligne :</strong> Espace client → Abonnement → "Demander une rétractation"
                </li>
                <li>
                  <strong>Email :</strong> <a href="mailto:retractation@emotionscare.com" className="text-primary hover:underline">retractation@emotionscare.com</a>
                </li>
                <li>
                  <strong>Courrier recommandé :</strong> EmotionsCare SASU - Service Rétractation - [Adresse à compléter]
                </li>
                <li>
                  <strong>Formulaire type (annexe) :</strong> <a href="#formulaire-type" className="text-primary hover:underline">Télécharger le formulaire</a>
                </li>
              </ol>

              <h3>5.3. Effets de la rétractation</h3>
              <p>
                En cas de rétractation valable, nous vous rembourserons <strong>tous les paiements reçus</strong> (hors frais de 
                livraison, non applicables ici) au plus tard dans les <strong>14 jours</strong> suivant la réception de votre 
                demande de rétractation.
              </p>
              <p>
                <strong>Moyen de remboursement :</strong> Identique au moyen de paiement utilisé (carte bancaire, compte SEPA). 
                Aucun frais ne sera appliqué.
              </p>

              <h3 id="formulaire-type">5.4. Formulaire de rétractation type</h3>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm mb-4">
                  <em>(Veuillez compléter et renvoyer ce formulaire uniquement si vous souhaitez vous rétracter du contrat)</em>
                </p>
                <div className="space-y-2 text-sm">
                  <p>À l'attention de :</p>
                  <p className="ml-4">
                    <strong>EmotionsCare SASU - Service Rétractation</strong><br />
                    [Adresse à compléter]<br />
                    France<br />
                    Email : contact@emotionscare.com
                  </p>
                  <p className="mt-4">
                    Je vous notifie par la présente ma rétractation du contrat portant sur la souscription à l'abonnement Premium 
                    EmotionsCare suivant :
                  </p>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>Commandé le : ____________________</li>
                    <li>N° de commande / Transaction : ____________________</li>
                    <li>Nom du consommateur : ____________________</li>
                    <li>Adresse email : ____________________</li>
                    <li>Date : ____________________</li>
                    <li>Signature (si formulaire papier) : ____________________</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2>6. Disponibilité et exécution du service</h2>
              <p>
                Le service EmotionsCare Premium est accessible <strong>24h/24, 7j/7</strong>, sous réserve des opérations de 
                maintenance programmées (notifiées 48h à l'avance par email).
              </p>
              <p>
                <strong>Taux de disponibilité garanti :</strong> 99,5% mensuel (hors maintenance planifiée). En cas de non-respect, 
                l'abonné bénéficie d'un avoir de 10% sur le mois suivant (activation automatique).
              </p>
              <p>
                <strong>Contenu :</strong> L'accès Premium comprend :
              </p>
              <ul>
                <li>Scans émotionnels illimités</li>
                <li>Coach IA personnalisé</li>
                <li>Musicothérapie adaptative</li>
                <li>Export de données et statistiques avancées</li>
                <li>Support prioritaire (réponse sous 4h ouvrées)</li>
                <li>Accès anticipé aux nouvelles fonctionnalités</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2>7. Garantie et service après-vente</h2>
              <h3>7.1. Garantie légale de conformité</h3>
              <p>
                Conformément aux articles L217-4 et suivants du Code de la consommation, le Vendeur est tenu de délivrer 
                un service conforme au contrat et répond des défauts de conformité existant lors de la délivrance.
              </p>
              <p>
                Le Vendeur répond également des défauts de conformité résultant de l'emballage, des instructions de montage 
                ou de l'installation lorsque celle-ci a été mise à sa charge par le contrat ou a été réalisée sous sa responsabilité.
              </p>

              <h3>7.2. Support client</h3>
              <p>
                <strong>Abonnés Premium :</strong> Support prioritaire disponible par email (<a href="mailto:support-premium@emotionscare.com" className="text-primary hover:underline">support-premium@emotionscare.com</a>) 
                et chat en direct (lun-ven 9h-19h, sam 10h-17h).
              </p>
              <p>
                <strong>Délai de réponse :</strong> 4 heures ouvrées maximum.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2>8. Responsabilité et force majeure</h2>
              <p>
                Le Vendeur décline toute responsabilité en cas d'inexécution ou de mauvaise exécution du contrat due à un 
                événement de force majeure au sens de l'article 1218 du Code civil (catastrophe naturelle, panne généralisée 
                d'Internet, cyberattaque d'ampleur, etc.).
              </p>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="font-semibold text-destructive mb-2">⚠️ Disclaimer médical</p>
                <p>
                  EmotionsCare est un outil de bien-être et ne remplace en aucun cas un suivi médical ou psychologique 
                  professionnel. Le Vendeur ne saurait être tenu responsable des conséquences d'une mauvaise interprétation 
                  des résultats ou d'une utilisation inappropriée du service. En cas de détresse psychologique ou de pensées 
                  suicidaires, contactez immédiatement le 15, le 112 ou le 3114.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2>9. Protection des données personnelles</h2>
              <p>
                Les données personnelles collectées lors de la souscription et de l'utilisation du service sont traitées 
                conformément au RGPD et à notre <Link to="/legal/privacy" className="text-primary hover:underline">Politique de Confidentialité</Link>.
              </p>
              <p>
                <strong>Responsable du traitement :</strong> EmotionsCare SASU<br />
                <strong>DPO :</strong> <a href="mailto:dpo@emotionscare.com" className="text-primary hover:underline">dpo@emotionscare.com</a>
              </p>
              <p>
                Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition sur vos données. 
                Délai de réponse : 1 mois maximum.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2>10. Médiation de la consommation</h2>
              <p>
                Conformément à l'article L612-1 du Code de la consommation, en cas de litige, vous pouvez recourir gratuitement 
                à notre médiateur de la consommation :
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Médiateur :</strong> Centre de Médiation de la Consommation de Conciliateurs de Justice (CM2C)</p>
                <p><strong>Adresse :</strong> 14 rue Saint Jean, 75017 Paris</p>
                <p><strong>Site web :</strong> <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cm2c.net</a></p>
                <p><strong>Email :</strong> contact@cm2c.net</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Conditions :</strong> Avoir préalablement tenté de résoudre le litige directement auprès d'EmotionsCare 
                par réclamation écrite. Le recours à la médiation est gratuit mais ne suspend pas les délais de prescription.
              </p>
              <p>
                Vous pouvez également recourir à la plateforme européenne de règlement des litiges en ligne : 
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2>11. Loi applicable et juridiction compétente</h2>
              <p>
                Les présentes CGV sont régies par le <strong>droit français</strong>.
              </p>
              <p>
                En cas de litige et à défaut d'accord amiable, le litige sera porté devant les juridictions compétentes 
                dans le ressort du lieu de résidence du consommateur défendeur, conformément aux règles de compétence 
                territoriale du Code de procédure civile.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2>12. Acceptation des CGV</h2>
              <p>
                Le fait de cocher la case « J'accepte les Conditions Générales de Vente » lors de la souscription vaut 
                acceptation pleine et entière des présentes CGV.
              </p>
              <p>
                Les CGV applicables sont celles en vigueur à la date de la commande. Une copie vous est transmise par email 
                et est archivée conformément aux obligations légales.
              </p>
            </section>

            <section className="text-sm text-muted-foreground border-t pt-4">
              <p><strong>Date d'entrée en vigueur :</strong> {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Version :</strong> 1.0</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesTermsPage;
