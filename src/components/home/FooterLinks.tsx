
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks: React.FC = () => {
  return (
    <footer className="bg-muted/20 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">EmotionsCare</h3>
            <p className="text-muted-foreground text-sm">
              Plateforme de bien-être émotionnel pour particuliers et entreprises.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground text-sm hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground text-sm hover:text-foreground">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/b2c/login" className="text-muted-foreground text-sm hover:text-foreground">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/b2c/register" className="text-muted-foreground text-sm hover:text-foreground">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Entreprises</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/b2b/selection" className="text-muted-foreground text-sm hover:text-foreground">
                  Solutions entreprise
                </Link>
              </li>
              <li>
                <Link to="/b2b/user/login" className="text-muted-foreground text-sm hover:text-foreground">
                  Espace collaborateur
                </Link>
              </li>
              <li>
                <Link to="/b2b/admin/login" className="text-muted-foreground text-sm hover:text-foreground">
                  Espace administrateur
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-muted-foreground text-sm hover:text-foreground">
                  Assistance
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground text-sm hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground text-sm hover:text-foreground">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground text-sm hover:text-foreground">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLinks;
