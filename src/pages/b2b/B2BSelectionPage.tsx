
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Shield, 
  ArrowRight,
  Star,
  Check,
  Crown,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-testid="page-root">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Espace Entreprise
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez votre mode d'accès à la plateforme EmotionsCare for Business
          </p>
        </div>

        {/* Options d'accès */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Accès Collaborateur */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 transform rotate-12 translate-x-6 -translate-y-6"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Collaborateur</CardTitle>
                  <Badge variant="secondary" className="mt-1">Accès Standard</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-lg">
                Accédez à vos outils de bien-être émotionnel fournis par votre entreprise
              </p>
              
              <div className="space-y-3">
                {[
                  'Scan émotionnel quotidien',
                  'Séances de méditation guidée', 
                  'Musiques thérapeutiques',
                  'Coach virtuel personnalisé',
                  'Journal émotionnel privé'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Accès sécurisé</span>
                </div>
                <p className="text-sm text-blue-700">
                  Vos données restent privées et sont protégées selon les standards RGPD
                </p>
              </div>

              <Link to="/b2b/user/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  <Users className="h-5 w-5 mr-2" />
                  Accès Collaborateur
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accès Admin/RH */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50">
            <div className="absolute top-0 right-0">
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Premium
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Administrateur RH</CardTitle>
                  <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0 mt-1">
                    Accès Complet
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-lg">
                Gérez le bien-être de vos équipes avec des outils d'analyse avancés
              </p>
              
              <div className="space-y-3">
                {[
                  'Dashboard analytique complet',
                  'Gestion des équipes et permissions',
                  'Rapports de bien-être organisationnel',
                  'Outils de prévention et d\'intervention',
                  'Export de données et métriques'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Conformité garantie</span>
                </div>
                <p className="text-sm text-purple-700">
                  Respect total de la confidentialité avec agrégation anonymisée des données
                </p>
              </div>

              <Link to="/b2b/admin/login">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6">
                  <Shield className="h-5 w-5 mr-2" />
                  Accès Administrateur
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Pourquoi choisir EmotionsCare for Business ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Sécurité maximale</h3>
                <p className="text-gray-600 text-sm">Données cryptées et conformité RGPD garantie</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Impact collectif</h3>
                <p className="text-gray-600 text-sm">Amélioration du bien-être de toute l'organisation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Résultats mesurables</h3>
                <p className="text-gray-600 text-sm">Analytics et KPIs pour suivre les progrès</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
