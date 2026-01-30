/**
 * Footer - Pied de page EmotionsCare
 * Enrichi avec liens accessibilité et réseaux sociaux
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, BookOpen, Users, Accessibility, Twitter, Linkedin, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: 'Accueil', href: '/' },
      { label: 'Mon espace', href: '/app/home' },
      { label: 'Scanner émotionnel', href: '/app/scan' },
      { label: 'Musique thérapeutique', href: '/app/music' },
      { label: 'Parc émotionnel', href: '/app/emotional-park' },
    ],
    resources: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'Modules', href: '/app/modules' },
      { label: 'Communauté', href: '/app/community' },
      { label: 'Aide & Support', href: '/help' },
      { label: 'Accessibilité', href: '/accessibility' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/legal/mentions' },
      { label: 'Confidentialité', href: '/legal/privacy' },
      { label: 'CGV', href: '/legal/sales' },
      { label: 'Cookies', href: '/legal/cookies' },
      { label: 'Conditions d\'utilisation', href: '/legal/terms' },
    ],
    social: [
      { label: 'Twitter', href: 'https://twitter.com/emotionscare', icon: Twitter },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/emotionscare', icon: Linkedin },
      { label: 'Instagram', href: 'https://instagram.com/emotionscare', icon: Instagram },
      { label: 'YouTube', href: 'https://youtube.com/@emotionscare', icon: Youtube },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border/50 safe-area-bottom" role="contentinfo">
      <div className="container mx-auto px-4 py-12 pb-safe-bottom">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Heart className="h-5 w-5" aria-hidden="true" />
              EmotionsCare
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Prendre soin de celles et ceux qui prennent soin.
              Plateforme de régulation émotionnelle pour étudiants en santé et soignants.
            </p>
            
            {/* Badges de confiance */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                RGPD
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Accessibility className="h-3 w-3 mr-1" aria-hidden="true" />
                WCAG 2.1 AA
              </Badge>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 pt-2">
              {links.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label={`Suivez-nous sur ${social.label}`}
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
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
              <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
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
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} EmotionsCare. Tous droits réservés.
            </p>

            {/* Contact & Status */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a 
                href="mailto:contact@emotionscare.app" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                contact@emotionscare.app
              </a>
              
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                <span>Tous les services opérationnels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
