import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LegalPrivacyPage: React.FC = () => {
  const { t } = useTranslation('legal');

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t('privacyPolicy')}</CardTitle>
          <CardDescription>
            {t('lastUpdated')}: 30 août 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Collecte d'informations</h2>
                <p className="text-muted-foreground leading-7">
                  EmotionsCare collecte des données personnelles uniquement avec votre consentement explicite. 
                  Cela inclut les données émotionnelles via nos capteurs, les données vocales pour l'analyse, 
                  et les données biométriques selon vos préférences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. {t('sensorData')}</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{t('cameraData')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Utilisées pour l'analyse d'émotions faciales uniquement si vous l'autorisez. 
                      Les images ne sont jamais stockées, seules les métriques émotionnelles sont conservées.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('microphoneData')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Enregistrements vocaux pour le journal vocal et l'analyse d'émotions. 
                      Chiffrement bout en bout et suppression automatique selon vos préférences.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('heartRateData')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Données de fréquence cardiaque via capteurs compatibles pour enrichir l'analyse émotionnelle.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. {t('dataUsage')}</h2>
                <p className="text-muted-foreground leading-7">
                  Vos données sont utilisées exclusivement pour personnaliser votre expérience bien-être : 
                  recommandations musicales, exercices de respiration adaptés, insights émotionnels personnalisés.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. {t('gdprCompliance')}</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{t('rightToAccess')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander l'accès à toutes vos données personnelles à tout moment.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('rightToErasure')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Suppression complète de vos données sur simple demande, effectuée sous 30 jours.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t('rightToPortability')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Export de vos données dans un format lisible et transférable.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. {t('dataRetention')}</h2>
                <p className="text-muted-foreground leading-7">
                  Les données brutes (audio, images) sont supprimées automatiquement après traitement. 
                  Les métriques émotionnelles sont conservées selon vos préférences (7 jours à 2 ans maximum).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. {t('dataSecurity')}</h2>
                <p className="text-muted-foreground leading-7">
                  Chiffrement AES-256, transmission sécurisée via HTTPS, stockage dans des centres de données 
                  certifiés ISO 27001. Aucune donnée n'est partagée avec des tiers sans votre consentement explicite.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Cookies et traceurs</h2>
                <p className="text-muted-foreground leading-7">
                  Conformément au référentiel ECC-RGPD-01, les cookies essentiels sont déposés pour sécuriser votre session
                  et mémoriser vos préférences d'accessibilité. Les cookies de mesure d'audience (Matomo) et de
                  personnalisation sont proposés en opt-in et restent désactivés tant que vous n'avez pas donné votre
                  consentement.
                </p>
                <p className="text-muted-foreground leading-7 mt-3">
                  Vous pouvez modifier vos choix à tout moment depuis le bandeau cookies ou dans Paramètres &gt; Confidentialité
                  &gt; Préférences cookies. Pour connaître la liste exhaustive des traceurs, leurs durées de conservation et les
                  modalités de gestion, consultez notre{' '}
                  <Link to="/legal/cookies" className="text-primary underline underline-offset-4">
                    Politique relative aux cookies
                  </Link>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. {t('contact')}</h2>
                <p className="text-muted-foreground leading-7">
                  {t('dataProtectionOfficer')}: privacy@emotionscare.com<br/>
                  Pour exercer vos droits RGPD ou toute question sur cette politique.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Modifications</h2>
                <p className="text-muted-foreground leading-7">
                  Cette politique peut être mise à jour. Les modifications importantes vous seront notifiées 
                  par email et dans l'application 30 jours avant leur prise d'effet.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalPrivacyPage;