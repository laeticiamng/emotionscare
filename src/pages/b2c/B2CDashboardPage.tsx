
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Music, MessageCircle, BookOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const modules = [
    {
      id: 'scan',
      title: 'Scan Émotionnel',
      description: 'Analysez votre état émotionnel',
      icon: Heart,
      buttonText: 'Démarrer',
      buttonColor: 'bg-pink-500 hover:bg-pink-600',
      path: '/emotions',
      action: () => navigate('/emotions')
    },
    {
      id: 'music',
      title: 'Musicothérapie',
      description: 'Musique adaptée à votre humeur',
      icon: Music,
      buttonText: 'Écouter',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      path: '/music',
      action: () => navigate('/music')
    },
    {
      id: 'coach',
      title: 'Coach Virtuel',
      description: 'Assistance personnalisée 24h/24',
      icon: MessageCircle,
      buttonText: 'Discuter',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      path: '/coach',
      action: () => navigate('/coach')
    },
    {
      id: 'journal',
      title: 'Journal Émotionnel',
      description: 'Suivez votre évolution quotidienne',
      icon: BookOpen,
      buttonText: 'Ouvrir',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      path: '/journal',
      action: () => navigate('/journal')
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Personnalisez votre expérience',
      icon: Settings,
      buttonText: 'Configurer',
      buttonColor: 'bg-gray-500 hover:bg-gray-600',
      path: '/settings',
      action: () => navigate('/settings')
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Particulier</h1>
            <p className="text-gray-600 mt-2">Bienvenue</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gray-100">
                    <module.icon className="h-8 w-8 text-gray-700" />
                  </div>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={module.action}
                  className={`w-full text-white ${module.buttonColor}`}
                >
                  {module.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats or Welcome Message */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Bienvenue sur EmotionsCare</CardTitle>
            <CardDescription>
              Votre plateforme de bien-être émotionnel personnalisée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Explorez nos différents modules pour améliorer votre bien-être quotidien.
              Chaque outil est conçu pour vous accompagner dans votre parcours de développement personnel.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
