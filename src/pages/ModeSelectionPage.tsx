import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, User, Sparkles } from 'lucide-react';

/**
 * Page de sélection du mode: Entreprise (B2B) ou Particulier (B2C)
 */
const ModeSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Bienvenue ! Choisissez votre mode d'accès
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* B2B Card */}
          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary cursor-pointer group">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Je suis Entreprise</h2>
                <p className="text-muted-foreground">
                  Accédez à votre espace RH ou collaborateur
                </p>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Tableau de bord RH avec analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Gestion des équipes et bien-être collectif
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Rapports agrégés avec k-anonymat
                </li>
              </ul>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/auth/login?mode=b2b')}
              >
                Accéder à l'espace Entreprise
              </Button>
            </div>
          </Card>

          {/* B2C Card */}
          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-secondary cursor-pointer group">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="p-4 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <User className="h-12 w-12 text-secondary" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Je suis Particulier</h2>
                <p className="text-muted-foreground">
                  Découvrez votre espace de bien-être personnel
                </p>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Suivi de vos humeurs et émotions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Musicothérapie personnalisée
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Expériences immersives VR & relaxation
                </li>
              </ul>

              <Button 
                className="w-full" 
                size="lg"
                variant="secondary"
                onClick={() => navigate('/auth/login?mode=b2c')}
              >
                Accéder à l'espace Particulier
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Première visite ?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => navigate('/auth/signup')}
            >
              Créer un compte
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionPage;
