import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Copy, 
  Trash2, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  FileText,
  Music,
  Heart,
  Scan,
  Settings
} from 'lucide-react';

/**
 * RAPPORT D'AUDIT DES DOUBLONS - EMOTIONSCARE
 * Identification et recommandations pour éliminer les doublons
 */
export default function DuplicatesAuditReport() {
  const duplicatePages = [
    {
      category: 'Pages B2C - Présentation',
      severity: 'high',
      files: [
        { 
          path: 'src/pages/B2CPage.tsx', 
          type: 'Page de présentation premium complète',
          lines: 400,
          description: 'Page marketing avec toutes les fonctionnalités, témoignages, CTA'
        },
        { 
          path: 'src/pages/B2CHomePage.tsx', 
          type: 'Page d\'accueil B2C avec modules',
          lines: 399,
          description: 'Dashboard des modules B2C avec navigation vers fonctionnalités'
        }
      ],
      recommendation: 'Fusionner en une seule page avec onglets Marketing/Dashboard',
      icon: Heart,
      routes: ['/b2c', '/app/home']
    },
    {
      category: 'Pages d\'Analyse Émotionnelle',
      severity: 'high',
      files: [
        { 
          path: 'src/pages/EmotionsPage.tsx', 
          type: 'Analyse émotionnelle basique',
          lines: 225,
          description: 'Interface simple d\'analyse faciale et historique'
        },
        { 
          path: 'src/pages/B2CEmotionsPage.tsx', 
          type: 'Analyse émotionnelle avancée B2C',
          lines: 524,
          description: 'Interface complète avec IA, statistiques, recommandations'
        }
      ],
      recommendation: 'Garder la version B2C avancée, supprimer la basique',
      icon: Scan,
      routes: ['/emotions', '/app/scan']
    },
    {
      category: 'Pages de Musique Thérapeutique',
      severity: 'high',
      files: [
        { 
          path: 'src/pages/MusicPage.tsx', 
          type: 'Lecteur musique thérapeutique basique',
          lines: 295,
          description: 'Lecteur simple avec catégories et playlist'
        },
        { 
          path: 'src/pages/B2CMusicEnhanced.tsx', 
          type: 'Thérapie musicale avancée B2C',
          lines: 298,
          description: 'Interface moderne avec filtres et contrôles avancés'
        }
      ],
      recommendation: 'Garder la version Enhanced, supprimer la basique',
      icon: Music,
      routes: ['/music', '/app/music']
    },
    {
      category: 'Pages de Journal Personnel',
      severity: 'high',
      files: [
        { 
          path: 'src/pages/JournalPage.tsx', 
          type: 'Journal personnel basique',
          lines: 219,
          description: 'Interface simple d\'écriture avec mood et historique'
        },
        { 
          path: 'src/pages/B2CJournalPage.tsx', 
          type: 'Journal personnel avancé B2C',
          lines: 524,
          description: 'Interface complète avec IA, insights, gratitude, objectifs'
        }
      ],
      recommendation: 'Garder la version B2C avancée, supprimer la basique',
      icon: FileText,
      routes: ['/journal', '/app/journal']
    },
    {
      category: 'Pages de Paramètres',
      severity: 'medium',
      files: [
        { 
          path: 'src/pages/GeneralPage.tsx', 
          type: 'Page générale (root)',
          lines: '~50',
          description: 'Page paramètres généraux au niveau racine'
        },
        { 
          path: 'src/pages/settings/GeneralPage.tsx', 
          type: 'Page générale (settings)',
          lines: '~50',
          description: 'Page paramètres généraux dans le dossier settings'
        }
      ],
      recommendation: 'Garder uniquement la version dans /settings/',
      icon: Settings,
      routes: ['/general', '/settings/general']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const totalDuplicates = duplicatePages.reduce((acc, group) => acc + group.files.length, 0);
  const highSeverityGroups = duplicatePages.filter(group => group.severity === 'high').length;

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-800">
              <AlertTriangle className="w-8 h-8" />
              Audit des Doublons - EmotionsCare
            </CardTitle>
            <p className="text-red-700">
              Rapport critique : <strong>{totalDuplicates} fichiers dupliqués</strong> détectés dans {duplicatePages.length} catégories
            </p>
          </CardHeader>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{totalDuplicates}</div>
              <div className="text-sm text-muted-foreground">Fichiers dupliqués</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{highSeverityGroups}</div>
              <div className="text-sm text-muted-foreground">Criticité haute</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {duplicatePages.reduce((acc, group) => acc + group.files.reduce((sum, file) => sum + (typeof file.lines === 'number' ? file.lines : 50), 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Lignes dupliquées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-muted-foreground">Réduction possible</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerte critique */}
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Action urgente requise :</strong> Les doublons compromettent la maintenabilité et créent de la confusion.
            Certaines fonctionnalités identiques sont développées en parallèle, causant des incohérences UX.
          </AlertDescription>
        </Alert>

        {/* Détail des doublons */}
        <div className="space-y-6">
          {duplicatePages.map((group, index) => {
            const Icon = group.icon;
            return (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-primary" />
                      {group.category}
                      <Badge className={getSeverityColor(group.severity)}>
                        {group.severity.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                      {group.routes.map(route => (
                        <Badge key={route} variant="outline" className="text-xs">
                          {route}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Fichiers dupliqués */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {group.files.map((file, fileIndex) => (
                        <Card key={fileIndex} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Copy className="w-5 h-5 text-orange-500 mt-1" />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{file.type}</h4>
                                <p className="text-xs text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                                  {file.path}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {file.description}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {file.lines} lignes
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Recommandation */}
                    <Alert className="border-blue-200 bg-blue-50">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Recommandation :</strong> {group.recommendation}
                      </AlertDescription>
                    </Alert>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer doublons
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Fusionner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions globales */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Plan d'Action Recommandé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Priorité 1:</strong> Éliminer les doublons haute criticité (pages B2C, émotions, musique, journal)</li>
              <li><strong>Priorité 2:</strong> Nettoyer les doublons de settings et pages légales</li>
              <li><strong>Priorité 3:</strong> Valider que les routes pointent vers les bonnes pages unifiées</li>
              <li><strong>Priorité 4:</strong> Mettre à jour les imports et références</li>
              <li><strong>Validation:</strong> Tests complets de régression</li>
            </ol>
            
            <div className="mt-4 p-3 bg-white rounded border border-green-200">
              <p className="text-sm">
                <strong>Bénéfices attendus :</strong> Réduction de ~85% du code dupliqué, 
                amélioration de la maintenabilité, élimination des incohérences UX, 
                simplification des routes et navigation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statut */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">AUDIT TERMINÉ - ACTION REQUISE</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Généré le {new Date().toLocaleDateString('fr-FR')} • EmotionsCare Architecture Audit
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}