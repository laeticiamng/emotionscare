import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  User,
  Settings,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessRule {
  path: string;
  name: string;
  requiredRoles: string[];
  description: string;
  category: 'core' | 'tools' | 'admin' | 'social';
}

const accessRules: AccessRule[] = [
  // Core functionality
  { path: '/scan', name: 'Scan Émotionnel', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Analyse émotionnelle instantanée', category: 'core' },
  { path: '/journal', name: 'Journal Personnel', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Espace de réflexion quotidien', category: 'core' },
  { path: '/coach', name: 'Coach IA', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Accompagnement par intelligence artificielle', category: 'core' },
  { path: '/preferences', name: 'Préférences', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Configuration personnelle', category: 'core' },
  
  // Therapeutic tools
  { path: '/music', name: 'Musicothérapie', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Sons et musiques thérapeutiques', category: 'tools' },
  { path: '/vr', name: 'Réalité Virtuelle', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Expériences immersives relaxantes', category: 'tools' },
  { path: '/gamification', name: 'Gamification', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Défis et récompenses motivantes', category: 'tools' },
  
  // Social features
  { path: '/social-cocon', name: 'Cocon Social', requiredRoles: ['b2c', 'b2b_user', 'b2b_admin'], description: 'Communauté bienveillante', category: 'social' },
  
  // Admin features
  { path: '/teams', name: 'Gestion Équipes', requiredRoles: ['b2b_admin'], description: 'Management des collaborateurs', category: 'admin' },
  { path: '/reports', name: 'Rapports Analytics', requiredRoles: ['b2b_admin'], description: 'Analyses et métriques détaillées', category: 'admin' },
  { path: '/events', name: 'Événements RH', requiredRoles: ['b2b_admin'], description: 'Planification et suivi événements', category: 'admin' },
  { path: '/optimisation', name: 'Optimisation', requiredRoles: ['b2b_admin'], description: 'Outils d\'optimisation avancés', category: 'admin' },
  { path: '/settings', name: 'Paramètres Admin', requiredRoles: ['b2b_admin'], description: 'Configuration système', category: 'admin' }
];

const AccessVerifier: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  
  const currentRole = user?.role || userMode || 'guest';
  
  const getAccessStatus = (rule: AccessRule) => {
    if (!isAuthenticated) return 'denied';
    return rule.requiredRoles.includes(currentRole) ? 'granted' : 'denied';
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <User className="h-4 w-4" />;
      case 'tools': return <Zap className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'social': return <Settings className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core': return 'Fonctionnalités Principales';
      case 'tools': return 'Outils Thérapeutiques';
      case 'admin': return 'Administration';
      case 'social': return 'Social & Communauté';
      default: return 'Autres';
    }
  };
  
  const groupedRules = accessRules.reduce((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = [];
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, AccessRule[]>);
  
  const accessSummary = {
    total: accessRules.length,
    granted: accessRules.filter(rule => getAccessStatus(rule) === 'granted').length,
    denied: accessRules.filter(rule => getAccessStatus(rule) === 'denied').length
  };
  
  return (
    <div className="space-y-6">
      {/* Header with current user status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vérification d'Accès EmotionsCare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{accessSummary.granted}</div>
              <div className="text-sm text-muted-foreground">Pages Accessibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{accessSummary.denied}</div>
              <div className="text-sm text-muted-foreground">Pages Restreintes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{accessSummary.total}</div>
              <div className="text-sm text-muted-foreground">Total Pages</div>
            </div>
          </div>
          
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              Connecté en tant que: <strong>{currentRole === 'b2c' ? 'Particulier' : currentRole === 'b2b_user' ? 'Collaborateur' : currentRole === 'b2b_admin' ? 'Administrateur RH' : 'Invité'}</strong>
              {!isAuthenticated && ' - Certaines fonctionnalités nécessitent une connexion'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      {/* Access details by category */}
      {Object.entries(groupedRules).map(([category, rules]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {getCategoryTitle(category)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rules.map((rule) => {
                const status = getAccessStatus(rule);
                const isAccessible = status === 'granted';
                
                return (
                  <div 
                    key={rule.path}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {isAccessible ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="flex gap-1 mt-1">
                            {rule.requiredRoles.map(role => (
                              <Badge 
                                key={role} 
                                variant={role === currentRole ? "default" : "outline"}
                                className="text-xs"
                              >
                                {role === 'b2c' ? 'Particulier' : 
                                 role === 'b2b_user' ? 'Collaborateur' : 
                                 'Admin RH'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={isAccessible ? "default" : "destructive"}>
                        {isAccessible ? "Accessible" : "Restreint"}
                      </Badge>
                      {isAccessible && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(rule.path)}
                        >
                          Accéder
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Upgrade suggestions */}
      {currentRole !== 'b2b_admin' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Débloquer Plus de Fonctionnalités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              {currentRole === 'b2c' 
                ? 'Passez en mode B2B pour accéder aux fonctionnalités d\'équipe et de gestion.'
                : 'Contactez votre administrateur pour obtenir des permissions étendues.'
              }
            </p>
            {currentRole === 'b2c' && (
              <Button variant="outline" onClick={() => navigate('/choose-mode')}>
                Changer de Mode
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessVerifier;
