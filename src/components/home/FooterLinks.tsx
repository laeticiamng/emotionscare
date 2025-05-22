
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-muted pt-6">
        <div className="text-sm text-muted-foreground mb-4 md:mb-0">
          © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
            Mentions légales
          </Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Politique de confidentialité
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Conditions d'utilisation
          </Link>
          <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
            Cookies
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterLinks;
