/**
 * Footer - Pied de page EmotionsCare
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, BookOpen, Users } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: 'Accueil', href: '/' },
      { label: 'Mon espace', href: '/app/home' },
      { label: 'Scanner émotionnel', href: '/app/scan' },
      { label: 'Musique thérapeutique', href: '/app/music' },
    ],
    resources: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'Academy', href: '/app/academy' },
      { label: 'Communauté', href: '/app/community' },
      { label: 'Support', href: '/support' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/legal/mentions' },
      { label: 'Politique de confidentialité', href: '/legal/privacy' },
      { label: 'CGV', href: '/legal/sales' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Heart className="h-5 w-5" />
              EmotionsCare
            </Link>
            <p className="text-sm text-muted-foreground">
              Prendre soin de celles et ceux qui prennent soin.
              Plateforme de régulation émotionnelle pour étudiants en santé et soignants.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>100% confidentiel • RGPD</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Plateforme
            </h4>
            <ul className="space-y-2">
              {links.platform.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Ressources
            </h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Légal
            </h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} EmotionsCare. Tous droits réservés.
            </p>

            {/* Contact */}
            <div className="flex items-center gap-4">
              <a 
                href="mailto:contact@emotionscare.app" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                contact@emotionscare.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
