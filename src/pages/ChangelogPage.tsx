import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Wrench, 
  Bug, 
  Shield, 
  Sparkles,
  Calendar,
  Tag,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    added?: string[];
    improved?: string[];
    fixed?: string[];
    security?: string[];
  };
  highlights?: string[];
}

const ChangelogPage: React.FC = () => {
  const changelog: ChangelogEntry[] = [
    {
      version: '2.3.0',
      date: '2024-01-15',
      type: 'minor',
      highlights: [
        'Nouvelle interface de musicothérapie adaptive',
        'Amélioration des performances IA de 40%',
        'Mode sombre amélioré'
      ],
      changes: {
        added: [
          'Interface musicothérapie complètement repensée',
          'Nouveau système de recommandations personnalisées',
          'Mode hors-ligne pour le journal personnel',
          'Intégration avec 5 nouveaux fournisseurs de musique',
          'Export PDF des rapports de bien-être'
        ],
        improved: [
          'Temps de chargement réduit de 40% sur mobile',
          'Précision de l\'analyse émotionnelle IA améliorée',
          'Interface utilisateur plus intuitive',
          'Meilleure accessibilité (conformité WCAG 2.1 AA)',
          'Synchronisation en temps réel optimisée'
        ],
        fixed: [
          'Correction du bug de connexion intermittente',
          'Résolution des problèmes de notification push',
          'Correction de l\'affichage sur écrans ultrawide',
          'Fix des doublons dans l\'historique émotionnel'
        ],
        security: [
          'Mise à jour des certificats SSL',
          'Renforcement du chiffrement des données personnelles',
          'Audit de sécurité complet effectué'
        ]
      }
    },
    {
      version: '2.2.1',
      date: '2024-01-08',
      type: 'patch',
      changes: {
        fixed: [
          'Correction critique de la sauvegarde automatique',
          'Résolution du problème de déconnexion automatique',
          'Fix de l\'affichage des graphiques sur Safari'
        ]
      }
    },
    {
      version: '2.2.0',
      date: '2024-01-01',
      type: 'minor',
      highlights: [
        'Nouvel an, nouvelles fonctionnalités !',
        'Coach IA personnalisé avec analyse vocale',
        'Tableau de bord entreprise B2B'
      ],
      changes: {
        added: [
          'Coach IA avec reconnaissance vocale avancée',
          'Dashboard B2B pour la gestion d\'équipe',
          'Module de méditation guidée VR',
          'Système de badges et récompenses gamifiées',
          'API publique pour intégrations tierces'
        ],
        improved: [
          'Algorithme d\'analyse émotionnelle v3.0',
          'Interface mobile native redessinée',
          'Performances de synchronisation cloud',
          'Système de notifications intelligentes'
        ],
        fixed: [
          'Problème de latence lors des pics de trafic',
          'Erreurs de validation dans les formulaires',
          'Bugs d\'affichage en mode sombre'
        ]
      }
    },
    {
      version: '2.1.3',
      date: '2023-12-20',
      type: 'patch',
      changes: {
        fixed: [
          'Correction urgente de la synchronisation des données',
          'Fix de l\'export des rapports mensuels',
          'Résolution des problèmes de performance sur mobile'
        ],
        security: [
          'Patch de sécurité pour les sessions utilisateur'
        ]
      }
    },
    {
      version: '2.1.0',
      date: '2023-12-15',
      type: 'minor',
      highlights: [
        'Lancement de la version Enterprise',
        'Intelligence artificielle émotionnelle révolutionnaire'
      ],
      changes: {
        added: [
          'Version Enterprise avec fonctionnalités avancées',
          'IA émotionnelle de nouvelle génération',
          'Analyses prédictives de bien-être',
          'Intégration Slack pour les équipes',
          'Rapports d\'analyse d\'équipe en temps réel'
        ],
        improved: [
          'Interface administrateur repensée',
          'Vitesse de l\'application augmentée de 60%',
          'Précision des recommandations musicales',
          'Qualité audio en streaming haute définition'
        ]
      }
    },
    {
      version: '2.0.0',
      date: '2023-12-01',
      type: 'major',
      highlights: [
        'Refonte complète de l\'interface utilisateur',
        'Architecture technique nouvelle génération',
        'Conformité RGPD renforcée'
      ],
      changes: {
        added: [
          'Interface utilisateur complètement redessinée',
          'Architecture microservices pour une meilleure scalabilité',
          'Module de réalité virtuelle immersive',
          'Système de notifications push intelligent',
          'Mode collaboratif pour les thérapies de groupe'
        ],
        improved: [
          'Performance générale de l\'application',
          'Sécurité et confidentialité des données',
          'Expérience utilisateur mobile',
          'Temps de réponse de l\'IA divisé par 3'
        ],
        fixed: [
          'Plus de 50 bugs mineurs corrigés',
          'Stabilité générale de l\'application',
          'Problèmes de compatibilité navigateurs'
        ]
      }
    }
  ];

  const getTypeIcon = (type: 'major' | 'minor' | 'patch') => {
    switch (type) {
      case 'major':
        return <Sparkles className="h-4 w-4" />;
      case 'minor':
        return <Plus className="h-4 w-4" />;
      case 'patch':
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: 'major' | 'minor' | 'patch') => {
    switch (type) {
      case 'major':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Majeure</Badge>;
      case 'minor':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Mineure</Badge>;
      case 'patch':
        return <Badge className="bg-green-500 hover:bg-green-600">Correctif</Badge>;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'added':
        return <Plus className="h-3 w-3 text-green-500" />;
      case 'improved':
        return <ArrowRight className="h-3 w-3 text-blue-500" />;
      case 'fixed':
        return <Bug className="h-3 w-3 text-orange-500" />;
      case 'security':
        return <Shield className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeTitle = (changeType: string) => {
    switch (changeType) {
      case 'added':
        return 'Nouveautés';
      case 'improved':
        return 'Améliorations';
      case 'fixed':
        return 'Corrections';
      case 'security':
        return 'Sécurité';
      default:
        return changeType;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Notes de Version
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez toutes les nouveautés, améliorations et corrections apportées à EmotionsCare. 
            Nous nous engageons à améliorer continuellement votre expérience.
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Badge variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Version actuelle : 2.3.0
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              Dernière mise à jour : 15 jan 2024
            </Badge>
          </div>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {changelog.map((entry, entryIndex) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: entryIndex * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(entry.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <span>Version {entry.version}</span>
                          {getTypeBadge(entry.type)}
                        </div>
                        <div className="text-sm text-muted-foreground font-normal mt-1">
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                  
                  {entry.highlights && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">✨ Points forts de cette version :</h4>
                      <ul className="space-y-1">
                        {entry.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6">
                    {Object.entries(entry.changes).map(([changeType, changes]) => (
                      changes && changes.length > 0 && (
                        <div key={changeType}>
                          <h4 className="flex items-center gap-2 font-medium mb-3">
                            {getChangeIcon(changeType)}
                            {getChangeTitle(changeType)}
                            <Badge variant="secondary" className="text-xs">
                              {changes.length}
                            </Badge>
                          </h4>
                          <ul className="space-y-2 ml-5">
                            {changes.map((change, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-4">
                Restez informé des nouveautés
              </h3>
              <p className="text-muted-foreground mb-6">
                Abonnez-vous à notre newsletter pour être notifié en priorité des nouvelles fonctionnalités 
                et améliorations d'EmotionsCare.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Newsletter
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                  Suivre sur GitHub
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChangelogPage;