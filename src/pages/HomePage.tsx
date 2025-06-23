
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    console.log('%c[HomePage] Mounted successfully', 'color:lime; font-weight:bold');
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen">
      <HeroSection />
      
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Commencez votre parcours bien-être</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Particuliers (B2C)</h3>
              <p className="text-muted-foreground mb-4">
                Gérez votre stress et cultivez votre bien-être émotionnel au quotidien.
              </p>
              <Button asChild className="w-full">
                <Link to="/b2c/login">Accès Particulier</Link>
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Entreprises (B2B)</h3>
              <p className="text-muted-foreground mb-4">
                Solutions complètes pour le bien-être de vos équipes et collaborateurs.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/b2b/selection">Accès Entreprise</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
