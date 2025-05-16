
import React from 'react';
import { Link } from 'react-router-dom';

const MainFooter: React.FC = () => {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
        </p>
        <div className="flex gap-4">
          <Link
            to="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Confidentialité
          </Link>
          <Link
            to="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Conditions d'utilisation
          </Link>
          <Link
            to="/contact"
            className="text-sm text-muted-foreground hover:underline"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
