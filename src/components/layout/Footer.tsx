// @ts-nocheck
/**
 * Footer - Pied de page complet et accessible
 * Inclut tous les liens légaux et de navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  Shield,
  FileText,
  HelpCircle,
  Building2,
  Sparkles,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FooterSection {
  title: string;
  links: {
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
    external?: boolean;
  }[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Produits',
    links: [
      { name: 'Scanner Émotionnel', href: '/app/scan', icon: Sparkles },
      { name: 'Coach IA', href: '/app/coach', icon: Heart, badge: 'IA' },
      { name: 'Thérapie Musicale', href: '/app/music', badge: 'Premium' },
      { name: 'Respiration Guidée', href: '/app/breath' },
      { name: 'Journal Numérique', href: '/app/journal' },
    ]
  },
  {
    title: 'Entreprises',
    links: [
      { name: 'Solutions B2B', href: '/entreprise', icon: Building2 },
      { name: 'Dashboard RH', href: '/app/rh' },
      { name: 'Rapports & Analytics', href: '/b2b/reports' },
      { name: 'Gestion Équipes', href: '/app/teams' },
      { name: 'Tarifs Entreprise', href: '/pricing' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Centre d\'aide', href: '/faq', icon: HelpCircle },
      { name: 'Documentation', href: '/faq' },
      { name: 'Nous contacter', href: '/contact', icon: Mail },
    ]
  },
  {
    title: 'Légal',
    links: [
      { name: 'Mentions légales', href: '/legal/mentions', icon: FileText },
      { name: 'Conditions d\'utilisation', href: '/legal/terms', icon: FileText },
      { name: 'Conditions de vente', href: '/legal/sales', icon: FileText },
      { name: 'Politique de confidentialité', href: '/legal/privacy', icon: Shield },
      { name: 'Cookies', href: '/legal/cookies' },
    ]
  }
];

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/emotionscare', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/emotionscare', icon: Linkedin },
  { name: 'Instagram', href: 'https://instagram.com/emotionscare', icon: Instagram },
  { name: 'YouTube', href: 'https://youtube.com/@emotionscare', icon: Youtube },
];

const contactInfo = [
  { 
    icon: Mail, 
    label: 'Email', 
    value: 'contact@emotionscare.com',
    href: 'mailto:contact@emotionscare.com'
  },
  { 
    icon: Phone, 
    label: 'Téléphone', 
    value: '+33 1 23 45 67 89',
    href: 'tel:+33123456789'
  },
  { 
    icon: MapPin, 
    label: 'Adresse', 
    value: 'Paris, France',
    href: 'https://maps.google.com/?q=Paris,France'
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t mt-auto footer-harmony">
      {/* Newsletter Section */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Restez informé de nos dernières innovations
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Recevez les dernières actualités sur l'IA émotionnelle, nos nouvelles fonctionnalités 
              et des conseils exclusifs pour votre bien-être.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Adresse email pour la newsletter"
              />
              <Button className="px-6 py-3">
                S'abonner
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Pas de spam. Désabonnement possible à tout moment.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link 
              to="/" 
              className="flex items-center space-x-3 mb-6 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
              aria-label="EmotionsCare - Retour à l'accueil"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </Link>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              La première plateforme d'IA émotionnelle qui transforme votre bien-être 
              personnel et professionnel grâce à des technologies avancées.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <info.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>{info.value}</span>
                </a>
              ))}
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                RGPD Conforme
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                ISO 27001
              </Badge>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="font-semibold text-lg mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 group"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.icon && (
                        <link.icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      )}
                      <span>{link.name}</span>
                      {link.badge && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} EmotionsCare. Tous droits réservés. 
              <span className="ml-2">Conçu avec ❤️ à Paris</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground mr-3">Suivez-nous :</span>
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Suivre EmotionsCare sur ${social.name}`}
                    className="hover:scale-110 transition-transform"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <select 
                className="bg-transparent border-none focus:outline-none cursor-pointer"
                aria-label="Choisir la langue"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}