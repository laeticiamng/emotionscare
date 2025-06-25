
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare2, Square, User, Building2, Shield } from 'lucide-react';

interface TestAccount {
  type: 'B2C' | 'B2B User' | 'B2B Admin';
  email: string;
  features: string[];
  criticalPaths: string[];
  icon: React.ReactNode;
  color: string;
}

const AccountValidation: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const testAccounts: TestAccount[] = [
    {
      type: 'B2C',
      email: 'test-b2c@example.com',
      icon: <User className="h-5 w-5" />,
      color: 'bg-blue-500',
      features: [
        'Inscription et confirmation email',
        'Scan émotionnel (vocal + texte)',
        'Journal personnel avec analyse IA',
        'Coach IA personnalisé',
        'Musique thérapeutique',
        'Gamification (points, badges)',
        'Profil et préférences',
        'VR Galactique',
        'Social Cocon',
        'Déconnexion sécurisée'
      ],
      criticalPaths: [
        'Processus d\'inscription complet',
        'Premier scan émotionnel',
        'Première entrée de journal',
        'Interaction avec le coach IA',
        'Navigation entre toutes les sections'
      ]
    },
    {
      type: 'B2B User',
      email: 'collaborateur@entreprise.com',
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-green-500',
      features: [
        'Inscription collaborateur',
        'Dashboard équipe',
        'Scan émotionnel partagé',
        'Journal collaboratif',
        'Coach IA business',
        'Musique en équipe',
        'Social Cocon entreprise',
        'Métriques personnelles',
        'Activités d\'équipe',
        'Micro-pauses'
      ],
      criticalPaths: [
        'Inscription via invitation',
        'Accès aux fonctionnalités d\'équipe',
        'Partage sécurisé des données',
        'Interaction avec les collègues',
        'Respect de la confidentialité'
      ]
    },
    {
      type: 'B2B Admin',
      email: 'rh@entreprise.com',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-purple-500',
      features: [
        'Dashboard administrateur RH',
        'Gestion des invitations',
        'Rapports et métriques d\'équipe',
        'Monitoring du bien-être',
        'Gestion des événements',
        'Optimisation organisationnelle',
        'Paramètres de sécurité',
        'Export de données',
        'Tableau de bord exécutif',
        'Audit des activités'
      ],
      criticalPaths: [
        'Accès aux données sensibles',
        'Génération de rapports',
        'Gestion des utilisateurs',
        'Configuration des politiques',
        'Monitoring en temps réel'
      ]
    }
  ];

  const toggleCheck = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCompletionRate = (accountType: string) => {
    const account = testAccounts.find(acc => acc.type === accountType);
    if (!account) return 0;
    
    const totalItems = account.features.length + account.criticalPaths.length;
    const checkedCount = [...account.features, ...account.criticalPaths]
      .filter(item => checkedItems[`${accountType}-${item}`])
      .length;
    
    return Math.round((checkedCount / totalItems) * 100);
  };

  const overallCompletion = Math.round(
    testAccounts.reduce((sum, account) => sum + getCompletionRate(account.type), 0) / 3
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Validation des Comptes de Test
          </CardTitle>
          <p className="text-muted-foreground">
            Vérification manuelle des trois types de comptes pour validation finale
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant={overallCompletion === 100 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {overallCompletion}% Validé
            </Badge>
            {overallCompletion === 100 && (
              <Badge variant="default" className="bg-green-500">
                ✅ PRÊT POUR PRODUCTION
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Comptes de test */}
      {testAccounts.map((account) => {
        const completionRate = getCompletionRate(account.type);
        
        return (
          <Card key={account.type}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${account.color} text-white`}>
                    {account.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">Compte {account.type}</CardTitle>
                    <p className="text-sm text-muted-foreground">{account.email}</p>
                  </div>
                </div>
                <Badge variant={completionRate === 100 ? 'default' : 'secondary'}>
                  {completionRate}% testé
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Fonctionnalités */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">
                  Fonctionnalités à tester ({account.features.length})
                </h4>
                <div className="space-y-2">
                  {account.features.map((feature) => {
                    const key = `${account.type}-${feature}`;
                    const isChecked = checkedItems[key];
                    
                    return (
                      <div 
                        key={feature}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleCheck(key)}
                      >
                        {isChecked ? (
                          <CheckSquare2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={isChecked ? 'line-through text-gray-500' : 'text-gray-900'}>
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chemins critiques */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">
                  Chemins critiques à valider ({account.criticalPaths.length})
                </h4>
                <div className="space-y-2">
                  {account.criticalPaths.map((path) => {
                    const key = `${account.type}-${path}`;
                    const isChecked = checkedItems[key];
                    
                    return (
                      <div 
                        key={path}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-50 cursor-pointer border-l-4 border-yellow-400"
                        onClick={() => toggleCheck(key)}
                      >
                        {isChecked ? (
                          <CheckSquare2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Square className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={isChecked ? 'line-through text-gray-500' : 'text-gray-900 font-medium'}>
                          {path}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Actions finales */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de validation finale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Tests fonctionnels</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Créer les 3 comptes de test</li>
                <li>• Valider les emails de confirmation</li>
                <li>• Tester toutes les fonctionnalités listées</li>
                <li>• Vérifier les permissions par rôle</li>
                <li>• Tester la déconnexion</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Tests de performance</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Temps de chargement des pages</li>
                <li>• Réactivité des interactions</li>
                <li>• Responsive design sur mobile</li>
                <li>• Gestion des erreurs</li>
                <li>• Stabilité des sessions</li>
              </ul>
            </div>
          </div>
          
          {overallCompletion === 100 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckSquare2 className="h-5 w-5" />
                <span className="font-semibold">Validation complète !</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Tous les comptes de test ont été validés. L'application est prête pour de vrais utilisateurs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountValidation;
