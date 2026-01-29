/**
 * EnhancedFooter - Footer élégant style Apple
 * Design minimaliste avec gradient subtil et animations fluides
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Mail, Shield, Twitter, Linkedin, Instagram } from 'lucide-react';

const EnhancedFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { label: 'Fonctionnalités', to: '/navigation' },
      { label: 'Tarifs', to: '/pricing' },
      { label: 'Entreprise', to: '/b2b' },
      { label: 'Témoignages', to: routes.public.testimonials() },
    ],
    resources: [
      { label: 'Blog', to: routes.public.blog() },
      { label: 'Aide', to: '/help' },
      { label: 'Contact', to: routes.public.contact() },
      { label: 'À propos', to: routes.public.about() },
    ],
    legal: [
      { label: 'Confidentialité', to: '/legal/privacy' },
      { label: 'Conditions', to: '/legal/terms' },
      { label: 'Cookies', to: '/legal/cookies' },
      { label: 'Mentions légales', to: '/legal/mentions' },
    ],
  };
  
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/emotionscare', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/emotionscare', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/emotionscare', label: 'Instagram' },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02] pointer-events-none" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight">EmotionsCare</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Votre compagnon pour l'équilibre émotionnel. Scan IA, coaching personnalisé et outils de bien-être mental.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>© {currentYear} EmotionsCare</span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                RGPD
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Fait avec</span>
              <Heart className="h-3 w-3 text-destructive" />
              <span>en France</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
