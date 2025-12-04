/**
 * MarketingFooter - Footer pour les pages marketing/publiques
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketingFooterProps {
  className?: string;
}

const MarketingFooter: React.FC<MarketingFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Fonctionnalités', href: '#features' },
      { label: 'Tarifs', href: '/pricing' },
      { label: 'Démo', href: '/demo' },
      { label: 'Entreprises', href: '/entreprise' },
    ],
    resources: [
      { label: 'Documentation', href: '/help' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Support', href: '/contact' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/legal/mentions' },
      { label: 'Confidentialité', href: '/legal/privacy' },
      { label: 'CGU', href: '/legal/terms' },
      { label: 'Cookies', href: '/legal/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/emotionscare', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/emotionscare', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/emotionscare', label: 'GitHub' },
    { icon: Mail, href: 'mailto:contact@emotionscare.app', label: 'Email' },
  ];

  return (
    <footer className={cn("bg-muted/30 border-t border-border/50", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">EmotionsCare</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Votre compagnon de bien-être émotionnel propulsé par l'IA.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} EmotionsCare. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fait avec</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>en France</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
