// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Shield, Eye, Database, Lock, UserCheck, 
  Clock, FileText, AlertTriangle, Mail, Download, Trash2 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { usePageSEO } from '@/hooks/usePageSEO';

/**
 * Page Politique de Confidentialité - Conforme RGPD (Art. 13 & 14)
 */
export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  usePageSEO({
    title: 'Politique de Confidentialité',
    description: 'Politique de confidentialité EmotionsCare : traitement des données personnelles, droits RGPD, durée de conservation, transferts et DPO.',
    keywords: 'confidentialité, RGPD, données personnelles, vie privée, EmotionsCare, DPO',
    canonical: 'https://emotionscare.com/legal/privacy',
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-3xl flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Politique de Confidentialité
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                Conforme RGPD
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : 1 mars 2026 | Version 1.0
            </p>
          </CardHeader>

          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                1. Identité du responsable de traitement
              </h2>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Responsable du traitement :</strong> EmotionsCare SASU</p>
                <p><strong>Siège social :</strong> Appartement 1, 5 rue Caudron, 80000 Amiens</p>
                <p><strong>RCS :</strong> 944 505 445 R.C.S. Amiens</p>
                <p><strong>SIRET :</strong> 944 505 445 00014</p>
                <p><strong>Email :</strong> <a href="mailto:contact@emotionscare.com" className="text-primary">contact@emotionscare.com</a></p>
                <p><strong>Délégué à la Protection des Données (DPO) :</strong><br />
                  Email : <a href="mailto:contact@emotionscare.com" className="text-primary">contact@emotionscare.com</a><br />
                  Adresse : EmotionsCare SASU, 5 rue Caudron, 80000 Amiens
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                2. Données personnelles collectées
              </h2>
              
              <h3>2.1. Données d'identification et de contact</h3>
              <ul>
                <li><strong>Collecte :</strong> Nom, prénom, email, téléphone (optionnel)</li>
                <li><strong>Finalité :</strong> Création et gestion de compte, authentification, support client</li>
                <li><strong>Base légale :</strong> Exécution du contrat (Art. 6.1.b RGPD)</li>
                <li><strong>Durée de conservation :</strong> 3 ans après dernière connexion</li>
              </ul>

              <h3>2.2. Données de santé et bien-être émotionnel</h3>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 my-4">
                <p className="font-semibold text-destructive mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Données sensibles - Catégorie spéciale (Art. 9 RGPD)
                </p>
                <p>Les données suivantes constituent des <strong>données de santé</strong> au sens du RGPD :</p>
                <ul className="mt-2">
                  <li><strong>Scans émotionnels :</strong> Résultats d'analyse faciale, tonalité vocale, reconnaissance émotions</li>
                  <li><strong>Journal émotionnel :</strong> Entrées texte, audio, métadonnées émotionnelles</li>
                  <li><strong>Évaluations cliniques :</strong> Questionnaires WHO-5, PHQ-9, GAD-7, réponses aux assessments</li>
                  <li><strong>Données biométriques :</strong> Analyse faciale via MediaPipe (traitement local uniquement)</li>
                  <li><strong>Conversations avec l'IA Coach :</strong> Historique synthétique (pas de messages bruts)</li>
                </ul>
                <p className="mt-3">
                  <strong>Base légale :</strong> Consentement explicite et spécifique (Art. 9.2.a RGPD) recueilli lors de l'activation de chaque fonctionnalité
                </p>
                <p>
                  <strong>Durée de conservation :</strong> 
                </p>
                <ul>
                  <li>Scans émotionnels : 12 mois</li>
                  <li>Journal émotionnel : Illimitée (contrôle utilisateur, export/suppression à la demande)</li>
                  <li>Évaluations cliniques : 24 mois</li>
                  <li>Logs Coach IA : 6 mois</li>
                </ul>
              </div>

              <h3>2.3. Données de navigation et cookies</h3>
              <ul>
                <li><strong>Collecte :</strong> Adresse IP (anonymisée), User-Agent, pages visitées, durée de session</li>
                <li><strong>Finalité :</strong> Sécurité, détection fraude, mesure d'audience (Matomo auto-hébergé UE)</li>
                <li><strong>Base légale :</strong> Intérêt légitime (sécurité) + Consentement (analytics opt-in)</li>
                <li><strong>Durée de conservation :</strong> 13 mois maximum</li>
              </ul>
              <p>
                Pour plus d'informations, consultez notre <Link to="/legal/cookies" className="text-primary hover:underline">Politique Cookies</Link>.
              </p>

              <h3>2.4. Données de paiement (offre Premium)</h3>
              <ul>
                <li><strong>Collecte :</strong> Identifiant transaction, montant, date, moyen de paiement (carte bancaire non stockée par nous)</li>
                <li><strong>Prestataire :</strong> Stripe Inc. (certifié PCI-DSS Niveau 1)</li>
                <li><strong>Finalité :</strong> Traitement des paiements, facturation, lutte anti-fraude</li>
                <li><strong>Base légale :</strong> Exécution du contrat (Art. 6.1.b RGPD)</li>
                <li><strong>Durée de conservation :</strong> 10 ans (obligations comptables et fiscales)</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                3. Destinataires des données
              </h2>
              <p>Vos données sont accessibles aux catégories de destinataires suivants :</p>
              
              <h3>3.1. Services internes EmotionsCare</h3>
              <ul>
                <li>Personnel habilité (support client, équipe technique) - accès strictement limité</li>
                <li>Administrateurs système (logs d'accès, traçabilité RGPD)</li>
              </ul>

              <h3>3.2. Sous-traitants et prestataires techniques</h3>
              <table className="w-full text-sm border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Prestataire</th>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Localisation</th>
                    <th className="p-3 text-left">Garanties</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Supabase Inc.</td>
                    <td className="p-3">Hébergement base de données</td>
                    <td className="p-3">🇪🇺 UE (Frankfurt)</td>
                    <td className="p-3">DPA signé, ISO 27001</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Lovable</td>
                    <td className="p-3">Hébergement web</td>
                    <td className="p-3">🇺🇸 USA</td>
                    <td className="p-3">CCT UE-USA</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">OpenAI (optionnel)</td>
                    <td className="p-3">IA Coach (opt-in)</td>
                    <td className="p-3">🇺🇸 USA</td>
                    <td className="p-3">DPA, anonymisation</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Stripe Inc.</td>
                    <td className="p-3">Paiements</td>
                    <td className="p-3">🇺🇸 USA</td>
                    <td className="p-3">PCI-DSS, DPA</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Sentry.io</td>
                    <td className="p-3">Monitoring erreurs</td>
                    <td className="p-3">🇺🇸 USA</td>
                    <td className="p-3">Anonymisation PII</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Transferts hors UE :</strong> Les transferts vers les États-Unis sont encadrés par des Clauses Contractuelles Types (CCT) approuvées par la Commission Européenne et des DPA (Data Processing Agreements) conformes au RGPD.
              </p>

              <h3>3.3. Autorités légales</h3>
              <p>
                Nous pouvons être amenés à communiquer vos données aux autorités compétentes (CNIL, police, justice) 
                sur demande légale ou réquisition judiciaire.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                4. Sécurité et protection des données
              </h2>
              <p>EmotionsCare met en œuvre les mesures techniques et organisationnelles suivantes :</p>
              <ul>
                <li><strong>Chiffrement :</strong> TLS 1.3 en transit, AES-256 au repos (base de données)</li>
                <li><strong>Authentification :</strong> Supabase Auth avec tokens JWT sécurisés</li>
                <li><strong>RLS (Row Level Security) :</strong> Isolation des données utilisateur au niveau base de données</li>
                <li><strong>Journalisation :</strong> Logs d'accès, audit trails, détection d'intrusion</li>
                <li><strong>Sauvegarde :</strong> Backups quotidiens chiffrés, rétention 30 jours</li>
                <li><strong>Tests :</strong> Audits sécurité réguliers, tests d'intrusion annuels</li>
                <li><strong>Accès restreints :</strong> Principe du moindre privilège, authentification multi-facteurs (MFA) pour admins</li>
              </ul>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="font-semibold mb-2">🔒 Notification de violation (Art. 33-34 RGPD)</p>
                <p className="text-sm">
                  En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés, 
                  EmotionsCare s'engage à :
                </p>
                <ul className="text-sm mt-2">
                  <li>Notifier la CNIL sous 72 heures</li>
                  <li>Vous informer dans les meilleurs délais si le risque est élevé</li>
                  <li>Documenter l'incident et les mesures correctives</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                5. Vos droits RGPD
              </h2>
              <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
              
              <div className="grid md:grid-cols-2 gap-4 my-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Droit d'accès (Art. 15)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Obtenir une copie de vos données personnelles et des informations sur les traitements.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Droit de rectification (Art. 16)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Corriger ou compléter vos données inexactes ou incomplètes.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-primary" />
                      Droit à l'effacement (Art. 17)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Demander la suppression de vos données (sous conditions). Délai d'exécution : 30 jours.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
                      Droit à la portabilité (Art. 20)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Recevoir vos données dans un format structuré (JSON) et les transmettre à un autre responsable.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      Droit d'opposition (Art. 21)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    S'opposer au traitement pour motifs légitimes (sauf obligation légale de notre part).
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Droit à la limitation (Art. 18)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Geler temporairement le traitement de vos données pendant vérification.
                  </CardContent>
                </Card>
              </div>

              <h3>Comment exercer vos droits ?</h3>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact DPO (Délégué à la Protection des Données)
                </p>
                <ul>
                  <li><strong>Email :</strong> <a href="mailto:contact@emotionscare.com" className="text-primary hover:underline">contact@emotionscare.com</a></li>
                  <li><strong>Courrier :</strong> EmotionsCare SASU, 5 rue Caudron, 80000 Amiens</li>
                  <li><strong>Formulaire en ligne :</strong> <Link to="/app/settings/privacy" className="text-primary hover:underline">Paramètres compte → RGPD</Link></li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>Délai de réponse :</strong> 1 mois maximum (prorogeable de 2 mois si complexité, avec justification).
                </p>
                <p className="text-sm">
                  <strong>Pièce justificative :</strong> Copie de pièce d'identité requise pour sécuriser votre demande.
                </p>
              </div>

              <h3 className="mt-6">Réclamation auprès de la CNIL</h3>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés :
              </p>
              <p>
                <strong>CNIL</strong><br />
                3 Place de Fontenoy - TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Tél : 01 53 73 22 22<br />
                Site : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                6. Durées de conservation détaillées
              </h2>
              <table className="w-full text-sm border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Type de données</th>
                    <th className="p-3 text-left">Durée active</th>
                    <th className="p-3 text-left">Archivage intermédiaire</th>
                    <th className="p-3 text-left">Sort final</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Compte utilisateur</td>
                    <td className="p-3">Durée du contrat</td>
                    <td className="p-3">3 ans après dernière connexion</td>
                    <td className="p-3">Suppression</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Scans émotionnels</td>
                    <td className="p-3">12 mois</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Suppression auto</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Journal émotionnel</td>
                    <td className="p-3">Illimitée (contrôle utilisateur)</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Suppression à la demande</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Évaluations cliniques</td>
                    <td className="p-3">24 mois</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Suppression auto</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Logs Coach IA</td>
                    <td className="p-3">6 mois</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Suppression auto</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Logs techniques/sécurité</td>
                    <td className="p-3">3 mois</td>
                    <td className="p-3">12 mois (archivage sécurisé)</td>
                    <td className="p-3">Suppression</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Données de paiement</td>
                    <td className="p-3">Durée contrat + 1 an</td>
                    <td className="p-3">10 ans (obligations fiscales)</td>
                    <td className="p-3">Suppression</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Section 7 */}
            <section>
              <h2>7. Modifications de la politique</h2>
              <p>
                Cette politique de confidentialité peut être mise à jour pour refléter les évolutions de nos pratiques, 
                de nos services ou des exigences légales. Toute modification substantielle sera notifiée par :
              </p>
              <ul>
                <li>Email à votre adresse enregistrée (minimum 15 jours avant entrée en vigueur)</li>
                <li>Bannière d'information lors de votre prochaine connexion</li>
                <li>Mention de la version et date de mise à jour en haut de cette page</li>
              </ul>
              <p>
                Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la manière 
                dont nous protégeons vos données.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                8. Contact
              </h2>
              <p>Pour toute question concernant cette politique de confidentialité ou le traitement de vos données :</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Email :</strong> <a href="mailto:contact@emotionscare.com" className="text-primary hover:underline">contact@emotionscare.com</a></p>
                <p><strong>Courrier :</strong> EmotionsCare SASU – 5 rue Caudron, 80000 Amiens</p>
              </div>
            </section>

            <section className="text-sm text-muted-foreground border-t pt-4">
              <p><strong>Date d'entrée en vigueur :</strong> 1 mars 2026</p>
              <p><strong>Version :</strong> 1.0</p>
              <p className="mt-2">
                Cette politique de confidentialité a été rédigée conformément au Règlement (UE) 2016/679 (RGPD), 
                à la Loi Informatique et Libertés n°78-17 du 6 janvier 1978 modifiée, et aux recommandations de la CNIL.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
