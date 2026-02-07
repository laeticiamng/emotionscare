/**
 * Footer - Pied de page EmotionsCare
 * Enrichi avec liens accessibilité et réseaux sociaux
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, BookOpen, Users, Accessibility, Twitter, Linkedin, Instagram, Youtube, ExternalLink, LockKeyhole } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: 'Accueil', href: '/', protected: false },
      { label: 'Mon espace', href: '/app/home', protected: true },
      { label: 'Scanner émotionnel', href: '/app/scan', protected: true },
      { label: 'Musique thérapeutique', href: '/app/music', protected: true },
      { label: 'Parc émotionnel', href: '/app/emotional-park', protected: true },
    ],
    resources: [
      { label: 'FAQ', href: '/faq' },
      { label: 'À propos', href: '/about' },
      { label: 'Aide & Support', href: '/help' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/legal/mentions' },
      { label: 'CGU', href: '/legal/terms' },
      { label: 'CGV', href: '/legal/sales' },
      { label: 'Confidentialité', href: '/legal/privacy' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
    social: [
      { label: 'Twitter', href: '#', icon: Twitter },
      { label: 'LinkedIn', href: '#', icon: Linkedin },
      { label: 'Instagram', href: '#', icon: Instagram },
      { label: 'YouTube', href: '#', icon: Youtube },
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
              <span
                key={social.label}
                className="relative p-2 rounded-lg bg-muted text-muted-foreground/40 cursor-default group"
                aria-label={`${social.label} (bientôt disponible)`}
                title={`${social.label} — bientôt disponible`}
              >
                <social.icon className="h-4 w-4" aria-hidden="true" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Bientôt
                </span>
              </span>
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    title={link.protected ? 'Connexion requise pour accéder à cette fonctionnalité' : undefined}
                  >
                    {link.label}
                    {link.protected && (
                      <LockKeyhole className="h-3 w-3 opacity-60" aria-label="Connexion requise" />
                    )}
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
                href="mailto:contact@emotionscare.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                contact@emotionscare.com
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
