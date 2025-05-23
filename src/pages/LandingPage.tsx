
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Briefcase, 
  Building, 
  ArrowRight, 
  Heart, 
  Music, 
  Users,
  FileText,
  Shield
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();

  // Si l'utilisateur a déjà un mode défini, proposer de l'y rediriger directement
  const hasExistingMode = !!userMode;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            EmotionsCare
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analysez et comprenez vos émotions pour améliorer votre bien-être et celui de votre équipe
          </p>

          {/* CTA principal */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/choose-mode')}
              className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8"
              size="lg"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {hasExistingMode && (
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline" 
                className="text-lg py-6 px-8"
                size="lg"
              >
                Accéder à mon espace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </header>

        {/* Cards principales */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* B2C Card */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Particuliers</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Analysez vos émotions personnelles et recevez des conseils adaptés pour votre bien-être
              </p>
              <div className="mt-auto space-y-3 w-full">
                <Button 
                  onClick={() => {
                    navigate('/choose-mode');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Accéder à l'espace personnel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* B2B User Card */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Collaborateurs</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Suivez votre bien-être au travail et contribuez à l'amélioration de l'environnement professionnel
              </p>
              <div className="mt-auto space-y-3 w-full">
                <Button 
                  onClick={() => navigate('/b2b/selection')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Accéder à l'espace collaborateur
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* B2B Admin Card */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Administrateurs</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Gérez les utilisateurs, analysez les données et pilotez le bien-être de votre organisation
              </p>
              <div className="mt-auto space-y-3 w-full">
                <Button 
                  onClick={() => navigate('/b2b/selection')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Accéder à l'administration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section fonctionnalités */}
        <section className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Heart className="h-10 w-10 text-red-500" />} 
              title="Analyse émotionnelle"
              description="Analysez vos émotions par texte, voix ou emojis et recevez des conseils personnalisés" 
            />
            <FeatureCard 
              icon={<Music className="h-10 w-10 text-blue-500" />} 
              title="Musicothérapie"
              description="Écoutez des musiques générées par IA adaptées à votre état émotionnel" 
            />
            <FeatureCard 
              icon={<FileText className="h-10 w-10 text-green-500" />} 
              title="Journal émotionnel"
              description="Suivez l'évolution de votre bien-être et identifiez les tendances" 
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-purple-500" />} 
              title="Espace social"
              description="Partagez votre expérience et connectez-vous avec d'autres utilisateurs" 
            />
            <FeatureCard 
              icon={<Brain className="h-10 w-10 text-amber-500" />} 
              title="Coach IA"
              description="Obtenez des conseils personnalisés adaptés à votre profil émotionnel" 
            />
            <FeatureCard 
              icon={<Building className="h-10 w-10 text-indigo-500" />} 
              title="Solution entreprise"
              description="Pilotez le bien-être au sein de votre organisation" 
            />
          </div>
        </section>

        {/* Footer section */}
        <footer className="mt-24 text-center text-gray-500 dark:text-gray-400 border-t pt-8">
          <p>© 2025 EmotionsCare - Tous droits réservés</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Button variant="link" onClick={() => navigate('/about')}>À propos</Button>
            <Button variant="link" onClick={() => navigate('/contact')}>Contact</Button>
            <Button variant="link" onClick={() => navigate('/privacy')}>Confidentialité</Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Composant pour cartes de fonctionnalités
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;
