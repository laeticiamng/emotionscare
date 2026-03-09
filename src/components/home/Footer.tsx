/**
 * Footer - Pied de page EmotionsCare
 * Liens vérifiés vers routes publiques uniquement
 * Infos légales EMOTIONSCARE SASU — SIREN 944 505 445
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, BookOpen, Accessibility, LockKeyhole, Building2, MapPin, Linkedin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: 'Accueil', href: '/' },
      { label: 'Fonctionnalités', href: '/features' },
      { label: 'Tarifs', href: '/pricing' },
    ],
    resources: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Aide & Support', href: '/help' },
    ],
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Sécurité', href: '/security' },
      { label: 'Entreprise B2B', href: '/b2b' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/legal/mentions' },
      { label: 'CGU', href: '/legal/terms' },
      { label: 'CGV', href: '/legal/sales' },
      { label: 'Confidentialité', href: '/legal/privacy' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border/50 safe-area-bottom" role="contentinfo">
      <div className="container mx-auto px-4 py-12 pb-safe-bottom">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
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
                <LockKeyhole className="h-3 w-3 mr-1" aria-hidden="true" />
                Sécurité renforcée
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Accessibility className="h-3 w-3 mr-1" aria-hidden="true" />
                Accessible à tous
              </Badge>
            </div>

            {/* Coordonnées */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span>80000 Amiens, France</span>
              </div>
              <a 
                href="mailto:contact@emotionscare.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                contact@emotionscare.com
              </a>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/emotionscare/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Page LinkedIn EMOTIONSCARE SASU"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                EMOTIONSCARE
              </a>
              <a
                href="https://www.linkedin.com/in/laeticiamotongane/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Profil LinkedIn de Laeticia Motongane"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                Fondatrice
              </a>
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

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Entreprise
            </h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
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
              © {currentYear} EmotionsCare — EMOTIONSCARE SASU — SIREN 944 505 445 — Amiens, France
            </p>

            {/* Horaires */}
            <p className="text-xs text-muted-foreground">
              Lun – Ven : 9h00 – 18h00 · Réponse sous 24-48h ouvrées
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
