
import React from 'react';
import { Heart, Shield, Globe } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-lg">{APP_CONFIG.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plateforme premium de bien-être émotionnel pour une vie plus équilibrée.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold mb-4">Fonctionnalités</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Mood Mixer</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Flash Glow</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Journal Émotionnel</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Musicothérapie</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Feedback</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Communauté</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">RGPD</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Fait avec passion</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Données sécurisées</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>Disponible mondialement</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_CONFIG.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
