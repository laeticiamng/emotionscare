/**
 * Consent Management Page
 * GDPR Article 7 - Conditions for consent
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Info,
  History,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  ConsentManagementService,
  type ConsentType,
  type ConsentRecord,
} from '@/services/gdpr/ConsentManagementService';
import { logger } from '@/lib/logger';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ConsentManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<Record<ConsentType, boolean>>({
    terms_of_service: false,
    privacy_policy: false,
    data_processing: false,
    marketing_emails: false,
    analytics: false,
    cookies: false,
    third_party_sharing: false,
    ai_processing: false,
    medical_data: false,
  });
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<ConsentType | null>(null);

  const CURRENT_VERSION = '1.0.0';

  useEffect(() => {
    if (user?.id) {
      loadConsents();
    }
  }, [user?.id]);

  const loadConsents = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [activeConsents, history] = await Promise.all([
        ConsentManagementService.getActiveConsents(user.id),
        ConsentManagementService.getUserConsents(user.id),
      ]);

      // Update consent states
      const newConsents = { ...consents };
      activeConsents.forEach((consent) => {
        newConsents[consent.consent_type as ConsentType] = consent.granted;
      });
      setConsents(newConsents);
      setConsentHistory(history);
    } catch (error) {
      logger.error('Failed to load consents', error, 'GDPR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentChange = async (type: ConsentType, granted: boolean) => {
    if (!user?.id) return;

    setIsSaving(type);
    try {
      await ConsentManagementService.recordConsent(user.id, {
        consent_type: type,
        version: CURRENT_VERSION,
        granted,
      });

      setConsents((prev) => ({ ...prev, [type]: granted }));

      toast({
        title: granted ? 'Consentement accordé' : 'Consentement retiré',
        description: `${ConsentManagementService.getConsentLabel(type)} ${
          granted ? 'activé' : 'désactivé'
        }`,
      });

      await loadConsents();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le consentement',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(null);
    }
  };

  const consentGroups = [
    {
      title: 'Consentements essentiels',
      description: 'Nécessaires au fonctionnement de la plateforme',
      required: true,
      consents: [
        'terms_of_service' as ConsentType,
        'privacy_policy' as ConsentType,
        'data_processing' as ConsentType,
      ],
    },
    {
      title: 'Consentements fonctionnels',
      description: 'Améliorent votre expérience utilisateur',
      required: false,
      consents: [
        'cookies' as ConsentType,
        'analytics' as ConsentType,
        'ai_processing' as ConsentType,
      ],
    },
    {
      title: 'Consentements marketing et partage',
      description: 'Communication et partenariats',
      required: false,
      consents: [
        'marketing_emails' as ConsentType,
        'third_party_sharing' as ConsentType,
      ],
    },
    {
      title: 'Données sensibles',
      description: 'Traitement de données de santé',
      required: false,
      consents: ['medical_data' as ConsentType],
    },
  ];

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Gestion des consentements</h1>
          <p className="text-muted-foreground mt-2">
            Conformément au RGPD (Article 7), vous avez le contrôle total sur l'utilisation de
            vos données personnelles. Vous pouvez modifier vos consentements à tout moment.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">
                Vos droits concernant vos données
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Vous pouvez retirer votre consentement à tout moment</li>
                <li>Le retrait n'affecte pas la licéité des traitements antérieurs</li>
                <li>Certains consentements sont nécessaires au fonctionnement du service</li>
                <li>Toutes les modifications sont enregistrées dans votre historique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Groups */}
      {consentGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {group.title}
                  {group.required && (
                    <Badge variant="outline" className="text-xs">
                      Requis
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.consents.map((type) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {ConsentManagementService.getConsentLabel(type)}
                      </p>
                      {consents[type] ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {ConsentManagementService.getConsentDescription(type)}
                    </p>
                  </div>
                  <Switch
                    checked={consents[type]}
                    onCheckedChange={(checked) => handleConsentChange(type, checked)}
                    disabled={group.required || isSaving === type}
                    aria-label={ConsentManagementService.getConsentLabel(type)}
                  />
                </div>
                {type !== group.consents[group.consents.length - 1] && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Consent History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des consentements
          </CardTitle>
          <CardDescription>
            Consultez l'historique complet de vos consentements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun historique de consentement
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {consentHistory.slice(0, 10).map((consent) => (
                <AccordionItem key={consent.id} value={consent.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        {consent.granted && !consent.revoked_at ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">
                          {ConsentManagementService.getConsentLabel(
                            consent.consent_type as ConsentType
                          )}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          consent.granted_at || consent.created_at
                        ).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Version:</span>{' '}
                        <span className="font-medium">{consent.version}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">État:</span>{' '}
                        <Badge
                          variant={
                            consent.granted && !consent.revoked_at
                              ? 'default'
                              : 'secondary'
                          }
                          className="ml-2"
                        >
                          {consent.granted && !consent.revoked_at
                            ? 'Accordé'
                            : 'Retiré'}
                        </Badge>
                      </div>
                      {consent.granted_at && (
                        <div>
                          <span className="text-muted-foreground">Accordé le:</span>{' '}
                          <span className="font-medium">
                            {new Date(consent.granted_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      )}
                      {consent.revoked_at && (
                        <div>
                          <span className="text-muted-foreground">Retiré le:</span>{' '}
                          <span className="font-medium">
                            {new Date(consent.revoked_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      )}
                      {consent.ip_address && (
                        <div>
                          <span className="text-muted-foreground">IP:</span>{' '}
                          <span className="font-mono text-xs">{consent.ip_address}</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Legal Footer */}
      <Card className="border-muted">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p>
            ✓ Tous vos consentements sont enregistrés et horodatés conformément au RGPD
          </p>
          <p>
            ✓ Vous pouvez consulter et modifier vos consentements à tout moment
          </p>
          <p>
            ✓ Un historique complet de vos consentements est conservé pour votre traçabilité
          </p>
          <p className="pt-2 border-t">
            Pour toute question concernant vos consentements, contactez-nous à{' '}
            <a href="mailto:contact@emotionscare.com" className="text-primary hover:underline">
              contact@emotionscare.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
