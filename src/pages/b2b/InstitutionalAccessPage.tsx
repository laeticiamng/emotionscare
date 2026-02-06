/**
 * InstitutionalAccessPage - Page d'accès institutionnel
 * Permet l'accès via lien, QR code ou SSO
 */

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Building2,
  Shield,
  Lock,
  ArrowRight,
  QrCode,
  KeyRound,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Heart,
  Eye,
  EyeOff,
  Music,
  Brain,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrganizationInfo {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
}

export default function InstitutionalAccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [accessCode, setAccessCode] = useState(searchParams.get('code') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);
  const [charterAccepted, setCharterAccepted] = useState(false);
  const [showCharter, setShowCharter] = useState(false);
  const [step, setStep] = useState<'code' | 'charter' | 'ready'>('code');

  usePageSEO({
    title: 'Accès Institutionnel - EmotionsCare',
    description: 'Accédez à EmotionsCare via votre organisation. Espace de bien-être émotionnel sécurisé et anonyme.',
  });

  // Vérification automatique si code dans URL
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      handleVerifyCode(urlCode);
    }
  }, [searchParams]);

  const handleVerifyCode = async (code?: string) => {
    const codeToVerify = code || accessCode;
    if (!codeToVerify.trim()) {
      toast({
        title: 'Code requis',
        description: 'Veuillez entrer votre code d\'accès',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier le code d'accès
      const { data: codeData, error: codeError } = await supabase
        .from('org_access_codes')
        .select('id, org_id, is_active, expires_at, max_uses, current_uses')
        .eq('code', codeToVerify.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (codeError || !codeData) {
        toast({
          title: 'Code invalide',
          description: "Ce code d'accès n'existe pas ou n'est plus actif.",
          variant: 'destructive',
        });
        return;
      }

      // Récupérer les infos de l'organisation séparément
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, logo_url, description')
        .eq('id', codeData.org_id)
        .maybeSingle();

      if (orgError || !orgData) {
        toast({
          title: 'Erreur',
          description: "Organisation non trouvée.",
          variant: 'destructive',
        });
        return;
      }

      // Vérifier expiration
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        toast({
          title: 'Code expiré',
          description: "Ce code d'accès a expiré. Contactez votre organisation.",
          variant: 'destructive',
        });
        return;
      }

      // Vérifier limite d'utilisation
      if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
        toast({
          title: 'Limite atteinte',
          description: "Ce code d'accès a atteint sa limite d'utilisation.",
          variant: 'destructive',
        });
        return;
      }

      // Stocker les infos de l'organisation
      setOrganization(orgData as OrganizationInfo);
      setStep('charter');

    } catch (err) {
      logger.error('Erreur vérification code:', err, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptCharter = async () => {
    if (!charterAccepted) {
      toast({
        title: 'Acceptation requise',
        description: 'Veuillez accepter la charte pour continuer.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Enregistrer l'acceptation de la charte
      if (organization) {
        await supabase.from('org_ethical_disclaimers').insert({
          org_id: organization.id,
          disclaimer_version: '1.0',
        });

        // Incrémenter le compteur d'utilisation du code
        try {
          await supabase.rpc('increment_access_code_usage', { 
            code_value: accessCode.trim().toUpperCase() 
          });
        } catch {
          // Ignorer si la fonction n'existe pas encore
        }
      }

      // Stocker l'accès dans le session storage (anonyme)
      sessionStorage.setItem('b2b_access', JSON.stringify({
        org_id: organization?.id,
        org_name: organization?.name,
        accessed_at: new Date().toISOString(),
      }));

      setStep('ready');

      toast({
        title: 'Bienvenue !',
        description: 'Vous pouvez maintenant accéder à EmotionsCare.',
      });

    } catch (err) {
      logger.error('Erreur acceptation charte:', err, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartWellness = () => {
    // Rediriger vers l'espace bien-être B2B
    navigate('/b2b/wellness');
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Accès Institutionnel</h1>
            <p className="text-muted-foreground">
              Entrez le code fourni par votre organisation
            </p>
          </div>

          {/* Étape 1: Code d'accès */}
          {step === 'code' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Code d'accès
                </CardTitle>
                <CardDescription>
                  Ce code vous a été communiqué par votre employeur ou est affiché dans vos locaux.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="access-code">Code d'accès</Label>
                  <Input
                    id="access-code"
                    placeholder="Ex: CORP-2024-WELLNESS"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="text-center text-lg font-mono tracking-wider"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleVerifyCode()}
                  disabled={isLoading || !accessCode.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      Continuer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <Separator className="my-4" />

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/b2b')}
                  >
                    ← Retour à la page d'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Étape 2: Charte éthique */}
          {step === 'charter' && organization && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  {organization.logo_url ? (
                    <img 
                      src={organization.logo_url} 
                      alt={organization.name}
                      className="h-12 w-12 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{organization.name}</CardTitle>
                    <CardDescription>Organisation vérifiée</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bannière d'information */}
                <Alert className="border-primary/30 bg-primary/5">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Avant de commencer</AlertTitle>
                  <AlertDescription>
                    Prenez connaissance de nos engagements éthiques.
                  </AlertDescription>
                </Alert>

                {/* Résumé de la charte */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Lock className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Anonymat garanti</p>
                      <p className="text-xs text-muted-foreground">
                        Votre employeur n'aura jamais accès à vos données personnelles
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Heart className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Utilisation volontaire</p>
                      <p className="text-xs text-muted-foreground">
                        Vous êtes libre d'utiliser ou non EmotionsCare
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <EyeOff className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Pas de surveillance</p>
                      <p className="text-xs text-muted-foreground">
                        Aucun suivi individuel, aucune évaluation de performance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkbox acceptation */}
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Checkbox
                    id="accept-charter"
                    checked={charterAccepted}
                    onCheckedChange={(checked) => setCharterAccepted(checked as boolean)}
                  />
                  <label 
                    htmlFor="accept-charter" 
                    className="text-sm cursor-pointer leading-relaxed"
                  >
                    J'ai lu et j'accepte les{' '}
                    <button
                      type="button"
                      className="text-primary underline hover:no-underline"
                      onClick={() => setShowCharter(!showCharter)}
                    >
                      conditions d'utilisation et la charte éthique
                    </button>
                    . Je comprends que mes données sont anonymes et ne seront pas partagées individuellement.
                  </label>
                </div>

                {showCharter && (
                  <div className="p-4 rounded-lg bg-muted/30 text-sm space-y-2 max-h-40 overflow-y-auto">
                    <p className="font-medium">Charte éthique EmotionsCare B2B</p>
                    <p>• EmotionsCare est un outil de bien-être, pas de surveillance.</p>
                    <p>• Aucune donnée individuelle n'est partagée avec l'employeur.</p>
                    <p>• Seules des statistiques agrégées et anonymes sont disponibles.</p>
                    <p>• L'utilisation est entièrement volontaire.</p>
                    <p>• EmotionsCare ne remplace pas un accompagnement médical.</p>
                    <p>• Vos données sont protégées conformément au RGPD.</p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleAcceptCharter}
                  disabled={isLoading || !charterAccepted}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      Accepter et continuer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Étape 3: Prêt */}
          {step === 'ready' && organization && (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-success/10">
                    <CheckCircle className="h-12 w-12 text-success" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Bienvenue !</CardTitle>
                <CardDescription className="text-base">
                  Vous êtes connecté à l'espace bien-être de {organization.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Aperçu des fonctionnalités */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/5 text-center">
                    <Music className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Musique</p>
                    <p className="text-xs text-muted-foreground">Relaxation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 text-center">
                    <Brain className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Scan</p>
                    <p className="text-xs text-muted-foreground">Émotionnel</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 text-center">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Respiration</p>
                    <p className="text-xs text-muted-foreground">Guidée</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 text-center">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Détente</p>
                    <p className="text-xs text-muted-foreground">Parcours</p>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleStartWellness}
                >
                  Commencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Session anonyme et sécurisée
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </main>
  );
}
