/**
 * HDSCompliancePage - Conformité HDS opérationnelle
 * Module 37 : Hébergement de Données de Santé conforme à la réglementation française
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Shield,
  Lock,
  Server,
  FileCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Globe,
  Key,
  Eye,
  Database,
  Activity,
  FileText,
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'in_progress' | 'planned';
  category: string;
  icon: React.ElementType;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'encryption',
    title: 'Chiffrement des données au repos',
    description: 'AES-256 pour toutes les données de santé stockées. Clés gérées via un HSM dédié.',
    status: 'compliant',
    category: 'Sécurité technique',
    icon: Lock,
  },
  {
    id: 'encryption-transit',
    title: 'Chiffrement des données en transit',
    description: 'TLS 1.3 pour toutes les communications. Certificats renouvelés automatiquement.',
    status: 'compliant',
    category: 'Sécurité technique',
    icon: Key,
  },
  {
    id: 'hosting',
    title: 'Hébergement certifié HDS',
    description: 'Infrastructure hébergée chez un prestataire certifié HDS en France métropolitaine.',
    status: 'in_progress',
    category: 'Infrastructure',
    icon: Server,
  },
  {
    id: 'data-residency',
    title: 'Résidence des données en France',
    description: 'Toutes les données de santé sont stockées exclusivement sur le territoire français.',
    status: 'compliant',
    category: 'Infrastructure',
    icon: Globe,
  },
  {
    id: 'access-control',
    title: 'Contrôle d\'accès et traçabilité',
    description: 'Authentification forte, RBAC et journalisation de tous les accès aux données de santé.',
    status: 'compliant',
    category: 'Gouvernance',
    icon: Eye,
  },
  {
    id: 'rgpd',
    title: 'Conformité RGPD complète',
    description: 'Registre des traitements, DPO désigné, analyses d\'impact (AIPD) réalisées.',
    status: 'compliant',
    category: 'Gouvernance',
    icon: FileCheck,
  },
  {
    id: 'backup',
    title: 'Sauvegardes et plan de reprise',
    description: 'Sauvegardes chiffrées quotidiennes, PRA testé trimestriellement, RPO < 1h.',
    status: 'compliant',
    category: 'Continuité',
    icon: Database,
  },
  {
    id: 'audit',
    title: 'Audit de sécurité annuel',
    description: 'Tests d\'intrusion, audit de code et revue des pratiques par un tiers indépendant.',
    status: 'in_progress',
    category: 'Audit',
    icon: Activity,
  },
  {
    id: 'incident',
    title: 'Procédure de gestion des incidents',
    description: 'Processus documenté de détection, notification CNIL sous 72h et communication aux personnes concernées.',
    status: 'compliant',
    category: 'Gouvernance',
    icon: AlertTriangle,
  },
  {
    id: 'certification',
    title: 'Certification HDS officielle',
    description: 'Obtention de la certification HDS par un organisme accrédité COFRAC.',
    status: 'planned',
    category: 'Certification',
    icon: Shield,
  },
];

const STATUS_CONFIG = {
  compliant: { label: 'Conforme', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  in_progress: { label: 'En cours', color: 'bg-amber-500', textColor: 'text-amber-600' },
  planned: { label: 'Planifié', color: 'bg-blue-500', textColor: 'text-blue-600' },
};

export default function HDSCompliancePage() {
  usePageSEO({
    title: 'Conformité HDS - Hébergement Données de Santé | EmotionsCare',
    description: 'EmotionsCare respecte les exigences HDS pour l\'hébergement des données de santé. Chiffrement, résidence France, traçabilité et audit de sécurité.',
    keywords: 'HDS, hébergement données santé, conformité, RGPD, chiffrement, sécurité, certification',
  });

  const compliantCount = COMPLIANCE_ITEMS.filter(i => i.status === 'compliant').length;
  const inProgressCount = COMPLIANCE_ITEMS.filter(i => i.status === 'in_progress').length;
  const plannedCount = COMPLIANCE_ITEMS.filter(i => i.status === 'planned').length;
  const overallProgress = Math.round((compliantCount / COMPLIANCE_ITEMS.length) * 100);

  const categories = [...new Set(COMPLIANCE_ITEMS.map(i => i.category))];

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Back */}
          <Link to="/app/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <Badge variant="outline" className="gap-1 mb-4">
              <Shield className="h-3 w-3" />
              Données de santé
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Conformité HDS opérationnelle
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              EmotionsCare s'engage à respecter les exigences les plus strictes en matière d'hébergement de données de santé. Voici l'état de notre conformité.
            </p>
          </div>

          {/* Global Progress */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="font-semibold text-lg">Progression globale</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-primary">{overallProgress}%</span>
                    <span className="text-muted-foreground text-sm mb-1">de conformité atteinte</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm">{compliantCount} conformes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm">{inProgressCount} en cours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">{plannedCount} planifiés</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Dernière revue :<br />Février 2026</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Items by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="space-y-3">
                {COMPLIANCE_ITEMS.filter(i => i.category === category).map((item) => {
                  const config = STATUS_CONFIG[item.status];
                  return (
                    <Card key={item.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <item.icon className={`h-5 w-5 ${config.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">{item.title}</h3>
                            <Badge className={`${config.color} text-xs`}>{config.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        {item.status === 'compliant' && (
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        )}
                        {item.status === 'in_progress' && (
                          <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Footer Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Documentation de conformité</p>
                  <p className="text-sm text-muted-foreground">
                    Pour obtenir notre dossier de conformité complet (politique de sécurité, registre des traitements, AIPD),
                    veuillez nous contacter. Ces documents sont mis à disposition des établissements dans le cadre de leurs obligations réglementaires.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/legal/privacy">
                    <Lock className="h-4 w-4 mr-1" />
                    Politique de confidentialité
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/contact">
                    <FileCheck className="h-4 w-4 mr-1" />
                    Demander le dossier HDS
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageRoot>
  );
}
